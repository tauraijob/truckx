import { db } from '~/server/db'
import { PaymentType } from '~/server/utils/enums'

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

        console.log('Fetching platform payment analytics')

        // Get all payments
        const payments = await db.payment.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log(`Found ${payments.length} payments`)

        // Calculate platform fees total
        const totalPlatformFees = payments
            .filter(payment => payment.type === 'PLATFORM_FEE')
            .reduce((sum, payment) => sum + payment.amount, 0)

        // Calculate truck provider earnings total  
        const totalEarnings = payments
            .filter(payment => payment.type === 'EARNING')
            .reduce((sum, payment) => sum + payment.amount, 0)

        // Get monthly data (simplified)
        const today = new Date()
        const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

        const monthlyPayments = payments.filter(payment =>
            new Date(payment.createdAt) >= lastYear
        )

        // Group by month
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
            const monthName = month.toLocaleString('default', { month: 'short' })

            const monthPayments = monthlyPayments.filter(payment => {
                const paymentDate = new Date(payment.createdAt)
                return paymentDate.getMonth() === month.getMonth() &&
                    paymentDate.getFullYear() === month.getFullYear()
            })

            const monthlyPlatformFees = monthPayments
                .filter(payment => payment.type === 'PLATFORM_FEE')
                .reduce((sum, payment) => sum + payment.amount, 0)

            const monthlyEarnings = monthPayments
                .filter(payment => payment.type === 'EARNING')
                .reduce((sum, payment) => sum + payment.amount, 0)

            return {
                month: monthName,
                year: month.getFullYear(),
                platformFees: monthlyPlatformFees,
                earnings: monthlyEarnings,
                revenue: monthlyPlatformFees,
                count: monthPayments.length
            }
        }).reverse()

        console.log('Generated monthly revenue data:', monthlyData)

        // Format recent transactions
        const recentTransactions = payments.slice(0, 5).map(payment => ({
            id: payment.id,
            type: payment.type,
            amount: payment.amount,
            description: payment.description || `${payment.type} payment`,
            createdAt: payment.createdAt,
            user: {
                name: `${payment.user.firstName} ${payment.user.lastName}`,
                email: payment.user.email,
                role: payment.user.role
            },
            formattedDate: new Date(payment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        }))

        // Ensure we have data for chart even if empty
        if (monthlyData.length === 0) {
            const emptyMonth = {
                month: 'No Data',
                year: today.getFullYear(),
                platformFees: 0,
                earnings: 0,
                revenue: 0,
                count: 0
            }
            monthlyData.push(emptyMonth)
        }

        return {
            totalPlatformFees,
            totalEarnings,
            totalPayments: payments.length,
            monthlyRevenue: monthlyData,
            recentTransactions
        }
    } catch (error) {
        console.error('Error fetching payment analytics:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching payment analytics'
        })
    }
}) 