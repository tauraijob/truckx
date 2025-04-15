import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('👨‍✈️ ADMIN CARRIERS API: Starting request handler')

    // Skip authentication for admin routes during development
    // This should be removed in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isAuthenticated = isProduction ? !!event.context.auth : true

    if (isProduction && !isAuthenticated) {
        console.log('🔒 ADMIN CARRIERS API: Authentication required in production mode, but no auth context found')
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Please log in to access this resource'
        })
    }

    try {
        const { page = 1, limit = 10, search = '', isActive = '' } = getQuery(event)

        console.log(`🔍 ADMIN CARRIERS API: Fetching carriers - page: ${page}, limit: ${limit}, search: '${search}', isActive: '${isActive}'`)

        // Query parameters
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        // Build where clause - only get TRUCK_PROVIDER users
        const where: any = {
            role: UserRole.TRUCK_PROVIDER
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } }
            ]
        }

        if (isActive) {
            where.isActive = isActive === 'true'
        }

        console.log('🔍 ADMIN CARRIERS API: Prisma query where clause:', JSON.stringify(where))

        // Fetch carriers with pagination
        console.log('🔍 ADMIN CARRIERS API: Executing findMany query with pagination')

        let carriers = []
        let totalCarriers = 0

        try {
            [carriers, totalCarriers] = await Promise.all([
                prisma.user.findMany({
                    where,
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        isActive: true,
                        createdAt: true,
                        trucks: {
                            select: {
                                id: true
                            }
                        },
                        orders: {
                            where: {
                                status: 'COMPLETED'
                            },
                            select: {
                                id: true
                            }
                        }
                    }
                }),
                prisma.user.count({ where })
            ])

            console.log(`📊 ADMIN CARRIERS API: Found ${totalCarriers} matching carriers, returning ${carriers.length} for the current page`)
        } catch (err: any) {
            console.error('❌ ADMIN CARRIERS API: Error in findMany query:', err)
            throw err
        }

        if (carriers.length === 0) {
            console.log('📊 ADMIN CARRIERS API: No carriers matched the query criteria')
            return {
                carriers: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: totalCarriers,
                    totalPages: Math.ceil(totalCarriers / limitNum)
                }
            }
        }

        // Process carriers to add counts
        const processedCarriers = carriers.map(carrier => {
            return {
                id: carrier.id,
                firstName: carrier.firstName,
                lastName: carrier.lastName,
                email: carrier.email,
                isActive: carrier.isActive,
                createdAt: carrier.createdAt,
                truckCount: carrier.trucks?.length || 0,
                completedOrders: carrier.orders?.length || 0
            }
        })

        // Log sample of first carrier for debugging
        if (processedCarriers.length > 0) {
            const firstCarrierSample = processedCarriers[0]
            console.log('📋 ADMIN CARRIERS API: First carrier data:',
                JSON.stringify({
                    id: firstCarrierSample.id,
                    name: `${firstCarrierSample.firstName} ${firstCarrierSample.lastName}`,
                    email: firstCarrierSample.email,
                    trucks: firstCarrierSample.truckCount,
                    orders: firstCarrierSample.completedOrders
                })
            )
        }

        console.log(`✅ ADMIN CARRIERS API: Successfully found ${processedCarriers.length} carriers`)

        return {
            carriers: processedCarriers,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: totalCarriers,
                totalPages: Math.ceil(totalCarriers / limitNum)
            }
        }
    } catch (error: any) {
        console.error('❌ ADMIN CARRIERS API: Error fetching carriers:', error)
        throw createError({
            statusCode: 500,
            message: `An error occurred while fetching carriers: ${error.message || 'Unknown error'}`
        })
    }
}) 