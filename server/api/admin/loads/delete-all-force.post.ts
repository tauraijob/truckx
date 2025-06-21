import { prisma } from '#imports'

// Define the handler function
const handler = defineEventHandler(async (event) => {
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

        console.log('⚠️ Starting force deletion of all loads and orders...')

        // Delete everything in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // First, delete all orders
            console.log('🗑️ Deleting all orders...')
            const deletedOrders = await tx.order.deleteMany({})
            console.log(`✅ Deleted ${deletedOrders.count} orders`)

            // Then, delete all loads
            console.log('🗑️ Deleting all loads...')
            const deletedLoads = await tx.load.deleteMany({})
            console.log(`✅ Deleted ${deletedLoads.count} loads`)

            return {
                deletedOrders: deletedOrders.count,
                deletedLoads: deletedLoads.count
            }
        })

        console.log('✅ Force deletion completed:', result)

        return {
            success: true,
            message: 'Successfully deleted all loads and orders',
            details: {
                deletedOrders: result.deletedOrders,
                deletedLoads: result.deletedLoads
            }
        }
    } catch (error: any) {
        console.error('❌ Error in force delete-all:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error deleting loads and orders'
        })
    }
})

// Export the handler as default
export default handler 