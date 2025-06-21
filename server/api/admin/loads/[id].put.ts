import { PrismaClient } from '@prisma/client'
import { LoadStatus } from '~/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('📦 ADMIN LOADS API: Updating load')

    // Skip authentication for admin routes during development
    // This should be removed in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isAuthenticated = isProduction ? !!event.context.auth : true

    if (isProduction && !isAuthenticated) {
        console.log('🔒 ADMIN LOADS API: Authentication required in production mode, but no auth context found')
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Please log in to access this resource'
        })
    }

    try {
        const id = getRouterParam(event, 'id')
        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Load ID is required'
            })
        }

        const body = await readBody(event)
        console.log(`📦 ADMIN LOADS API: Updating load ${id} with data:`, body)

        // Check if load exists
        const existingLoad = await prisma.load.findUnique({
            where: { id },
            include: {
                orders: {
                    where: {
                        status: {
                            in: ['PENDING', 'ACCEPTED', 'IN_TRANSIT']
                        }
                    }
                }
            }
        })

        if (!existingLoad) {
            throw createError({
                statusCode: 404,
                message: 'Load not found'
            })
        }

        // Check if load can be updated (no active orders)
        if (existingLoad.orders.length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Cannot update load with active orders'
            })
        }

        // Validate required fields
        const requiredFields = ['title', 'origin', 'destination', 'pickupDate', 'deliveryDate', 'price']
        for (const field of requiredFields) {
            if (!body[field]) {
                throw createError({
                    statusCode: 400,
                    message: `Missing required field: ${field}`
                })
            }
        }

        // Update the load
        const load = await prisma.load.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description || '',
                pickupLocation: body.origin,
                deliveryLocation: body.destination,
                pickupDate: new Date(body.pickupDate),
                deliveryDate: new Date(body.deliveryDate),
                price: parseFloat(body.price)
            }
        })

        console.log('✅ ADMIN LOADS API: Load updated successfully:', load.id)

        return {
            success: true,
            message: 'Load updated successfully',
            load
        }
    } catch (error: any) {
        console.error('❌ ADMIN LOADS API: Error updating load:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'An error occurred while updating the load'
        })
    }
}) 