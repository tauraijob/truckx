import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('👥 ADMIN USERS API: Starting request handler')

    // Skip authentication for admin routes during development
    // This should be removed in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isAuthenticated = isProduction ? !!event.context.auth : true

    if (isProduction && !isAuthenticated) {
        console.log('🔒 ADMIN USERS API: Authentication required in production mode, but no auth context found')
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Please log in to access this resource'
        })
    }

    try {
        const { page = 1, limit = 10, search = '', role = '' } = getQuery(event)

        console.log(`🔍 ADMIN USERS API: Fetching users - page: ${page}, limit: ${limit}, search: '${search}', role: '${role}'`)

        // Query parameters
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } }
            ]
        }

        if (role) {
            where.role = role
        }

        console.log('🔍 ADMIN USERS API: Prisma query where clause:', JSON.stringify(where))

        // Check total users in the database
        const totalInDb = await prisma.user.count()
        console.log(`📊 ADMIN USERS API: Total users in database: ${totalInDb}`)

        if (totalInDb === 0) {
            console.log('📊 ADMIN USERS API: No users found in database')
            return {
                users: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: 0,
                    totalPages: 0
                }
            }
        }

        // Fetch users with pagination
        console.log('🔍 ADMIN USERS API: Executing findMany query with pagination')

        let users = []
        let totalUsers = 0

        try {
            [users, totalUsers] = await Promise.all([
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
                        role: true,
                        isActive: true,
                        createdAt: true
                    }
                }),
                prisma.user.count({ where })
            ])

            console.log(`📊 ADMIN USERS API: Found ${totalUsers} matching users, returning ${users.length} for the current page`)
        } catch (err: any) {
            console.error('❌ ADMIN USERS API: Error in findMany query:', err)
            throw err
        }

        if (users.length === 0) {
            console.log('📊 ADMIN USERS API: No users matched the query criteria')
            return {
                users: [],
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalItems: totalUsers,
                    totalPages: Math.ceil(totalUsers / limitNum)
                }
            }
        }

        // Log sample of first user for debugging (without sensitive info)
        if (users.length > 0) {
            const firstUserSample = users[0]
            console.log('📋 ADMIN USERS API: First user data:',
                JSON.stringify({
                    id: firstUserSample.id,
                    name: `${firstUserSample.firstName} ${firstUserSample.lastName}`,
                    role: firstUserSample.role
                })
            )
        }

        console.log(`✅ ADMIN USERS API: Successfully found ${users.length} users`)

        return {
            users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: totalUsers,
                totalPages: Math.ceil(totalUsers / limitNum)
            }
        }
    } catch (error: any) {
        console.error('❌ ADMIN USERS API: Error fetching users:', error)
        throw createError({
            statusCode: 500,
            message: `An error occurred while fetching users: ${error.message || 'Unknown error'}`
        })
    }
}) 