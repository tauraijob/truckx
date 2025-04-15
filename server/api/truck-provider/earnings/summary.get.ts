import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get the authenticated user
        const session = await getServerSession(event)
        if (!session || !session.user) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        const userId = session.user.id

        // Verify the user is a truck provider
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user || user.role !== 'TRUCK_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Only truck providers can access this resource'
            })
        }

        console.log('Fetching earnings summary for truck provider:', userId)

        // Get all orders associated with the truck provider's trucks
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

        console.log(`Found ${orders.length} orders for truck provider`)

        // Calculate total earnings (98% of each load price)
        const totalEarnings = orders.reduce((sum, order) => {
            const loadPrice = order.load?.price || order.price || 0
            // Truck provider gets 98% of the load price (2% platform fee)
            const earning = loadPrice * 0.98
            return sum + earning
        }, 0)

        // Calculate this month's earnings
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const thisMonthOrders = orders.filter(order =>
            new Date(order.createdAt) >= firstDayOfMonth
        )
        const thisMonth = thisMonthOrders.reduce((sum, order) => {
            const loadPrice = order.load?.price || order.price || 0
            const earning = loadPrice * 0.98
            return sum + earning
        }, 0)

        // Calculate pending payments (orders that are in transit but not delivered)
        const pendingOrders = orders.filter(order =>
            ['ACCEPTED', 'IN_TRANSIT'].includes(order.status)
        )
        const pendingPayments = pendingOrders.reduce((sum, order) => {
            const loadPrice = order.load?.price || order.price || 0
            const earning = loadPrice * 0.98
            return sum + earning
        }, 0)

        // Calculate next payment (most recent accepted order)
        const nextPaymentOrder = pendingOrders.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]

        const nextPayment = nextPaymentOrder
            ? (nextPaymentOrder.load?.price || nextPaymentOrder.price || 0) * 0.98
            : 0

        console.log({
            totalEarnings,
            thisMonth,
            pendingPayments,
            nextPayment
        })

        return {
            summary: {
                totalEarnings,
                thisMonth,
                pendingPayments,
                nextPayment
            }
        }
    } catch (error: any) {
        console.error('Error fetching earnings summary:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching earnings summary'
        })
    }
}) 