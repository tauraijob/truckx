import { PrismaClient } from '@prisma/client'
import { PaymentType, PaymentStatus, OrderStatus } from '~/server/utils/enums'

const prisma = new PrismaClient()

// Platform fee percentage
const PLATFORM_FEE_PERCENTAGE = 0.02 // 2%

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

/**
 * Process payments when an order is accepted
 * - Calculates platform fee
 * - Updates order with payment information
 */
export const processOrderAcceptance = async (orderId: string) => {
    try {
        // Get order with related data
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                load: true,
            },
        })

        if (!order) {
            throw new Error('Order not found')
        }

        if (!order.load || !order.load.price) {
            throw new Error('Order has no associated load price')
        }

        // Calculate payments
        const loadPrice = order.load.price
        const platformFee = calculatePlatformFee(loadPrice)
        const truckProviderEarning = loadPrice - platformFee

        // Update order with payment information
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                platformFee: platformFee,
                status: OrderStatus.ACCEPTED,
            },
        })

        return {
            orderId,
            loadPrice,
            platformFee,
            truckProviderEarning,
            status: updatedOrder.status
        }
    } catch (error) {
        console.error('Error processing order acceptance:', error)
        throw error
    }
}

/**
 * Get payment history for a user
 * This now calculates payments based on orders rather than actual payment records
 */
export const getUserPayments = async (userId: string) => {
    try {
        // Get all orders where user is either load provider or truck provider
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { loadProviderId: userId },
                    { truckProviderId: userId }
                ],
                status: {
                    in: ['ACCEPTED', 'IN_TRANSIT', 'COMPLETED']
                }
            },
            include: {
                load: true,
                truck: true,
                loadProvider: true,
                truckProvider: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        // Transform orders into payment data
        const payments = orders.map(order => {
            const loadPrice = order.load?.price || 0
            const platformFee = calculatePlatformFee(loadPrice)
            const truckProviderEarning = loadPrice - platformFee

            // Determine if this is a platform fee (for load provider) or earning (for truck provider)
            const isLoadProvider = order.loadProviderId === userId

            return {
                id: `${order.id}-${isLoadProvider ? 'fee' : 'earning'}`,
                orderId: order.id,
                amount: isLoadProvider ? platformFee : truckProviderEarning,
                type: isLoadProvider ? PaymentType.PLATFORM_FEE : PaymentType.EARNING,
                status: PaymentStatus.COMPLETED,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                description: isLoadProvider
                    ? `Platform fee for load: ${order.load?.title || 'Unnamed Load'}`
                    : `Earnings for delivery of: ${order.load?.title || 'Unnamed Load'}`,
                order: order
            }
        })

        return payments
    } catch (error) {
        console.error('Error getting user payments:', error)
        throw error
    }
}

/**
 * Get payment summary for a user
 */
export const getUserPaymentSummary = async (userId: string) => {
    try {
        // Get all orders with this user
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { loadProviderId: userId },
                    { truckProviderId: userId }
                ],
                status: {
                    in: ['ACCEPTED', 'IN_TRANSIT', 'COMPLETED']
                }
            },
            include: {
                load: true
            }
        })

        let totalEarnings = 0
        let totalPlatformFees = 0
        let totalPayments = 0

        // Calculate totals based on user role in each order
        orders.forEach(order => {
            const loadPrice = order.load?.price || 0
            const platformFee = calculatePlatformFee(loadPrice)
            const truckProviderEarning = loadPrice - platformFee

            if (order.loadProviderId === userId) {
                // User is the load provider, they pay platform fee
                totalPlatformFees += platformFee
            }

            if (order.truckProviderId === userId) {
                // User is the truck provider, they receive earnings
                totalEarnings += truckProviderEarning
                totalPlatformFees += platformFee
                totalPayments += loadPrice
            }
        })

        return {
            totalEarnings,
            totalPlatformFees,
            totalPayments: orders.length,
            totalPaymentAmount: totalPayments,
        }
    } catch (error) {
        console.error('Error getting user payment summary:', error)
        throw error
    }
}

/**
 * Get platform-wide payment analytics
 */
export const getPlatformPaymentAnalytics = async () => {
    try {
        const payments = await prisma.payment.findMany()

        const totalEarnings = payments
            .filter((payment) => payment.type === PaymentType.EARNING)
            .reduce((sum, payment) => sum + payment.amount, 0)

        const totalPlatformFees = payments
            .filter((payment) => payment.type === PaymentType.PLATFORM_FEE)
            .reduce((sum, payment) => sum + payment.amount, 0)

        // Get monthly data
        const monthlyData = await prisma.payment.groupBy({
            by: ['type'],
            _sum: {
                amount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
        })

        return {
            totalEarnings,
            totalPlatformFees,
            totalPayments: payments.length,
            monthlyData,
        }
    } catch (error) {
        console.error('Error getting platform payment analytics:', error)
        throw error
    }
} 