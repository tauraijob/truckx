import { prisma } from '#imports'

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

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Only load providers can delete loads'
            })
        }

        // Get load ID from route params
        const id = event.context.params?.id

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Load ID is required'
            })
        }

        // Get load
        const load = await prisma.load.findUnique({
            where: { id }
        })

        if (!load) {
            throw createError({
                statusCode: 404,
                message: 'Load not found'
            })
        }

        // Check if user is the owner of the load
        if (load.providerId !== userId) {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to delete this load'
            })
        }

        // Check if load is associated with any orders
        const orders = await prisma.order.findMany({
            where: { loadId: id }
        })

        if (orders.length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Cannot delete load that is associated with orders'
            })
        }

        // Delete load
        await prisma.load.delete({
            where: { id }
        })

        return {
            message: 'Load deleted successfully'
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error deleting load'
        })
    }
}) 