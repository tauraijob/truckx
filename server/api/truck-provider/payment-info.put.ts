import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get the authenticated user
        const session = await getServerSession(event)
        if (!session || !session.user) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        const userId = session.user.id

        // Verify the user is a truck provider
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user || user.role !== 'TRUCK_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Only truck providers can access this resource'
            })
        }

        // Get the request body
        const body = await readBody(event)

        // Validate required fields
        if (!body.bankName || !body.accountNumber || !body.routingNumber) {
            throw createError({
                statusCode: 400,
                message: 'Bank name, account number, and routing number are required'
            })
        }

        // Check if payment info already exists
        const existingPaymentInfo = await prisma.paymentInfo.findUnique({
            where: { userId }
        })

        let paymentInfo

        if (existingPaymentInfo) {
            // Update existing payment info
            paymentInfo = await prisma.paymentInfo.update({
                where: { userId },
                data: {
                    bankName: body.bankName,
                    accountNumber: body.accountNumber,
                    routingNumber: body.routingNumber,
                    accountType: body.accountType || 'checking',
                    paymentFrequency: body.paymentFrequency || 'weekly',
                    updatedAt: new Date()
                }
            })
        } else {
            // Create new payment info
            paymentInfo = await prisma.paymentInfo.create({
                data: {
                    userId,
                    bankName: body.bankName,
                    accountNumber: body.accountNumber,
                    routingNumber: body.routingNumber,
                    accountType: body.accountType || 'checking',
                    paymentFrequency: body.paymentFrequency || 'weekly'
                }
            })
        }

        return {
            success: true,
            message: 'Payment information updated successfully',
            paymentInfo
        }
    } catch (error: any) {
        console.error('Error updating payment information:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error updating payment information'
        })
    }
}) 