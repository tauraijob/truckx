import { prisma } from '#imports'
import { LoadStatus, OrderStatus } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID and role from auth context
        const userId = event.context.auth?.userId
        const userRole = event.context.auth?.role

        // Verify user is an admin
        if (!userId || userRole !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Only administrators can perform this action'
            })
        }

        console.log('🔍 Finding loads that can be safely deleted...')

        // First, find all loads that can be safely deleted
        const loadsToDelete = await prisma.load.findMany({
            where: {
                AND: [
                    // Only loads with PENDING status
                    { status: LoadStatus.PENDING },
                    // No active orders
                    {
                        NOT: {
                            orders: {
                                some: {
                                    status: {
                                        in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT]
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                orders: true
            }
        })

        console.log(`📊 Found ${loadsToDelete.length} loads that can be safely deleted`)

        // Delete the loads in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const deletedLoads = []
            const failedLoads = []

            for (const load of loadsToDelete) {
                try {
                    // Delete the load
                    await tx.load.delete({
                        where: { id: load.id }
                    })
                    deletedLoads.push(load.id)
                } catch (error) {
                    console.error(`Failed to delete load ${load.id}:`, error)
                    failedLoads.push({
                        id: load.id,
                        error: error.message
                    })
                }
            }

            return {
                deletedLoads,
                failedLoads
            }
        })

        console.log('✅ Load deletion completed:', {
            total: loadsToDelete.length,
            deleted: result.deletedLoads.length,
            failed: result.failedLoads.length
        })

        return {
            success: true,
            message: `Successfully deleted ${result.deletedLoads.length} loads`,
            details: {
                totalProcessed: loadsToDelete.length,
                deleted: result.deletedLoads.length,
                failed: result.failedLoads.length,
                failedLoads: result.failedLoads
            }
        }
    } catch (error: any) {
        console.error('❌ Error in delete-all loads:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error deleting loads'
        })
    }
}) 