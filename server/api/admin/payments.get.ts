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
        if (session.user.role !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Admin access required'
            })
        }

        // Get query parameters for pagination and filtering
        const query = getQuery(event)
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 10
        const search = query.search as string || ''
        const status = query.status as string || ''
        const type = query.type as string || ''

        // Calculate skip for pagination
        const skip = (page - 1) * limit

        // Build where clause for filtering
        const where: any = {}

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { order: { id: { contains: search, mode: 'insensitive' } } },
                {
                    user: {
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

        if (type) {
            where.type = type
        }

        // Get payments with pagination and filtering
        const payments = await prisma.payment.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                order: {
                    select: {
                        id: true,
                        load: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        truck: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        // Get total count for pagination
        const total = await prisma.payment.count({ where })

        return {
            payments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        })
    }
}) 