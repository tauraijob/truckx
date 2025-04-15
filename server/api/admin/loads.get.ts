import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('📦 ADMIN LOADS API: Starting request handler')

    // Skip authentication for admin routes during development
    // This should be removed in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isAuthenticated = isProduction ? !!event.context.auth : true

    if (isProduction && !isAuthenticated) {
        console.log('🔒 ADMIN LOADS API: Authentication required in production mode, but no auth context found')
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Please log in to access this resource'
        })
    }

    try {
        const { page = 1, limit = 10, search = '', status = '' } = getQuery(event)

        console.log(`🔍 ADMIN LOADS API: Fetching loads - page: ${page}, limit: ${limit}, search: '${search}', status: '${status}'`)

        // Query parameters
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { pickupLocation: { contains: search as string, mode: 'insensitive' } },
                { deliveryLocation: { contains: search as string, mode: 'insensitive' } }
            ]
        }

        if (status) {
            where.status = status
        }

        console.log('🔍 ADMIN LOADS API: Prisma query where clause:', JSON.stringify(where))

        // Check total loads in the database
        const totalInDb = await prisma.load.count()
        console.log(`📊 ADMIN LOADS API: Total loads in database: ${totalInDb}`)

        if (totalInDb === 0) {
            console.log('📊 ADMIN LOADS API: No loads found in database')
            return {
                loads: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: 0,
                    totalPages: 0
                }
            }
        }

        // Fetch loads with pagination
        console.log('🔍 ADMIN LOADS API: Executing findMany query with pagination')

        let loads = []
        let totalLoads = 0

        try {
            [loads, totalLoads] = await Promise.all([
                prisma.load.findMany({
                    where,
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        provider: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                        orders: {
                            select: {
                                id: true,
                                status: true,
                                truck: {
                                    select: {
                                        id: true,
                                        make: true,
                                        licensePlate: true
                                    }
                                }
                            },
                            take: 1,
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                }),
                prisma.load.count({ where })
            ])

            console.log(`📊 ADMIN LOADS API: Found ${totalLoads} matching loads, returning ${loads.length} for the current page`)
        } catch (err: any) {
            console.error('❌ ADMIN LOADS API: Error in findMany query:', err)
            throw err
        }

        if (loads.length === 0) {
            console.log('📊 ADMIN LOADS API: No loads matched the query criteria')
            return {
                loads: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: totalLoads,
                    totalPages: Math.ceil(totalLoads / limitNum)
                }
            }
        }

        // Process loads to add provider info and order information
        const loadsWithDetails = loads.map(load => {
            const providerName = load.provider ?
                `${load.provider.firstName} ${load.provider.lastName}` :
                'Unknown Provider'

            const activeOrder = load.orders && load.orders.length > 0 ? load.orders[0] : null

            return {
                ...load,
                providerName,
                activeOrder: activeOrder ? {
                    id: activeOrder.id,
                    status: activeOrder.status,
                    truck: activeOrder.truck ? {
                        id: activeOrder.truck.id,
                        make: activeOrder.truck.make,
                        licensePlate: activeOrder.truck.licensePlate
                    } : null
                } : null,
                orders: undefined // Remove the orders array from the response
            }
        })

        // Log sample of first load for debugging
        if (loadsWithDetails.length > 0) {
            const firstLoadSample = loadsWithDetails[0]
            console.log('📋 ADMIN LOADS API: First load data:',
                JSON.stringify({
                    id: firstLoadSample.id,
                    title: firstLoadSample.title,
                    provider: firstLoadSample.providerName
                })
            )
        }

        console.log(`✅ ADMIN LOADS API: Successfully found ${loadsWithDetails.length} loads`)

        return {
            loads: loadsWithDetails,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: totalLoads,
                totalPages: Math.ceil(totalLoads / limitNum)
            }
        }
    } catch (error: any) {
        console.error('❌ ADMIN LOADS API: Error fetching loads:', error)
        throw createError({
            statusCode: 500,
            message: `An error occurred while fetching loads: ${error.message || 'Unknown error'}`
        })
    }
}) 