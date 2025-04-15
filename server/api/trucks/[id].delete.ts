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

        // Get truck ID from route params
        const id = event.context.params?.id

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Truck ID is required'
            })
        }

        // Get truck
        const truck = await prisma.truck.findUnique({
            where: { id }
        })

        if (!truck) {
            throw createError({
                statusCode: 404,
                message: 'Truck not found'
            })
        }

        // Check if user is the owner of the truck or an admin
        if (truck.providerId !== userId && userRole !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to delete this truck'
            })
        }

        // Check if truck is associated with any orders
        const orders = await prisma.order.findMany({
            where: { truckId: id }
        })

        if (orders.length > 0) {
            throw createError({
                statusCode: 400,
                message: 'Cannot delete truck that is associated with orders'
            })
        }

        // Delete truck
        await prisma.truck.delete({
            where: { id }
        })

        return {
            message: 'Truck deleted successfully'
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error deleting truck'
        })
    }
}) 