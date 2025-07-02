import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'
import { sendOrderUpdatedEmail } from '../../../utils/email'

// Define allowed status transitions based on user role and current status
const allowedTransitions = {
    [OrderStatus.PENDING]: {
        TRUCK_PROVIDER: [OrderStatus.ACCEPTED, OrderStatus.REJECTED],
        LOAD_PROVIDER: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
        ADMIN: [OrderStatus.ACCEPTED, OrderStatus.REJECTED, OrderStatus.CANCELLED]
    },
    [OrderStatus.ACCEPTED]: {
        TRUCK_PROVIDER: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED],
        LOAD_PROVIDER: [OrderStatus.CANCELLED],
        ADMIN: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED]
    },
    [OrderStatus.IN_TRANSIT]: {
        TRUCK_PROVIDER: [],
        LOAD_PROVIDER: [OrderStatus.COMPLETED],
        ADMIN: [OrderStatus.COMPLETED, OrderStatus.CANCELLED]
    },
    [OrderStatus.COMPLETED]: {
        TRUCK_PROVIDER: [],
        LOAD_PROVIDER: [],
        ADMIN: []
    },
    [OrderStatus.CANCELLED]: {
        TRUCK_PROVIDER: [],
        LOAD_PROVIDER: [],
        ADMIN: [OrderStatus.PENDING]
    },
    [OrderStatus.REJECTED]: {
        TRUCK_PROVIDER: [],
        LOAD_PROVIDER: [],
        ADMIN: [OrderStatus.PENDING]
    }
}

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

        // Get request body
        const body = await readBody(event)
        const { status, notes } = body || {}

        if (!status || !Object.values(OrderStatus).includes(status)) {
            throw createError({
                statusCode: 400,
                message: 'Valid status is required'
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

        // Determine user's role in the context of this order
        let contextRole = 'ADMIN' // Default for admin and super admin
        if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            if (order.truckProviderId === userId) {
                contextRole = 'TRUCK_PROVIDER'
            } else if (order.loadProviderId === userId) {
                contextRole = 'LOAD_PROVIDER'
            } else {
                throw createError({
                    statusCode: 403,
                    message: 'Unauthorized: You are not involved in this order'
                })
            }
        }

        // Check if transition is allowed
        const allowedStatusChanges = allowedTransitions[order.status]?.[contextRole] || []
        if (!allowedStatusChanges.includes(status)) {
            throw createError({
                statusCode: 400,
                message: `Cannot change order status from ${order.status} to ${status} with your permissions`
            })
        }

        // Prepare update data
        const updateData: any = {
            status,
            notes: notes ? `${order.notes || ''}\n\nStatus update to ${status}: ${notes}`.trim() : order.notes
        }

        // Add timestamps based on status
        if (status === OrderStatus.ACCEPTED) {
            updateData.acceptedAt = new Date()
        } else if (status === OrderStatus.IN_TRANSIT) {
            updateData.startedAt = new Date()
        } else if (status === OrderStatus.COMPLETED) {
            updateData.completedAt = new Date()
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData,
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
          await sendOrderUpdatedEmail(updatedOrder.truckProvider.email, updatedOrder, status)
        }
        if (updatedOrder.loadProvider?.email) {
          await sendOrderUpdatedEmail(updatedOrder.loadProvider.email, updatedOrder, status)
        }

        // Handle truck and load availability based on status
        if (status === OrderStatus.ACCEPTED) {
            // When order is accepted, mark truck and load as unavailable
            await prisma.truck.update({
                where: { id: order.truckId },
                data: { isAvailable: false }
            })

            await prisma.load.update({
                where: { id: order.loadId },
                data: { isAvailable: false }
            })

            console.log(`Marked truck ${order.truckId} and load ${order.loadId} as unavailable after accepting order`)
        } else if (status === OrderStatus.CANCELLED || status === OrderStatus.REJECTED) {
            // Make truck and load available again
            await prisma.truck.update({
                where: { id: order.truckId },
                data: { isAvailable: true }
            })

            await prisma.load.update({
                where: { id: order.loadId },
                data: { isAvailable: true }
            })

            console.log(`Marked truck ${order.truckId} and load ${order.loadId} as available after cancelling/rejecting order`)
        } else if (status === OrderStatus.COMPLETED || status === OrderStatus.DELIVERED) {
            // Only make truck available again, load remains unavailable
            await prisma.truck.update({
                where: { id: order.truckId },
                data: { isAvailable: true }
            })

            console.log(`Marked truck ${order.truckId} as available after completing order, load ${order.loadId} remains unavailable`)
        }

        return {
            order: updatedOrder,
            message: `Order status updated to ${status} successfully`
        }
    } catch (error: any) {
        console.error('Error updating order status:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error updating order status'
        })
    }
}) 