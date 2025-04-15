import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'

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

        // Get order
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                load: true,
                truck: true
            }
        })

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found'
            })
        }

        // Verify the user is the load provider for this order
        if (order.loadProviderId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Unauthorized: Only the load provider can accept this order'
            })
        }

        // Verify the order is in PENDING status
        if (order.status !== OrderStatus.PENDING) {
            throw createError({
                statusCode: 400,
                message: `Cannot accept order with status ${order.status}`
            })
        }

        // Update order status to ACCEPTED
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.ACCEPTED,
                acceptedAt: new Date(),
                notes: `${order.notes || ''}\n\nOrder accepted by load provider at ${new Date().toISOString()}`.trim()
            },
            include: {
                load: true,
                truck: true,
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                loadProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        // Mark the truck and load as unavailable
        await prisma.truck.update({
            where: { id: order.truckId },
            data: { isAvailable: false }
        })

        await prisma.load.update({
            where: { id: order.loadId },
            data: { isAvailable: false }
        })

        return {
            order: updatedOrder,
            message: 'Order accepted successfully'
        }
    } catch (error: any) {
        console.error('Error accepting order:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error accepting order'
        })
    }
}) 