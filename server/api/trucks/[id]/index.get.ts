import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context for permission checking
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Get truck ID from URL params
        const truckId = event.context.params.id

        // Find the truck
        const truck = await prisma.truck.findUnique({
            where: { id: truckId },
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

        // Check permissions: only allow truck provider to see their own trucks or admins to see any truck
        const isTruckOwner = truck.providerId === userId
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'

        if (!isTruckOwner && !isAdmin) {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to view this truck'
            })
        }

        // Ensure images array exists, use default if not
        if (!truck.images || !Array.isArray(truck.images) || truck.images.length === 0) {
            truck.images = ['/images/truckx-slide.webp']
        }

        return {
            truck
        }
    } catch (error: any) {
        console.error('Error fetching truck details:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching truck details'
        })
    }
}) 