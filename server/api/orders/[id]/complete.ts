import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'
import { sendOrderCompletedEmail } from '../../../utils/email'

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

        // Check if user is authorized to complete this order
        // Only the load provider, admins, or super admins can mark an order as completed
        if (order.loadProviderId !== userId &&
            userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Unauthorized: Only load providers or admins can mark orders as completed'
            })
        }

        // Check if order can be completed
        // Only IN_TRANSIT orders can be completed
        if (order.status !== OrderStatus.IN_TRANSIT) {
            throw createError({
                statusCode: 400,
                message: `Cannot complete order in ${order.status} status`
            })
        }

        // Get request body for any additional completion details
        const body = await readBody(event)
        const { notes } = body || {}

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.COMPLETED,
                completedAt: new Date(),
                notes: notes ? `${order.notes || ''}\n\nCompletion notes: ${notes}`.trim() : order.notes
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

        // Send email notifications
        if (updatedOrder.truckProvider?.email) {
          await sendOrderCompletedEmail(updatedOrder.truckProvider.email, updatedOrder)
        }
        if (updatedOrder.loadProvider?.email) {
          await sendOrderCompletedEmail(updatedOrder.loadProvider.email, updatedOrder)
        }

        // Make the truck available again
        await prisma.truck.update({
            where: { id: order.truckId },
            data: { isAvailable: true }
        })

        return {
            order: updatedOrder,
            message: 'Order marked as completed successfully'
        }
    } catch (error: any) {
        console.error('Error completing order:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error completing order'
        })
    }
}) 