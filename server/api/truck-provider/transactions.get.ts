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

        console.log('Fetching transactions for truck provider:', userId)

        // Get query parameters
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 10
        const skip = (page - 1) * limit

        // Get all orders for this truck provider
        const orders = await prisma.order.findMany({
            where: {
                truckProviderId: userId
            },
            include: {
                load: {
                    include: {
                        provider: true
                    }
                },
                truck: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        })

        console.log(`Found ${orders.length} transactions for truck provider`)

        // Get total count for pagination
        const total = await prisma.order.count({
            where: {
                truckProviderId: userId
            }
        })

        // Transform orders into transactions
        const transactions = orders.map(order => {
            let status = 'pending'
            if (order.status === 'DELIVERED' || order.status === 'COMPLETED') {
                status = 'completed'
            } else if (order.status === 'CANCELLED') {
                status = 'failed'
            } else if (order.status === 'IN_TRANSIT') {
                status = 'in progress'
            } else if (order.status === 'ACCEPTED') {
                status = 'accepted'
            }

            // Calculate the 98% of load price (2% platform fee)
            const loadPrice = order.load?.price || order.price || 0
            const amount = loadPrice * 0.98

            const loadTitle = order.load?.title || 'Unnamed Load'
            const loadProvider = order.load?.provider
                ? `${order.load.provider.firstName} ${order.load.provider.lastName}`
                : 'Unknown Provider'

            return {
                id: order.id,
                date: order.createdAt,
                description: `Order for "${loadTitle}" from ${loadProvider}`,
                orderId: order.id,
                amount: amount,
                status
            }
        })

        return {
            transactions,
            total,
            page,
            limit
        }
    } catch (error: any) {
        console.error('Error fetching transactions:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching transactions'
        })
    }
}) 