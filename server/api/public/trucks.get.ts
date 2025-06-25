import { prisma } from '#imports'
import { getQuery } from 'h3'

const devLog = (...args: any[]) => { if (process.env.NODE_ENV !== 'production') console.log(...args) }

export default defineEventHandler(async (event) => {
    try {
        devLog('🌎 PUBLIC TRUCKS API: Fetching trucks for public view')

        // Add pagination
        const { page = 1, limit = 20 } = getQuery(event)
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        devLog(`🔍 PUBLIC TRUCKS API: Fetching up to ${limitNum} trucks`)

        // Fetch only available trucks
        const trucks = await prisma.truck.findMany({
            where: {
                isAvailable: true
            },
            take: limitNum,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                make: true,
                model: true,
                year: true,
                licensePlate: true,
                capacity: true,
                images: true,
                specifications: true,
                isAvailable: true,
                provider: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        // Get total count for pagination
        const total = await prisma.truck.count({
            where: {
                isAvailable: true
            }
        })

        devLog(`✅ PUBLIC TRUCKS API: Found ${trucks.length} available trucks`)

        // Format the trucks for public display
        const publicTrucks = trucks.map(truck => {
            // Parse specifications if they exist
            let specifications = {}
            try {
                specifications = typeof truck.specifications === 'string'
                    ? JSON.parse(truck.specifications)
                    : truck.specifications || {}
            } catch (e) {
                devLog('Error parsing specifications:', e)
                specifications = {
                    engineType: 'Diesel',
                    transmission: 'Automatic',
                    axles: '6x4',
                    wheelbase: '244 inches',
                    type: 'STANDARD',
                    currentLocation: 'Unknown Location',
                    description: 'A reliable and efficient truck for cargo transportation.'
                }
            }

            // Parse images if they exist
            let images = []
            try {
                images = typeof truck.images === 'string'
                    ? JSON.parse(truck.images)
                    : truck.images || []
            } catch (e) {
                devLog('Error parsing images:', e)
                images = ['/images/truckx-slide.webp']
            }

            // Get location and description from specifications
            const location = specifications.currentLocation || 'Unknown Location'
            const type = specifications.type || 'STANDARD'
            const description = specifications.description || 'A reliable and efficient truck for cargo transportation.'

            return {
                id: truck.id,
                name: `${truck.make} ${truck.model}`,
                make: truck.make,
                model: truck.model,
                year: truck.year,
                type: type,
                capacity: truck.capacity || 20,
                capacityUnit: 'tons',
                currentLocation: location,
                imageUrl: images.length > 0 ? images[0] : '/images/truckx-slide.webp',
                images: Array.isArray(images) ? images.slice(0, 5) : [],
                specifications: {
                    engineType: specifications.engineType || 'Diesel',
                    transmission: specifications.transmission || 'Automatic',
                    axles: specifications.axles || '6x4',
                    wheelbase: specifications.wheelbase || '244 inches'
                },
                description: description,
                providerName: truck.provider ? `${truck.provider.firstName} ${truck.provider.lastName}` : 'Unknown Provider'
            }
        })

        // If no trucks found, return empty array
        if (publicTrucks.length === 0) {
            devLog('⚠️ PUBLIC TRUCKS API: No available trucks found')
            return { trucks: [] }
        }

        devLog('Returning trucks:', JSON.stringify(publicTrucks, null, 2))
        return {
            trucks: publicTrucks,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: total,
                totalPages: Math.ceil(total / limitNum)
            }
        }
    } catch (error: any) {
        devLog('❌ PUBLIC TRUCKS API: Error fetching trucks:', error)
        return { trucks: [] }
    }
}) 