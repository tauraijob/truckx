import { PrismaClient } from '@prisma/client'
import { LoadStatus } from '~/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('📦 ADMIN LOADS API: Creating new load')

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
        const body = await readBody(event)
        console.log('📦 ADMIN LOADS API: Request body:', body)

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

        // Create the load
        const load = await prisma.load.create({
            data: {
                title: body.title,
                description: body.description || '',
                pickupLocation: body.origin,
                deliveryLocation: body.destination,
                pickupDate: new Date(body.pickupDate),
                deliveryDate: new Date(body.deliveryDate),
                price: parseFloat(body.price),
                status: 'PENDING' as LoadStatus,
                isAvailable: true,
                // Note: In a real application, you would get the provider ID from the authenticated user
                // For now, we'll use a default provider
                providerId: 'default-provider-id'
            }
        })

        console.log('✅ ADMIN LOADS API: Load created successfully:', load.id)

        return {
            success: true,
            message: 'Load created successfully',
            load
        }
    } catch (error: any) {
        console.error('❌ ADMIN LOADS API: Error creating load:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'An error occurred while creating the load'
        })
    }
}) 