import { calculatePaymentDetails } from '~/server/services/payment'

export default defineEventHandler(async (event) => {
    try {
        // Get load price from query parameters
        const query = getQuery(event)
        const loadPrice = parseFloat(query.price as string)

        if (isNaN(loadPrice) || loadPrice <= 0) {
            throw createError({
                statusCode: 400,
                message: 'Valid load price is required',
            })
        }

        // Calculate payment details
        const paymentDetails = calculatePaymentDetails(loadPrice)

        return {
            success: true,
            data: paymentDetails,
        }
    } catch (error) {
        console.error('Error calculating payment details:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to calculate payment details',
        })
    }
}) 