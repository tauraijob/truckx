import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth?.userId

        if (!userId) {
            console.error('No user ID found in auth context')
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        console.log('Fetching recent payments')

        // Get recent payments with user details
        const payments = await db.payment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        loadId: true,
                        truckId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })

        console.log(`Found ${payments.length} recent payments`)

        // Transform data for display
        const formattedPayments = payments.map(payment => ({
            id: payment.id,
            type: payment.type,
            amount: payment.amount,
            status: payment.status,
            description: payment.description,
            createdAt: payment.createdAt,
            userId: payment.userId,
            userName: `${payment.user.firstName} ${payment.user.lastName}`,
            userEmail: payment.user.email,
            userRole: payment.user.role,
            orderId: payment.orderId,
            loadId: payment.order?.loadId,
            truckId: payment.order?.truckId
        }))

        return formattedPayments
    } catch (error) {
        console.error('Error fetching recent payments:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching recent payments'
        })
    }
}) 