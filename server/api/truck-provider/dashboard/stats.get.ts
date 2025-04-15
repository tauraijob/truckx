import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get authenticated user
        const session = await getServerSession(event)
        if (!session || !session.user) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Verify user is a truck provider
        const userId = session.user.id
        const userRole = session.user.role

        if (userRole !== 'TRUCK_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Only truck providers can access this resource'
            })
        }

        console.log('Fetching dashboard stats for truck provider:', userId)

        // Get truck counts
        const totalTrucks = await prisma.truck.count({
            where: { providerId: userId }
        })

        const availableTrucks = await prisma.truck.count({
            where: {
                providerId: userId,
                isAvailable: true
            }
        })

        // Get order counts
        const activeOrders = await prisma.order.count({
            where: {
                truckProviderId: userId,
                status: {
                    in: ['PENDING', 'ACCEPTED', 'IN_TRANSIT']
                }
            }
        })

        const pendingOrders = await prisma.order.count({
            where: {
                truckProviderId: userId,
                status: 'PENDING'
            }
        })

        // Get all orders for calculating earnings
        const orders = await prisma.order.findMany({
            where: {
                truckProviderId: userId,
                status: {
                    in: ['ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED']
                }
            },
            include: {
                load: true
            }
        })

        // Calculate total earnings (98% of load price)
        const totalEarnings = orders.reduce((sum, order) => {
            const loadPrice = order.load?.price || order.price || 0
            const earning = loadPrice * 0.98
            return sum + earning
        }, 0)

        // Calculate monthly earnings
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const thisMonthOrders = orders.filter(order =>
            new Date(order.createdAt) >= firstDayOfMonth
        )
        const monthlyEarnings = thisMonthOrders.reduce((sum, order) => {
            const loadPrice = order.load?.price || order.price || 0
            const earning = loadPrice * 0.98
            return sum + earning
        }, 0)

        console.log('Stats calculated:', {
            totalTrucks,
            availableTrucks,
            activeOrders,
            pendingOrders,
            totalEarnings,
            monthlyEarnings
        })

        return {
            totalTrucks,
            availableTrucks,
            activeOrders,
            pendingOrders,
            totalEarnings,
            monthlyEarnings
        }

    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching dashboard statistics'
        })
    }
}) 