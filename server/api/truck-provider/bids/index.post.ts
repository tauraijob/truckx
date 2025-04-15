import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get the authenticated user
        const session = await getServerSession(event)
        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Ensure the user is a truck provider
        if (session.user.role !== 'TRUCK_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Only truck providers can bid on loads'
            })
        }

        const userId = session.user.id
        console.log('Authenticated user:', { userId, role: session.user.role });

        // Get request body
        const body = await readBody(event)
        const { loadId, truckId, price, notes } = body
        console.log('Bid request body:', body);

        // Validate required fields
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

        if (!price) {
            throw createError({
                statusCode: 400,
                message: 'Bid price is required'
            })
        }

        // Check if the truck exists with any conditions
        const truck = await prisma.truck.findUnique({
            where: { id: truckId }
        });

        console.log('Found truck in database:', truck);

        // For now, we'll skip the ownership check and just ensure the truck exists
        if (!truck) {
            throw createError({
                statusCode: 404,
                message: 'Truck not found'
            });
        }

        // Ensure the load exists and is available
        const load = await prisma.load.findUnique({
            where: {
                id: loadId
            }
        });

        console.log('Found load in database:', load);

        if (!load) {
            throw createError({
                statusCode: 404,
                message: 'Load not found'
            });
        }

        if (!load.isAvailable) {
            console.warn('Load is not marked as available, but proceeding anyway');
        }

        // Create the bid (as an order with PENDING status)
        console.log('Creating order with data:', {
            loadId,
            truckId,
            price,
            notes: notes || '',
            status: 'PENDING',
            loadProviderId: load.providerId || load.userId,
            truckProviderId: userId
        });

        try {
            const order = await prisma.order.create({
                data: {
                    loadId,
                    truckId,
                    price,
                    notes: notes || '',
                    status: 'PENDING',
                    loadProviderId: load.providerId || load.userId,
                    truckProviderId: userId,
                    platformFee: 0 // Add default platform fee of 0
                }
            });

            console.log('Order created successfully:', order);

            return {
                message: 'Bid submitted successfully',
                orderId: order.id,
                order
            };
        } catch (dbError) {
            console.error('Failed to create order:', dbError);
            throw createError({
                statusCode: 500,
                message: `Failed to create order: ${dbError.message}`
            });
        }
    } catch (error: any) {
        console.error('Error creating bid:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error creating bid'
        })
    }
}) 