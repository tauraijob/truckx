import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'
import { sendOrderCancelledEmail } from '../../../utils/email'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
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
            where: { id }
        })

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found'
            })
        }

        // Check if user is authorized to cancel this order
        if (order.loadProviderId !== userId && order.truckProviderId !== userId &&
            userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Unauthorized: You can only cancel your own orders'
            })
        }

        // Check if order can be cancelled
        // Only PENDING or ACCEPTED orders can be cancelled
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.ACCEPTED) {
            throw createError({
                statusCode: 400,
                message: `Cannot cancel order in ${order.status} status`
            })
        }

        // Get request body
        const body = await readBody(event)
        const { reason } = body || {}

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.CANCELLED,
                notes: reason ? `${order.notes || ''}\n\nCancellation reason: ${reason}`.trim() : order.notes
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

        // Also update the truck and load availability if they were exclusively assigned to this order
        await prisma.truck.update({
            where: { id: order.truckId },
            data: { isAvailable: true }
        })

        await prisma.load.update({
            where: { id: order.loadId },
            data: { isAvailable: true }
        })

        // Send email notifications
        if (updatedOrder.truckProvider?.email) {
            await sendOrderCancelledEmail(updatedOrder.truckProvider.email, updatedOrder)
        }
        if (updatedOrder.loadProvider?.email) {
            await sendOrderCancelledEmail(updatedOrder.loadProvider.email, updatedOrder)
        }

        return {
            order: updatedOrder,
            message: 'Order cancelled successfully'
        }
    } catch (error: any) {
        console.error('Error cancelling order:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error cancelling order'
        })
    }
}) 