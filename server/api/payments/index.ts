import { getUserPayments, getUserPaymentSummary } from '~/server/services/payment'

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

        console.log('Fetching payments for user:', userId)

        // Get payments and summary
        const payments = await getUserPayments(userId)
        const summary = await getUserPaymentSummary(userId)

        console.log('Payment summary:', summary)
        console.log('Found payments:', payments.length)

        return {
            payments,
            summary,
        }
    } catch (error) {
        console.error('Error in payments API:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to fetch payments',
        })
    }
}) 