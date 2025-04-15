import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError, getHeader } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('Processing platform fee payment')

    // Check authentication
    const authHeader = getHeader(event, 'authorization')
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log('Development mode - skipping auth check')
    } else if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Unauthorized access attempt - no valid auth header')
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    try {
        const body = await readBody(event)
        console.log('Payment request body:', body)

        // Validate required fields
        if (!body.userId || !body.userType || !body.amount || !body.method) {
            console.error('Invalid payment request - missing required fields')
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required fields'
            })
        }

        // Validate amount
        const amount = parseFloat(body.amount)
        if (isNaN(amount) || amount <= 0) {
            console.error('Invalid payment amount:', body.amount)
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid payment amount'
            })
        }

        // Validate payment method
        const allowedMethods = ['paypal', 'paynow', 'cash']
        if (!allowedMethods.includes(body.method)) {
            console.error('Invalid payment method:', body.method)
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid payment method'
            })
        }

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                amount,
                method: body.method,
                status: body.method === 'cash' ? 'PENDING' : 'PROCESSING',
                type: 'PLATFORM_FEE',
                userId: body.userId,
                description: `Platform fee payment via ${body.method}`,
                metadata: {
                    userType: body.userType
                }
            }
        })

        console.log('Payment record created:', payment.id)

        // If it's PayPal or Paynow, we'd typically redirect to their payment gateway
        // For this implementation, we'll simulate successful payment processing
        if (body.method !== 'cash') {
            // In a real implementation, we would integrate with the payment gateway
            // For now, we'll update the payment status directly
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'COMPLETED' }
            })
        }

        // Update user's outstanding fees
        // This depends on how you store outstanding fees, but here's an example
        if (body.userType === 'truck-provider') {
            await prisma.truckProvider.update({
                where: { id: body.userId },
                data: {
                    outstandingFees: {
                        decrement: amount
                    }
                }
            })
        } else if (body.userType === 'load-provider') {
            await prisma.loadProvider.update({
                where: { id: body.userId },
                data: {
                    outstandingFees: {
                        decrement: amount
                    }
                }
            })
        }

        return {
            success: true,
            payment: {
                id: payment.id,
                amount,
                method: body.method,
                status: body.method === 'cash' ? 'PENDING' : 'COMPLETED',
                date: payment.createdAt
            }
        }
    } catch (error) {
        console.error('Error processing platform fee payment:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to process payment'
        })
    }
}) 