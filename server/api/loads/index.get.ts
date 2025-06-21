import { OrderStatus, createApiHandler } from '~/server/utils/api-imports'
import type { PrismaClient } from '@prisma/client'

export default createApiHandler(async (event, db) => {
    try {
        // Get user ID and role from auth context
        const userId = event.context.auth?.userId
        const userRole = event.context.auth?.role

        console.log('Auth context:', { userId, userRole })

        // Get query parameters
        const query = getQuery(event)
        const { providerId, isAvailable } = query

        console.log('Query parameters:', { providerId, isAvailable })

        // Build filter conditions
        const where: any = {}

        // If providerId is 'current', use the authenticated user's ID
        if (providerId === 'current') {
            where.providerId = userId
        } else if (providerId) {
            where.providerId = providerId as string
        }

        // For load providers, only show their own loads by default
        // But for truck providers, show all available loads
        if (!providerId && userId && userRole === 'LOAD_PROVIDER') {
            where.providerId = userId
        }

        if (isAvailable !== undefined) {
            where.isAvailable = isAvailable === 'true'
        }

        // Log for debugging
        console.log('User role:', userRole)
        console.log('Fetching loads with filter:', JSON.stringify(where, null, 2))

        let loads;
        try {
            // First, let's verify the database connection
            try {
                await db.$queryRaw`SELECT 1`
                console.log('Database connection verified')
            } catch (dbError) {
                console.error('Database connection error:', dbError)
                throw new Error('Database connection failed')
            }

            // Let's also check if we can query the loads table directly
            try {
                const count = await db.load.count()
                console.log('Total loads in database:', count)
            } catch (countError) {
                console.error('Error counting loads:', countError)
                throw new Error('Error accessing loads table')
            }

            if ((providerId === 'current' || where.providerId === userId) && userRole === 'LOAD_PROVIDER') {
                console.log('Fetching loads for load provider')
                // For load providers viewing their own loads, show all loads
                console.log('Load provider viewing their own loads - showing all including active orders')

                loads = await db.load.findMany({
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
                                status: true
                            },
                            take: 1
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })

                // Add order status information to each load
                loads = loads.map(load => {
                    const hasActiveOrder = load.orders && load.orders.length > 0
                    return {
                        ...load,
                        hasActiveOrder,
                        activeOrderStatus: hasActiveOrder ? load.orders[0].status : null,
                        orders: undefined
                    }
                })
            } else {
                console.log('Fetching available loads for truck provider')
                try {
                    // First try a simple query without the complex conditions
                    const simpleLoads = await db.load.findMany({
                        take: 1,
                        select: { id: true }
                    })
                    console.log('Simple query test successful:', simpleLoads)

                    // Now try the full query
                    loads = await db.load.findMany({
                        where: {
                            ...where,
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
                        orderBy: {
                            createdAt: 'desc'
                        }
                    })
                    console.log('Successfully fetched loads:', loads.length)
                } catch (queryError) {
                    console.error('Detailed query error:', {
                        error: queryError,
                        message: queryError.message,
                        code: queryError.code,
                        meta: queryError.meta
                    })
                    throw queryError
                }
            }

            // Process loads to include active order status and handle JSON parsing
            const processedLoads = loads.map(load => {
                try {
                    // Safely parse specifications if it's a string
                    let specifications = load.specifications
                    if (typeof load.specifications === 'string') {
                        try {
                            specifications = JSON.parse(load.specifications)
                        } catch (e) {
                            console.warn(`Failed to parse specifications for load ${load.id}:`, e)
                            specifications = {}
                        }
                    }

                    // Safely get images
                    let images = []
                    if (load.images && Array.isArray(load.images)) {
                        images = load.images
                    } else if (specifications && typeof specifications === 'object' &&
                        '_images' in specifications && Array.isArray(specifications._images)) {
                        images = specifications._images
                    }

                    // Check for an active order
                    const activeOrder = load.orders && load.orders.length > 0 ? load.orders[0] : null

                    return {
                        ...load,
                        specifications: specifications || {},
                        orders: undefined,
                        activeOrderStatus: activeOrder ? activeOrder.status : null,
                        images: images
                    }
                } catch (e) {
                    console.error(`Error processing load ${load.id}:`, e)
                    // Return a sanitized version of the load with minimal data
                    return {
                        id: load.id,
                        title: load.title || 'Untitled Load',
                        description: load.description || '',
                        pickupLocation: load.pickupLocation || '',
                        deliveryLocation: load.deliveryLocation || '',
                        price: load.price || 0,
                        isAvailable: load.isAvailable || false,
                        createdAt: load.createdAt,
                        updatedAt: load.updatedAt,
                        provider: load.provider,
                        specifications: {},
                        images: [],
                        activeOrderStatus: null
                    }
                }
            })

            return {
                loads: processedLoads,
                total: processedLoads.length
            }
        } catch (error) {
            console.error('Database operation error:', {
                error,
                message: error.message,
                code: error.code,
                meta: error.meta,
                stack: error.stack
            })
            throw createError({
                statusCode: 500,
                message: `Database error: ${error.message || 'Unknown error'}`
            })
        }
    } catch (error) {
        console.error('Top-level error in loads endpoint:', {
            error,
            message: error.message,
            stack: error.stack
        })
        throw createError({
            statusCode: 500,
            message: error instanceof Error ? error.message : 'Internal server error'
        })
    }
}) 