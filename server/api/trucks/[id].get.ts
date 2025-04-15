import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
    try {
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
            where: { id },
            include: {
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        })

        if (!truck) {
            throw createError({
                statusCode: 404,
                message: 'Truck not found'
            })
        }

        return {
            truck
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching truck'
        })
    }
}) 