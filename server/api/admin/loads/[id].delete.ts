import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('📦 ADMIN LOADS API: Deleting load')

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

        // Check if load exists and can be deleted
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

        // Check if load can be deleted (no active orders and status is PENDING)
        if (existingLoad.orders.length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Cannot delete load with active orders'
            })
        }

        if (existingLoad.status !== 'PENDING') {
            throw createError({
                statusCode: 400,
                message: 'Can only delete loads with PENDING status'
            })
        }

        // Delete the load
        await prisma.load.delete({
            where: { id }
        })

        console.log('✅ ADMIN LOADS API: Load deleted successfully:', id)

        return {
            success: true,
            message: 'Load deleted successfully'
        }
    } catch (error: any) {
        console.error('❌ ADMIN LOADS API: Error deleting load:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'An error occurred while deleting the load'
        })
    }
}) 