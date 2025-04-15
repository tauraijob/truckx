import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Get query parameters
        const query = getQuery(event)
        const { status, page = '1', limit = '10', needsPayment } = query

        // Parse pagination params
        const pageNumber = parseInt(page as string, 10)
        const limitNumber = parseInt(limit as string, 10)
        const skip = (pageNumber - 1) * limitNumber

        // Build filter conditions based on role
        const where: any = {}

        // Filter orders based on user role
        if (userRole === 'LOAD_PROVIDER') {
            where.loadProviderId = userId
        } else if (userRole === 'TRUCK_PROVIDER') {
            where.truckProviderId = userId
        } else if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Invalid user role'
            })
        }

        // Filter by status if provided
        if (status) {
            // Support comma-separated status values
            if (status.toString().includes(',')) {
                where.status = {
                    in: status.toString().split(',') as OrderStatus[]
                }
            } else {
                where.status = status as OrderStatus
            }
        }

        // Filter orders that need payment
        if (needsPayment === 'true') {
            console.log('Filtering orders that need payment');

            // Only get ACCEPTED or IN_TRANSIT orders with paymentStatus not COMPLETED
            where.status = {
                in: [OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT]
            }

            where.paymentStatus = {
                not: 'COMPLETED'
            }
        }

        // Get orders with included relationships
        const orders = await prisma.order.findMany({
            where,
            include: {
                load: true,
                truck: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                loadProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limitNumber
        })

        // Get total count for pagination
        const totalOrders = await prisma.order.count({ where })
        const totalPages = Math.ceil(totalOrders / limitNumber)

        return {
            orders,
            pagination: {
                totalItems: totalOrders,
                totalPages,
                currentPage: pageNumber,
                itemsPerPage: limitNumber
            }
        }
    } catch (error: any) {
        console.error('Error fetching orders:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching orders'
        })
    }
}) 