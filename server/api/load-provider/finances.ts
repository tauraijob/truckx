import { prisma } from '#imports'
import { OrderStatus, PaymentStatus } from '~/server/utils/enums'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth?.userId
        const userRole = event.context.auth?.role

        console.log('Finance API - User ID:', userId, 'Role:', userRole)

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized: Please login to access this resource'
            })
        }

        // Verify user is a load provider
        if (userRole !== 'LOAD_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Only load providers can access this resource'
            })
        }

        console.log('Fetching financial data for load provider:', userId)

        // Get all orders for this load provider
        const orders = await prisma.order.findMany({
            where: {
                loadProviderId: userId,
                status: {
                    in: [OrderStatus.ACCEPTED, OrderStatus.IN_TRANSIT, OrderStatus.COMPLETED]
                }
            },
            include: {
                load: true,
                truck: true,
                payments: true,
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        console.log(`Found ${orders.length} orders for financial analysis`)

        // Calculate financial summary
        let totalSpent = 0
        let providerPayments = 0
        let totalPlatformFees = 0
        let pendingAmount = 0
        let thisMonthTotal = 0

        // Get current month and year for 'this month' calculations
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        // For transaction history
        const transactions = []

        for (const order of orders) {
            const loadPrice = order.load?.price || 0
            const platformFee = order.platformFee || (loadPrice * 0.02) // 2% platform fee
            const providerPayment = loadPrice - platformFee

            // Add to summary based on payment status
            if (order.paymentStatus === PaymentStatus.COMPLETED) {
                totalSpent += loadPrice
                providerPayments += providerPayment
                totalPlatformFees += platformFee

                // Check if this order was completed this month
                const completedDate = order.completedAt || order.updatedAt
                const orderDate = new Date(completedDate)
                if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                    thisMonthTotal += loadPrice
                }
            } else {
                pendingAmount += loadPrice
            }

            // Add to transactions history if there are payments
            if (order.payments && order.payments.length > 0) {
                for (const payment of order.payments) {
                    transactions.push({
                        id: payment.id,
                        orderId: order.id,
                        description: payment.description || `Payment for ${order.load?.title || 'order'}`,
                        amount: payment.amount,
                        status: payment.status,
                        createdAt: payment.createdAt,
                        type: payment.type,
                        orderDetails: {
                            loadName: order.load?.title,
                            truckName: `${order.truck?.make} ${order.truck?.model}`,
                            providerName: `${order.truckProvider?.firstName} ${order.truckProvider?.lastName}`
                        }
                    })
                }
            }
        }

        console.log('Financial summary calculated:', {
            totalSpent,
            providerPayments,
            totalPlatformFees,
            pendingAmount
        })

        // Get pending orders (accepted but not paid)
        const pendingOrders = await prisma.order.findMany({
            where: {
                loadProviderId: userId,
                status: OrderStatus.ACCEPTED,
                paymentStatus: PaymentStatus.PENDING
            },
            include: {
                load: true,
                truck: true,
                truckProvider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        // Format pending orders for display
        const formattedPendingOrders = pendingOrders.map(order => ({
            id: order.id,
            loadTitle: order.load?.title || 'Unknown Load',
            truckInfo: `${order.truck?.make || ''} ${order.truck?.model || ''}`,
            price: order.load?.price || 0
        }))

        console.log(`Found ${pendingOrders.length} pending orders for payment`)

        // Get bank info if available
        const paymentInfo = await prisma.paymentInfo.findUnique({
            where: {
                userId
            }
        })

        const bankInfo = paymentInfo ? {
            accountLast4: paymentInfo.accountNumber.slice(-4)
        } : null

        // Return finance data
        return {
            currentBalance: pendingAmount,
            totalPaid: totalSpent,
            pendingAmount,
            platformFees: totalPlatformFees,
            providerPayments,
            thisMonthTotal,
            bankInfo,
            transactions,
            pendingOrders: formattedPendingOrders
        }
    } catch (error) {
        console.error('Error fetching finance data:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching finance data'
        })
    }
}) 