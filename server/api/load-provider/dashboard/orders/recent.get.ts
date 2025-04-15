import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        console.log('Load provider recent orders - Auth context:', { userId, userRole })

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Access denied. Only load providers can access this endpoint.'
            })
        }

        // Get the 5 most recent orders for this load provider
        const recentOrders = await prisma.order.findMany({
            where: {
                loadProviderId: userId
            },
            include: {
                load: true,
                truck: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        })

        console.log(`Found ${recentOrders.length} recent orders for load provider ${userId}`)

        // Transform the data to the expected format
        const formattedOrders = recentOrders.map(order => {
            // Handle possible null truck data
            const truckName = order.truck
                ? `${order.truck.make || 'Unknown'} ${order.truck.model || ''} - ${order.truck.licensePlate || 'No plate'}`
                : 'Unknown truck';

            return {
                id: order.id,
                loadName: order.load ? order.load.title : 'Unknown Load',
                loadId: order.loadId,
                truckName,
                truckId: order.truckId,
                pickupDate: order.load ? order.load.createdAt.toISOString() : order.createdAt.toISOString(),
                deliveryDate: order.completedAt?.toISOString() ||
                    (order.load
                        ? new Date(order.load.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        : new Date(order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()),
                status: order.status,
                price: order.price || (order.load ? order.load.price : 0)
            }
        })

        console.log('Formatted orders:', formattedOrders.map(o => ({ id: o.id, status: o.status })));

        return formattedOrders
    } catch (error: any) {
        console.error('Error fetching recent orders:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching recent orders'
        })
    }
}) 