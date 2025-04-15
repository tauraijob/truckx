import { prisma } from '#imports'
import { PaymentStatus, PaymentType, OrderStatus } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID and role from auth context
        const userId = event.context.auth?.userId
        const userRole = event.context.auth?.role

        // Get order ID from route parameter
        const orderId = event.context.params?.id

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        if (!orderId) {
            throw createError({
                statusCode: 400,
                message: 'Order ID is required'
            })
        }

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Only load providers can record payments'
            })
        }

        // Get request body
        const body = await readBody(event)
        const { amount, method, notes } = body

        if (!amount || amount <= 0) {
            throw createError({
                statusCode: 400,
                message: 'Valid payment amount is required'
            })
        }

        if (!method) {
            throw createError({
                statusCode: 400,
                message: 'Payment method is required'
            })
        }

        // Get the order and verify it belongs to this load provider
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                load: true,
                truck: true
            }
        })

        if (!order) {
            throw createError({
                statusCode: 404,
                message: 'Order not found'
            })
        }

        // Verify the order belongs to this load provider
        if (order.loadProviderId !== userId) {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to record payments for this order'
            })
        }

        // Verify the order status is ACCEPTED or IN_TRANSIT
        if (order.status !== OrderStatus.ACCEPTED && order.status !== OrderStatus.IN_TRANSIT) {
            throw createError({
                statusCode: 400,
                message: 'Payments can only be recorded for accepted or in-transit orders'
            })
        }

        // Calculate platform fee (usually 20% of the total)
        const platformFeePercentage = 0.20
        const platformFeeAmount = order.price ? order.price * platformFeePercentage : 0
        const providerPaymentAmount = order.price ? order.price - platformFeeAmount : 0

        console.log(`Recording payment for order ${orderId}, total: ${amount}, platform fee: ${platformFeeAmount}, provider payment: ${providerPaymentAmount}`)

        // Create transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update order payment status
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: PaymentStatus.COMPLETED
                }
            })

            // 2. Create platform fee payment record
            const platformFeePayment = await tx.payment.create({
                data: {
                    amount: platformFeeAmount,
                    type: PaymentType.PLATFORM_FEE,
                    status: PaymentStatus.COMPLETED,
                    description: `Platform fee for order #${orderId.slice(0, 8)}`,
                    orderId: orderId,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            })

            // 3. Create provider payment record
            const providerPayment = await tx.payment.create({
                data: {
                    amount: providerPaymentAmount,
                    type: PaymentType.EARNING,
                    status: PaymentStatus.COMPLETED,
                    description: `Payment to provider for order #${orderId.slice(0, 8)}`,
                    orderId: orderId,
                    user: {
                        connect: {
                            id: order.truckProviderId
                        }
                    }
                }
            })

            return {
                updatedOrder,
                platformFeePayment,
                providerPayment
            }
        })

        console.log('Payment recorded successfully:', result)

        return {
            success: true,
            message: 'Payment recorded successfully',
            data: {
                orderId: orderId,
                amount: amount,
                method: method,
                platformFee: platformFeeAmount,
                providerPayment: providerPaymentAmount
            }
        }
    } catch (error: any) {
        console.error('Error recording payment:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to record payment'
        })
    }
}) 