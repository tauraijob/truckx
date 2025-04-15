import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('🚚 ADMIN TRUCKS API: Starting request handler')

    // Skip authentication for admin routes during development
    // This should be removed in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isAuthenticated = isProduction ? !!event.context.auth : true

    if (isProduction && !isAuthenticated) {
        console.log('🔒 ADMIN TRUCKS API: Authentication required in production mode, but no auth context found')
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Please log in to access this resource'
        })
    }

    try {
        const { page = 1, limit = 10, search = '', status = '' } = getQuery(event)

        console.log(`🔍 ADMIN TRUCKS API: Fetching trucks - page: ${page}, limit: ${limit}, search: '${search}', status: '${status}'`)

        // Query parameters
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { licensePlate: { contains: search as string, mode: 'insensitive' } },
                { model: { contains: search as string, mode: 'insensitive' } }
            ]
        }

        if (status) {
            where.status = status
        }

        console.log('🔍 ADMIN TRUCKS API: Prisma query where clause:', JSON.stringify(where))

        // Check total trucks in the database
        const totalInDb = await prisma.truck.count()
        console.log(`📊 ADMIN TRUCKS API: Total trucks in database: ${totalInDb}`)

        if (totalInDb === 0) {
            console.log('📊 ADMIN TRUCKS API: No trucks found in database')
            return {
                trucks: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: 0,
                    totalPages: 0
                }
            }
        }

        // Fetch trucks with pagination
        console.log('🔍 ADMIN TRUCKS API: Executing findMany query with pagination')

        let trucks = []
        let totalTrucks = 0

        try {
            [trucks, totalTrucks] = await Promise.all([
                prisma.truck.findMany({
                    where,
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                userId: true,
                                user: {
                                    select: {
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    }
                }),
                prisma.truck.count({ where })
            ])

            console.log(`📊 ADMIN TRUCKS API: Found ${totalTrucks} matching trucks, returning ${trucks.length} for the current page`)
        } catch (err: any) {
            console.error('❌ ADMIN TRUCKS API: Error in findMany query:', err)
            throw err
        }

        if (trucks.length === 0) {
            console.log('📊 ADMIN TRUCKS API: No trucks matched the query criteria')
            return {
                trucks: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: totalTrucks,
                    totalPages: Math.ceil(totalTrucks / limitNum)
                }
            }
        }

        // Process trucks to add provider info
        const trucksWithProvider = trucks.map(truck => {
            const providerName = truck.provider?.name || 'Unknown Provider'
            const ownerName = truck.provider?.user ?
                `${truck.provider.user.firstName} ${truck.provider.user.lastName}` :
                'Unknown Owner'

            return {
                ...truck,
                providerName,
                ownerName
            }
        })

        // Log sample of first truck for debugging
        if (trucksWithProvider.length > 0) {
            const firstTruckSample = trucksWithProvider[0]
            console.log('📋 ADMIN TRUCKS API: First truck data:',
                JSON.stringify({
                    id: firstTruckSample.id,
                    name: firstTruckSample.name,
                    provider: firstTruckSample.providerName,
                    status: firstTruckSample.status
                })
            )
        }

        console.log(`✅ ADMIN TRUCKS API: Successfully found ${trucksWithProvider.length} trucks`)

        return {
            trucks: trucksWithProvider,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: totalTrucks,
                totalPages: Math.ceil(totalTrucks / limitNum)
            }
        }
    } catch (error: any) {
        console.error('❌ ADMIN TRUCKS API: Error fetching trucks:', error)
        throw createError({
            statusCode: 500,
            message: `An error occurred while fetching trucks: ${error.message || 'Unknown error'}`
        })
    }
}) 