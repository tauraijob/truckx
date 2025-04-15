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

        console.log('Fetching recent orders for truck provider:', userId)

        // Get recent orders for this truck provider
        const recentOrders = await prisma.order.findMany({
            where: {
                truckProviderId: userId
            },
            include: {
                load: true,
                truck: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })

        console.log(`Found ${recentOrders.length} recent orders`)

        // Transform data to expected format
        const formattedOrders = recentOrders.map(order => {
            return {
                id: order.id,
                loadName: order.load?.title || 'Unnamed Load',
                loadId: order.load?.id || '',
                truckName: order.truck
                    ? `${order.truck.make || ''} ${order.truck.model || ''} - ${order.truck.licensePlate || ''}`
                    : 'Unassigned',
                truckId: order.truck?.id || '',
                pickupDate: order.load?.pickupDate || order.createdAt,
                deliveryDate: order.load?.deliveryDate ||
                    new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: order.status,
                price: order.load?.price || order.price || 0
            }
        })

        return formattedOrders
    } catch (error: any) {
        console.error('Error fetching recent orders:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching recent orders'
        })
    }
}) 