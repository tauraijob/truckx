// Platform fee percentage (keep this in sync with server/services/payment.ts)
export const PLATFORM_FEE_PERCENTAGE = 0.02 // 2%

/**
 * Calculate platform fee (2% of load price)
 */
export const calculatePlatformFee = (loadPrice: number): number => {
    return loadPrice * PLATFORM_FEE_PERCENTAGE
}

/**
 * Calculate payment details for an order
 * - Calculates platform fee
 * - Calculates truck provider earnings
 * - Returns detailed breakdown
 */
export const calculatePaymentDetails = (loadPrice: number) => {
    const platformFee = calculatePlatformFee(loadPrice)
    const truckProviderEarnings = loadPrice - platformFee

    return {
        loadPrice,
        platformFee,
        truckProviderEarnings,
        platformFeePercentage: PLATFORM_FEE_PERCENTAGE * 100, // 2% platform fee
    }
} 