import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID and role from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Get order ID from route params
        const id = event.context.params?.id

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Order ID is required'
            })
        }

        // Get order with relations
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                load: true,
                truck: true,
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profileImage: true
                    }
                },
                loadProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        profileImage: true
                    }
                },
                payment: true
            }
        })

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found'
            })
        }

        // Check if user is authorized to view this order
        // Only the load provider, truck provider, or admin/super_admin can view it
        if (order.loadProviderId !== userId &&
            order.truckProviderId !== userId &&
            userRole !== 'ADMIN' &&
            userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Unauthorized: You cannot view this order'
            })
        }

        return { order }
    } catch (error: any) {
        console.error('Error fetching order details:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching order details'
        })
    }
}) 