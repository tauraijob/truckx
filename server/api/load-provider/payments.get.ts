import { prisma } from '#imports'
import { PaymentType } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth?.userId
        const userRole = event.context.auth?.role

        if (!userId) {
            console.error('No user ID found in auth context')
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            console.error('User is not a load provider:', userRole)
            throw createError({
                statusCode: 403,
                message: 'Access denied. Only load providers can access this endpoint.'
            })
        }

        console.log('Fetching payments for load provider:', userId)

        // Get payments related to orders where this user is the load provider
        const payments = await prisma.payment.findMany({
            where: {
                order: {
                    loadProviderId: userId  // Direct filter by load provider ID
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                order: {
                    include: {
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
                                model: true,
                                licensePlate: true
                            }
                        }
                    }
                }
            }
        })

        console.log(`Found ${payments.length} payments for load provider ${userId}`)

        // Calculate summary statistics
        let totalSpent = 0
        let platformFees = 0

        payments.forEach(payment => {
            if (payment.type === PaymentType.PLATFORM_FEE) {
                platformFees += payment.amount
            }
            totalSpent += payment.amount
        })

        // Format the response
        return {
            payments: payments.map(payment => ({
                id: payment.id,
                amount: payment.amount,
                description: payment.description,
                type: payment.type,
                createdAt: payment.createdAt,
                order: {
                    id: payment.order?.id,
                    load: payment.order?.load ? {
                        id: payment.order.load.id,
                        title: payment.order.load.title
                    } : null,
                    truck: payment.order?.truck ? {
                        id: payment.order.truck.id,
                        name: `${payment.order.truck.make} ${payment.order.truck.model} (${payment.order.truck.licensePlate})`
                    } : null
                }
            })),
            summary: {
                totalSpent,
                platformFees,
                providerPayments: totalSpent - platformFees
            }
        }
    } catch (error) {
        console.error('Error in load provider payments API:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch load provider payments',
        })
    }
}) 