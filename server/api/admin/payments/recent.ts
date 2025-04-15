import { db } from '~/server/db'
import { getServerSession } from '#auth'

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

        console.log('Admin fetching recent payments')

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
                        truckId: true,
                        load: {
                            select: {
                                id: true,
                                title: true
                            }
                        },
                        truck: {
                            select: {
                                id: true,
                                make: true,
                                model: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        })

        console.log(`Admin found ${payments.length} recent payments`)

        // Transform data for display
        const formattedPayments = payments.map(payment => {
            // For PLATFORM_FEE payments, make sure the amount is positive for display in admin dashboard
            let paymentAmount = payment.amount;
            if (payment.type === 'PLATFORM_FEE' && paymentAmount < 0) {
                paymentAmount = Math.abs(paymentAmount);
            }

            return {
                id: payment.id,
                type: payment.type,
                amount: paymentAmount,
                status: payment.status,
                description: payment.description || `${payment.type} payment for order #${payment.orderId?.substring(0, 8)}`,
                createdAt: payment.createdAt,
                userId: payment.userId,
                userName: `${payment.user.firstName} ${payment.user.lastName}`,
                userEmail: payment.user.email,
                userRole: payment.user.role,
                orderId: payment.orderId,
                orderInfo: payment.order ? {
                    loadName: payment.order.load?.title || 'Unknown Load',
                    truckInfo: payment.order.truck ?
                        `${payment.order.truck.make || ''} ${payment.order.truck.model || ''}` :
                        'Unknown Truck'
                } : null
            }
        })

        return {
            payments: formattedPayments
        }
    } catch (error) {
        console.error('Error fetching admin recent payments:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching recent payments'
        })
    }
}) 