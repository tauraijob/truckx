import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID and role from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        // Get query parameters
        const query = getQuery(event)
        const { providerId, isAvailable } = query

        // Log complete auth context for debugging
        console.log('Complete auth context:', event.context.auth)
        console.log('Query parameters:', query)

        // Build filter conditions
        const where: any = {}

        // Handle 'current' providerId parameter
        if (providerId === 'current') {
            if (!userId) {
                throw createError({
                    statusCode: 401,
                    message: 'Unauthorized'
                })
            }

            // Use providerId for truck ownership
            where.providerId = userId
            console.log(`Using current user ID (${userId}) for truck lookup`)
        } else if (providerId) {
            // If specific providerId is given, use it
            where.providerId = providerId as string
            console.log(`Using specified provider ID (${providerId}) for truck lookup`)
        } else if (userRole === 'TRUCK_PROVIDER') {
            // If no providerId is specified and user is a truck provider, 
            // only show their own trucks by default
            where.providerId = userId
            console.log(`User is truck provider, showing their own trucks with providerId=${userId}`)
        }

        // Convert isAvailable string to boolean
        if (isAvailable !== undefined) {
            where.isAvailable = isAvailable === 'true'
        }

        // Log for debugging
        console.log('User role:', userRole)
        console.log('Fetching trucks with filter:', where)

        // For truck providers viewing their own trucks, show all trucks
        // For everyone else, only show available trucks without active orders
        let trucks;

        if ((providerId === 'current' || where.providerId === userId) && userRole === 'TRUCK_PROVIDER') {
            // Truck provider viewing their own trucks - show all including those with active orders
            console.log('Truck provider viewing their own trucks - showing all including those with active orders')

            trucks = await prisma.truck.findMany({
                where,
                include: {
                    provider: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phoneNumber: true
                        }
                    },
                    orders: {
                        where: {
                            status: {
                                in: [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT]
                            }
                        },
                        select: {
                            id: true,
                            status: true,
                            load: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        },
                        take: 1
                    }
                }
            })

            // Add order status information to each truck
            trucks = trucks.map(truck => {
                const hasActiveOrder = truck.orders && truck.orders.length > 0
                return {
                    ...truck,
                    hasActiveOrder,
                    activeOrderStatus: hasActiveOrder ? truck.orders[0].status : null,
                    activeLoadInfo: hasActiveOrder && truck.orders[0].load ? {
                        id: truck.orders[0].load.id,
                        title: truck.orders[0].load.title
                    } : null,
                    orders: undefined // Remove the orders array from the response
                }
            })
        } else {
            // Others viewing trucks - only show available ones without active orders
            console.log('User viewing available trucks - filtering out trucks with active orders')

            trucks = await prisma.truck.findMany({
                where: {
                    ...where,
                    // Exclude trucks with active orders (PENDING, ACCEPTED, or IN_TRANSIT)
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
                }
            })
        }

        console.log(`Found ${trucks.length} trucks for query`)
        console.log('First few trucks:', trucks.slice(0, 2))

        return {
            trucks
        }
    } catch (error: any) {
        console.error('Error fetching trucks:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching trucks'
        })
    }
}) 