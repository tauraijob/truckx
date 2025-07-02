import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'
import { sendOrderCreatedEmail } from '../../utils/email'

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

        // Only load providers, admins, or super admins can create orders
        if (userRole !== 'LOAD_PROVIDER' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Unauthorized: Only load providers can create orders'
            })
        }

        // Get request body
        const body = await readBody(event)
        const { loadId, truckId, price, notes } = body || {}

        // Validate request body
        if (!loadId) {
            throw createError({
                statusCode: 400,
                message: 'Load ID is required'
            })
        }

        if (!truckId) {
            throw createError({
                statusCode: 400,
                message: 'Truck ID is required'
            })
        }

        if (!price || price <= 0) {
            throw createError({
                statusCode: 400,
                message: 'Valid price is required'
            })
        }

        // Check if load exists and belongs to the user (if not admin)
        const load = await prisma.load.findUnique({
            where: { id: loadId }
        })

        if (!load) {
            throw createError({
                statusCode: 404,
                message: 'Load not found'
            })
        }

        // If user is not admin, ensure they own the load
        if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN' && load.providerId !== userId) {
            console.error(`Authorization failed: User ${userId} with role ${userRole} attempted to create order for load ${loadId} owned by ${load.providerId}`);
            throw createError({
                statusCode: 403,
                message: 'Unauthorized: You can only create orders for your own loads'
            })
        }

        // Check if load is available
        if (!load.isAvailable) {
            throw createError({
                statusCode: 400,
                message: 'This load is not available for booking'
            })
        }

        // Check if truck exists and is available
        const truck = await prisma.truck.findUnique({
            where: { id: truckId }
        })

        console.log(`Truck lookup: ID ${truckId}, Found: ${!!truck}, Available: ${truck?.isAvailable}, Provider: ${truck?.providerId}`);

        if (!truck) {
            throw createError({
                statusCode: 404,
                message: 'Truck not found'
            })
        }

        if (!truck.isAvailable) {
            throw createError({
                statusCode: 400,
                message: 'This truck is not available for booking'
            })
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                loadId,
                truckId,
                truckProviderId: truck.providerId,
                loadProviderId: userId,
                price,
                platformFee: price * 0.02, // 2% platform fee
                status: OrderStatus.PENDING,
                notes: notes || ''
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
        if (order.truckProvider?.email) {
          await sendOrderCreatedEmail(order.truckProvider.email, order)
        }
        if (order.loadProvider?.email) {
          await sendOrderCreatedEmail(order.loadProvider.email, order)
        }

        // Update load and truck availability
        await prisma.load.update({
            where: { id: loadId },
            data: { isAvailable: false }
        })

        await prisma.truck.update({
            where: { id: truckId },
            data: { isAvailable: false }
        })

        return {
            order,
            message: 'Order created successfully'
        }
    } catch (error: any) {
        console.error('Error creating order:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error creating order'
        })
    }
}) 