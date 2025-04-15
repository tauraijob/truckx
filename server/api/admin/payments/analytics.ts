import { db } from '~/server/db'
import { PaymentType, OrderStatus } from '~/server/utils/enums'
import { getServerSession } from '#auth'

// Platform fee percentage
const PLATFORM_FEE_PERCENTAGE = 0.02 // 2%

export default defineEventHandler(async (event) => {
    try {
        // Get authenticated user session
        const session = await getServerSession(event)
        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Check if user is admin
        if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Admin access required'
            })
        }

        console.log('Admin fetching platform payment analytics')

        // Get all accepted orders with their loads
        const acceptedOrders = await db.order.findMany({
            where: {
                status: {
                    in: ['ACCEPTED', 'IN_TRANSIT', 'COMPLETED']
                }
            },
            include: {
                load: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                },
                truck: {
                    select: {
                        id: true,
                        make: true,
                        model: true
                    }
                },
                loadProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                payments: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log(`Admin found ${acceptedOrders.length} accepted orders`)

        // Calculate financial metrics based on business logic
        const calculatedMetrics = acceptedOrders.reduce((metrics, order) => {
            // Only process orders with load information and price
            if (order.load && order.load.price) {
                const loadPrice = order.load.price;
                const platformFee = loadPrice * PLATFORM_FEE_PERCENTAGE;
                const providerEarning = loadPrice - platformFee;

                metrics.totalLoadValue += loadPrice;
                metrics.totalPlatformFees += platformFee;
                metrics.totalProviderEarnings += providerEarning;
            }
            return metrics;
        }, {
            totalLoadValue: 0,
            totalPlatformFees: 0,
            totalProviderEarnings: 0
        });

        console.log('Calculated metrics:', calculatedMetrics);

        // Get monthly data (last 12 months)
        const today = new Date()
        const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

        // Create a monthly breakdown of the last 12 months
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
            const monthName = month.toLocaleString('default', { month: 'short' })
            const year = month.getFullYear()

            // Filter orders for this month
            const monthOrders = acceptedOrders.filter(order => {
                const orderDate = new Date(order.createdAt)
                return orderDate.getMonth() === month.getMonth() &&
                    orderDate.getFullYear() === month.getFullYear()
            })

            // Calculate monthly metrics
            const monthMetrics = monthOrders.reduce((metrics, order) => {
                if (order.load && order.load.price) {
                    const loadPrice = order.load.price;
                    const platformFee = loadPrice * PLATFORM_FEE_PERCENTAGE;
                    const providerEarning = loadPrice - platformFee;

                    metrics.totalLoadValue += loadPrice;
                    metrics.platformFees += platformFee;
                    metrics.earnings += providerEarning;
                }
                return metrics;
            }, {
                totalLoadValue: 0,
                platformFees: 0,
                earnings: 0
            });

            return {
                month: monthName,
                year: year,
                platformFees: monthMetrics.platformFees,
                earnings: monthMetrics.earnings,
                revenue: monthMetrics.totalLoadValue,
                count: monthOrders.length
            }
        }).reverse()

        console.log('Admin generated monthly revenue data:', monthlyData)

        // Format recent transactions from orders
        const recentTransactions = acceptedOrders.slice(0, 5).map(order => {
            const loadPrice = order.load?.price || 0;
            const platformFee = loadPrice * PLATFORM_FEE_PERCENTAGE;

            return {
                id: order.id,
                type: 'PLATFORM_FEE',
                amount: Math.abs(platformFee),
                description: `Platform fee for load: ${order.load?.title || 'Unnamed Load'}`,
                createdAt: order.createdAt,
                user: {
                    name: order.loadProvider ?
                        `${order.loadProvider.firstName} ${order.loadProvider.lastName}` :
                        'Unknown User',
                    email: order.loadProvider?.email || 'unknown@email.com',
                    role: order.loadProvider?.role || 'UNKNOWN'
                },
                formattedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            }
        });

        // Ensure we have data for chart even if empty
        if (monthlyData.length === 0) {
            const emptyMonth = {
                month: 'No Data',
                year: today.getFullYear(),
                platformFees: 0,
                earnings: 0,
                revenue: 0,
                count: 0
            }
            monthlyData.push(emptyMonth)
        }

        return {
            totalPlatformFees: calculatedMetrics.totalPlatformFees,
            totalEarnings: calculatedMetrics.totalProviderEarnings,
            totalPayments: acceptedOrders.length,
            totalTransactions: calculatedMetrics.totalLoadValue,
            monthlyRevenue: monthlyData,
            recentTransactions
        }
    } catch (error) {
        console.error('Error fetching admin payment analytics:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching payment analytics'
        })
    }
}) 