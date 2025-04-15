import { OrderStatus, createApiHandler } from '~/server/utils/api-imports'
import type { PrismaClient } from '@prisma/client'

export default createApiHandler(async (event, db) => {
    // Get user ID and role from auth context
    const userId = event.context.auth.userId
    const userRole = event.context.auth.role

    // Get query parameters
    const query = getQuery(event)
    const { providerId, isAvailable } = query

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
    console.log('Fetching loads with filter:', where)

    // When a load provider is viewing their own loads, show all of their loads
    // When anyone else is looking for loads, only show ones without active orders
    let loads;

    if ((providerId === 'current' || where.providerId === userId) && userRole === 'LOAD_PROVIDER') {
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
                createdAt: 'desc'  // Show newest loads first
            }
        })

        // Add order status information to each load
        loads = loads.map(load => {
            const hasActiveOrder = load.orders && load.orders.length > 0
            return {
                ...load,
                hasActiveOrder,
                activeOrderStatus: hasActiveOrder ? load.orders[0].status : null,
                orders: undefined // Remove the orders array from the response
            }
        })
    } else {
        // For others, only show loads without active orders
        console.log('User viewing available loads - filtering out loads with active orders')

        loads = await db.load.findMany({
            where: {
                ...where,
                // Exclude loads with active orders (PENDING, ACCEPTED, or IN_TRANSIT)
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
                createdAt: 'desc'  // Show newest loads first
            }
        })
    }

    // Log how many loads were found
    console.log(`Found ${loads.length} loads for query`)

    // Process loads to include active order status
    const processedLoads = loads.map(load => {
        // Check for an active order - safely access orders
        const activeOrder = load.orders && load.orders.length > 0 ? load.orders[0] : null;

        // Add images from specifications if needed
        let images = []
        // @ts-ignore - we know the structure includes images
        if (load.images) {
            // @ts-ignore
            images = Array.isArray(load.images) ? load.images : []
        } else if (load.specifications && typeof load.specifications === 'object' &&
            '_images' in load.specifications && Array.isArray(load.specifications._images)) {
            // @ts-ignore
            images = load.specifications._images
        }

        return {
            ...load,
            orders: undefined, // Remove redundant data
            activeOrderStatus: activeOrder ? activeOrder.status : null,
            images: images
        }
    })

    return {
        loads: processedLoads,
        total: loads.length
    }
}) 