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

        // Get payment information for this truck provider
        const paymentInfo = await prisma.paymentInfo.findUnique({
            where: { userId }
        })

        // If no payment info exists, return default values
        if (!paymentInfo) {
            return {
                paymentInfo: {
                    bankName: '',
                    accountNumber: '',
                    routingNumber: '',
                    accountType: 'checking',
                    paymentFrequency: 'weekly'
                }
            }
        }

        return {
            paymentInfo: {
                bankName: paymentInfo.bankName || '',
                accountNumber: paymentInfo.accountNumber || '',
                routingNumber: paymentInfo.routingNumber || '',
                accountType: paymentInfo.accountType || 'checking',
                paymentFrequency: paymentInfo.paymentFrequency || 'weekly'
            }
        }
    } catch (error: any) {
        console.error('Error fetching payment information:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching payment information'
        })
    }
}) 