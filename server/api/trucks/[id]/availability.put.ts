import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth.userId
        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Get truck ID from URL params
        const truckId = event.context.params.id

        // Read request body
        const body = await readBody(event)
        const { isAvailable } = body

        if (isAvailable === undefined) {
            throw createError({
                statusCode: 400,
                message: 'Missing required field: isAvailable'
            })
        }

        // Find the truck to verify ownership
        const truck = await prisma.truck.findUnique({
            where: { id: truckId },
            select: { providerId: true }
        })

        if (!truck) {
            throw createError({
                statusCode: 404,
                message: 'Truck not found'
            })
        }

        // Verify ownership
        if (truck.providerId !== userId) {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to update this truck'
            })
        }

        // Update the truck availability
        const updatedTruck = await prisma.truck.update({
            where: { id: truckId },
            data: { isAvailable }
        })

        return {
            success: true,
            truck: {
                id: updatedTruck.id,
                isAvailable: updatedTruck.isAvailable
            }
        }
    } catch (error: any) {
        console.error('Error updating truck availability:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error updating truck availability'
        })
    }
}) 