import { prisma } from '#imports'
import { OrderStatus } from '~/server/utils/enums'
import { getQuery } from 'h3'

// Fallback enum in case the import fails
const FALLBACK_ORDER_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    REJECTED: 'REJECTED'
}

const devLog = (...args: any[]) => { if (process.env.NODE_ENV !== 'production') console.log(...args) }

export default defineEventHandler(async (event) => {
    try {
        devLog('🌎 PUBLIC LOADS API: Fetching loads for public view')

        // Add pagination
        const { page = 1, limit = 20 } = getQuery(event)
        const pageNum = parseInt(page as string)
        const limitNum = parseInt(limit as string)
        const skip = (pageNum - 1) * limitNum

        devLog(`🔍 PUBLIC LOADS API: Fetching up to ${limitNum} loads`)

        // Use the imported enum or fallback to our local definition if it fails
        const STATUS = OrderStatus || FALLBACK_ORDER_STATUS

        // Fetch only available loads that don't have active orders
        const loads = await prisma.load.findMany({
            where: {
                isAvailable: true,
                // Exclude loads with active orders
                NOT: {
                    orders: {
                        some: {
                            status: {
                                in: [STATUS.PENDING, STATUS.ACCEPTED, STATUS.IN_TRANSIT]
                            }
                        }
                    }
                }
            },
            take: limitNum,
            skip,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                weight: true,
                volume: true,
                pickupLocation: true,
                deliveryLocation: true,
                distance: true,
                price: true,
                type: true,
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
        const total = await prisma.load.count({
            where: {
                isAvailable: true,
                NOT: {
                    orders: {
                        some: {
                            status: {
                                in: [STATUS.PENDING, STATUS.ACCEPTED, STATUS.IN_TRANSIT]
                            }
                        }
                    }
                }
            }
        })

        devLog(`✅ PUBLIC LOADS API: Found ${loads.length} available loads`)

        // Format the loads for public display
        const publicLoads = loads.map(load => {
            // Parse specifications if they exist
            let specifications = {}
            try {
                specifications = typeof load.specifications === 'string'
                    ? JSON.parse(load.specifications)
                    : load.specifications || {}
            } catch (e) {
                devLog('Error parsing specifications:', e)
                specifications = {
                    requiresRefrigeration: false,
                    fragile: false,
                    hazardous: false,
                    pickupDate: new Date(Date.now() + 86400000 * 3).toISOString(),
                    deliveryDate: new Date(Date.now() + 86400000 * 7).toISOString()
                }
            }

            // Parse images if they exist
            let images = []
            try {
                // First try to get images from the images field
                if (load.images) {
                    images = typeof load.images === 'string'
                        ? JSON.parse(load.images)
                        : load.images
                }
                // If no images in the images field, try to get from specifications._images
                if (images.length === 0 && specifications && specifications._images) {
                    images = specifications._images
                }
                // If still no images, use default placeholder
                if (images.length === 0) {
                    images = ['/images/load-placeholder.webp']
                }
            } catch (e) {
                devLog('Error parsing images:', e)
                images = ['/images/load-placeholder.webp']
            }

            // Get dates from specifications
            const pickupDate = specifications.pickupDate || new Date(Date.now() + 86400000 * 3).toISOString()
            const deliveryDate = specifications.deliveryDate || new Date(Date.now() + 86400000 * 7).toISOString()

            // Log the images for debugging
            devLog(`Load ${load.id} images:`, images)

            return {
                id: load.id,
                name: load.title || 'Unnamed Load',
                description: load.description || 'No description available',
                weight: load.weight || 5,
                weightUnit: 'tons',
                volume: load.volume || 200,
                volumeUnit: 'cubic feet',
                origin: load.pickupLocation || 'Unknown Location',
                destination: load.deliveryLocation || 'Unknown Location',
                distance: load.distance || 0,
                price: load.price || 1000,
                status: 'Available',
                type: load.type || 'Standard',
                pickupDate,
                deliveryDate,
                images: Array.isArray(images) ? images.slice(0, 5) : [], // Limit to 5 images
                specifications: {
                    requiresRefrigeration: specifications.requiresRefrigeration || false,
                    fragile: specifications.fragile || false,
                    hazardous: specifications.hazardous || false
                },
                providerName: load.provider ? `${load.provider.firstName} ${load.provider.lastName}` : 'Unknown Provider'
            }
        })

        // If no loads found, return empty array
        if (publicLoads.length === 0) {
            devLog('⚠️ PUBLIC LOADS API: No available loads found')
            return { loads: [] }
        }

        devLog('Returning loads:', JSON.stringify(publicLoads, null, 2))
        return {
            loads: publicLoads,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalItems: total,
                totalPages: Math.ceil(total / limitNum)
            }
        }
    } catch (error: any) {
        devLog('❌ PUBLIC LOADS API: Error fetching loads:', error)
        return { loads: [] }
    }
}) 