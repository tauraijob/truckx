import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get authenticated user session
        const session = await getServerSession(event)
        if (!session) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Check if user is admin
        if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Admin access required'
            })
        }

        console.log('Admin fetching all orders')

        // Get query parameters for pagination and filtering
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 10
        const search = query.search as string || ''
        const status = query.status as string || ''

        // Calculate skip for pagination
        const skip = (page - 1) * limit

        // Build where clause for filtering
        const where: any = {}

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                {
                    load: {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { pickupLocation: { contains: search, mode: 'insensitive' } },
                            { deliveryLocation: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
                {
                    truck: {
                        OR: [
                            { make: { contains: search, mode: 'insensitive' } },
                            { model: { contains: search, mode: 'insensitive' } },
                            { licensePlate: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
                {
                    loadProvider: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
                {
                    truckProvider: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ]
        }

        if (status) {
            where.status = status
        }

        console.log('Admin orders query:', { page, limit, search, status, where })

        // Get orders with pagination and filtering
        const orders = await prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                load: {
                    select: {
                        id: true,
                        title: true,
                        pickupLocation: true,
                        deliveryLocation: true,
                        price: true,
                        isAvailable: true
                    }
                },
                truck: {
                    select: {
                        id: true,
                        make: true,
                        model: true,
                        licensePlate: true,
                        capacity: true,
                        isAvailable: true
                    }
                },
                loadProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true
                    }
                },
                payments: true
            }
        })

        console.log(`Admin found ${orders.length} orders`)

        // Get total count for pagination
        const total = await prisma.order.count({ where })

        return {
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        console.error('Error fetching admin orders:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        })
    }
})