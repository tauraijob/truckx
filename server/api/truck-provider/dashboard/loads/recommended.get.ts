import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get authenticated user
        const session = await getServerSession(event)
        if (!session || !session.user) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Verify user is a truck provider
        const userId = session.user.id
        const userRole = session.user.role

        if (userRole !== 'TRUCK_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Forbidden: Only truck providers can access this resource'
            })
        }

        console.log('Fetching recommended loads for truck provider:', userId)

        // Get available loads that haven't been assigned yet
        const recommendedLoads = await prisma.load.findMany({
            where: {
                isAvailable: true
            },
            include: {
                provider: true
            },
            orderBy: [
                { price: 'desc' }  // Sort by price (highest first)
            ],
            take: 5
        })

        console.log(`Found ${recommendedLoads.length} recommended loads`)

        // Transform to expected format
        const formattedLoads = recommendedLoads.map(load => {
            return {
                id: load.id,
                title: load.title || 'Unnamed Load',
                description: load.description || 'No description provided',
                origin: load.pickupLocation || 'Unknown origin',
                destination: load.deliveryLocation || 'Unknown destination',
                pickupDate: load.pickupDate || new Date().toISOString(),
                deliveryDate: load.deliveryDate ||
                    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                price: load.price || 0
            }
        })

        return formattedLoads
    } catch (error: any) {
        console.error('Error fetching recommended loads:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error fetching recommended loads'
        })
    }
}) 