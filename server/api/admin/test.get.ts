import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        console.log('ADMIN DASHBOARD API: Fetching real data with no auth checks...')

        // Skip authentication completely for this endpoint

        // Get specific counts using Prisma's count() method instead of array lengths
        const totalUsers = await prisma.user.count()

        // Get active loads (only those that are available)
        const activeLoads = await prisma.load.count({
            where: { isAvailable: true }
        })

        // Get available trucks (only those marked as available)
        const availableTrucks = await prisma.truck.count({
            where: { isAvailable: true }
        })

        // Get completed orders for the platform stats
        const completedOrders = await prisma.order.count({
            where: { status: 'DELIVERED' }
        })

        // Fetch data for samples to display on the dashboard
        const sampleUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        })

        const sampleLoads = await prisma.load.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        })

        const sampleTrucks = await prisma.truck.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        })

        // Get recent orders for the recent activity section
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                load: { select: { name: true } },
                truck: { select: { name: true } }
            }
        })

        console.log(`REAL DATA: Found ${totalUsers} users, ${activeLoads} active loads, ${availableTrucks} available trucks, ${completedOrders} completed orders, ${recentOrders.length} recent orders`)

        // Calculate platform fees and provider earnings from completed orders
        const ordersWithPayments = await prisma.order.findMany({
            where: { status: 'DELIVERED' },
            include: { payment: true }
        })

        let totalPlatformFees = 0
        let totalProviderEarnings = 0

        ordersWithPayments.forEach(order => {
            if (order.payment) {
                const loadPrice = order.payment.amount
                const platformFee = loadPrice * 0.20 // 20% platform fee
                const providerEarnings = loadPrice * 0.80 // 80% to provider

                totalPlatformFees += platformFee
                totalProviderEarnings += providerEarnings
            }
        })

        // Format recent orders for the dashboard
        const formattedRecentOrders = recentOrders.map(order => ({
            id: order.id,
            loadName: order.load?.name || 'Unknown Load',
            truckName: order.truck?.name || 'Unknown Truck',
            status: order.status,
            createdAt: order.createdAt
        }))

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
                users: sampleUsers.map(u => ({ id: u.id, email: u.email, role: u.role, name: u.name })),
                loads: sampleLoads.map(l => ({ id: l.id, name: l.name, status: l.status })),
                trucks: sampleTrucks.map(t => ({ id: t.id, name: t.name || `${t.make} ${t.model}`, status: t.status })),
                orders: formattedRecentOrders
            }
        }
    } catch (error: any) {
        console.error('ERROR in admin dashboard API:', error)
        return {
            error: error.message,
            counts: {
                totalUsers: 0,
                activeLoads: 0,
                availableTrucks: 0,
                completedOrders: 0,
                totalPlatformFees: 0,
                totalProviderEarnings: 0
            },
            samples: {
                users: [],
                loads: [],
                trucks: [],
                orders: []
            }
        }
    }
}) 