import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Skip authentication for admin routes during development
    // This should be removed in production
    const isProduction = process.env.NODE_ENV === 'production'
    const isAuthenticated = isProduction ? !!event.context.auth : true

    if (isProduction && !isAuthenticated) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: Please log in to access this resource'
        })
    }

    try {
        console.log('ADMIN DASHBOARD STATS API: Fetching data...')

        // Get specific counts using Prisma's count() method
        console.log('Step 1: Counting total users')
        const totalUsers = await prisma.user.count()
        console.log(`Found ${totalUsers} total users`)

        // Get active loads (only those that are available)
        console.log('Step 2: Counting active loads')
        const activeLoads = await prisma.load.count({
            where: { isAvailable: true }
        })
        console.log(`Found ${activeLoads} active loads`)

        // Get available trucks (only those marked as available)
        console.log('Step 3: Counting available trucks')
        const availableTrucks = await prisma.truck.count({
            where: { isAvailable: true }
        })
        console.log(`Found ${availableTrucks} available trucks`)

        // Get completed orders for the platform stats
        console.log('Step 4: Counting completed orders')
        const completedOrders = await prisma.order.count({
            where: { status: 'DELIVERED' }
        })
        console.log(`Found ${completedOrders} completed orders`)

        // Initialize platform fees and provider earnings
        let totalPlatformFees = 0
        let totalProviderEarnings = 0

        // Calculate platform fees and provider earnings from completed orders
        console.log('Step 5: Calculating platform fees and provider earnings')
        try {
            const ordersWithPayments = await prisma.order.findMany({
                where: { status: 'DELIVERED' },
                include: {
                    payments: true
                }
            })
            console.log(`Found ${ordersWithPayments.length} orders with payments`)

            ordersWithPayments.forEach(order => {
                if (order.payments && order.payments.length > 0) {
                    console.log(`Order ${order.id} has ${order.payments.length} payments`)
                    order.payments.forEach(payment => {
                        const loadPrice = payment.amount
                        const platformFee = loadPrice * 0.20 // 20% platform fee
                        const providerEarnings = loadPrice * 0.80 // 80% to provider

                        totalPlatformFees += platformFee
                        totalProviderEarnings += providerEarnings
                    })
                } else {
                    console.log(`Order ${order.id} has no payments`)
                }
            })

            console.log(`Calculated platform fees: ${totalPlatformFees}, provider earnings: ${totalProviderEarnings}`)
        } catch (error) {
            console.error('Error calculating fees and earnings:', error)
            // Continue with the API even if this part fails
        }

        // Get recent orders for the dashboard
        console.log('Step 6: Getting recent orders')
        let formattedRecentOrders = []

        try {
            const recentOrders = await prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    load: {
                        select: {
                            title: true,
                            pickupLocation: true,
                            deliveryLocation: true
                        }
                    },
                    truck: {
                        select: {
                            make: true,
                            model: true,
                            licensePlate: true
                        }
                    }
                }
            })
            console.log(`Found ${recentOrders.length} recent orders`)

            // Format recent orders for the dashboard
            formattedRecentOrders = recentOrders.map(order => ({
                id: order.id,
                loadName: order.load?.title || 'Unknown Load',
                truckName: `${order.truck?.make || ''} ${order.truck?.model || ''} (${order.truck?.licensePlate || ''})`.trim() || 'Unknown Truck',
                origin: order.load?.pickupLocation || 'Unknown',
                destination: order.load?.deliveryLocation || 'Unknown',
                status: order.status,
                createdAt: order.createdAt
            }))
        } catch (error) {
            console.error('Error getting recent orders:', error)
            // Continue with the API even if this part fails
        }

        console.log('Step 7: Returning dashboard data')
        console.log(`Found ${totalUsers} users, ${activeLoads} active loads, ${availableTrucks} available trucks, ${completedOrders} completed orders, ${formattedRecentOrders.length} recent orders`)

        // Return actual data from the database
        return {
            counts: {
                totalUsers,
                activeLoads,
                availableTrucks,
                completedOrders,
                totalPlatformFees,
                totalProviderEarnings
            },
            samples: {
                orders: formattedRecentOrders
            }
        }
    } catch (error: any) {
        console.error('ERROR in admin dashboard stats API:', error)
        // Add detailed error information
        let errorMessage = 'Failed to fetch dashboard statistics'

        if (error.message) {
            errorMessage += `: ${error.message}`
        }

        // For Prisma errors, include more details
        if (error.code) {
            errorMessage += ` (Code: ${error.code})`
        }

        throw createError({
            statusCode: 500,
            message: errorMessage
        })
    }
}) 