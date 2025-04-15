import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        console.log('Load provider recommended trucks - Auth context:', { userId, userRole })

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Access denied. Only load providers can access this endpoint.'
            })
        }

        // Get recommended trucks (available trucks that are not in active orders)
        const trucks = await prisma.truck.findMany({
            where: {
                isAvailable: true,
                NOT: {
                    orders: {
                        some: {
                            status: {
                                in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT]
                            }
                        }
                    }
                }
            },
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
            },
            orderBy: [
                { capacity: 'desc' }
            ],
            take: 5
        })

        console.log(`Found ${trucks.length} recommended trucks for load provider ${userId}`)

        // Transform the data to the expected format
        const recommendedTrucks = trucks.map(truck => {
            const specifications = typeof truck.specifications === 'object' ? truck.specifications : {};

            // Make sure provider data exists
            const provider = truck.provider || {
                id: 'unknown',
                firstName: 'Unknown',
                lastName: 'Provider',
                email: 'unknown@example.com'
            };

            return {
                id: truck.id,
                make: truck.make || 'Unknown',
                model: truck.model || 'Unknown',
                registrationNumber: truck.licensePlate || 'Unknown',
                type: (specifications as any)?.type || 'STANDARD',
                capacityTons: truck.capacity || 0,
                year: truck.year || new Date().getFullYear(),
                currentLocation: (specifications as any)?.currentLocation || 'Unknown',
                providerName: `${provider.firstName} ${provider.lastName}`,
                providerEmail: provider.email,
                providerId: provider.id
            }
        })

        return recommendedTrucks
    } catch (error: any) {
        console.error('Error fetching recommended trucks:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching recommended trucks'
        })
    }
}) 