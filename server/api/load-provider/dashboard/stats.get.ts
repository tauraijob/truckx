import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        console.log('Load provider dashboard stats - Auth context:', { userId, userRole })

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Access denied. Only load providers can access this endpoint.'
            })
        }

        // Get the current date
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)

        // Get total and active loads count
        const totalLoads = await prisma.load.count({
            where: { providerId: userId }
        })

        const activeLoads = await prisma.load.count({
            where: {
                providerId: userId,
                isAvailable: true
            }
        })

        // Get active orders count (orders in PENDING, ACCEPTED, or IN_TRANSIT status)
        const activeOrders = await prisma.order.count({
            where: {
                loadProviderId: userId,
                status: {
                    in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT]
                }
            }
        })

        // Get pending orders count
        const pendingOrders = await prisma.order.count({
            where: {
                loadProviderId: userId,
                status: OrderStatus.PENDING
            }
        })

        // Get total payments amount (sum of order prices for ACCEPTED, IN_TRANSIT, and COMPLETED orders)
        const totalOrdersResult = await prisma.order.aggregate({
            where: {
                loadProviderId: userId,
                status: {
                    in: [OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT, OrderStatus.COMPLETED]
                }
            },
            _sum: {
                price: true
            }
        })
        const totalPayments = totalOrdersResult._sum.price || 0

        // Get monthly payments amount (orders accepted in current month)
        const monthlyOrdersResult = await prisma.order.aggregate({
            where: {
                loadProviderId: userId,
                status: {
                    in: [OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT, OrderStatus.COMPLETED]
                },
                createdAt: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            },
            _sum: {
                price: true
            }
        })
        const monthlyPayments = monthlyOrdersResult._sum.price || 0

        console.log('Load provider dashboard stats - Results:', {
            totalLoads,
            activeLoads,
            activeOrders,
            pendingOrders,
            totalPayments,
            monthlyPayments
        })

        // Return the dashboard stats
        return {
            totalLoads,
            activeLoads,
            activeOrders,
            pendingOrders,
            totalPayments,
            monthlyPayments
        }
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching dashboard statistics'
        })
    }
}) 