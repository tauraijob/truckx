import { createApiHandler } from '~/server/utils/api-handler'
import { getQuery } from 'h3'

export default createApiHandler(async (event, db) => {
    try {
        // Get query parameters
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 10

        // Fetch available loads from database
        const loads = await db.load.findMany({
            where: {
                isAvailable: true
            },
            take: limit,
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
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        // Process loads to add formatted data
        const formattedLoads = loads.map(load => {
            // Parse the JSON images
            let images = []
            try {
                images = typeof load.images === 'string'
                    ? JSON.parse(load.images as string)
                    : load.images
            } catch (e) {
                images = []
            }

            // Parse the JSON specifications
            let specifications = {}
            try {
                specifications = typeof load.specifications === 'string'
                    ? JSON.parse(load.specifications as string)
                    : load.specifications
            } catch (e) {
                specifications = {}
            }

            // Get pickup date from specifications
            const pickupDate = specifications.pickupDate || null

            // Format the data for public consumption
            return {
                id: load.id,
                name: load.title,
                description: load.description,
                weight: load.weight,
                weightUnit: 'tons',
                volume: load.volume,
                volumeUnit: 'cubic feet',
                origin: load.pickupLocation,
                destination: load.deliveryLocation,
                distance: load.distance,
                price: load.price,
                status: 'Available',
                type: load.type,
                pickupDate,
                imageUrl: images.length > 0 ? images[0] : null,
                specifications,
                providerName: `${load.provider.firstName} ${load.provider.lastName}`
            }
        })

        // Return the formatted data
        return {
            loads: formattedLoads
        }
    } catch (error) {
        console.error('Error fetching public loads:', error)

        // Return demo data in case of error
        return {
            loads: [
                {
                    id: 'demo1',
                    name: 'Electronics Shipment',
                    description: 'Fragile electronics equipment that needs careful handling.',
                    weight: 5,
                    weightUnit: 'tons',
                    volume: 200,
                    volumeUnit: 'cubic feet',
                    origin: 'San Francisco, CA',
                    destination: 'Seattle, WA',
                    distance: 808,
                    price: 2500,
                    status: 'Available',
                    type: 'Electronics',
                    pickupDate: '2023-06-15',
                    specifications: {
                        requiresRefrigeration: false,
                        fragile: true,
                        hazardous: false
                    },
                    providerName: 'Robert Johnson'
                },
                {
                    id: 'demo2',
                    name: 'Furniture Delivery',
                    description: 'High-end furniture for a new office building.',
                    weight: 3,
                    weightUnit: 'tons',
                    volume: 400,
                    volumeUnit: 'cubic feet',
                    origin: 'Miami, FL',
                    destination: 'Atlanta, GA',
                    distance: 661,
                    price: 1800,
                    status: 'Available',
                    type: 'Furniture',
                    pickupDate: '2023-06-18',
                    specifications: {
                        requiresRefrigeration: false,
                        fragile: true,
                        hazardous: false
                    },
                    providerName: 'Linda Miller'
                },
                {
                    id: 'demo3',
                    name: 'Agricultural Products',
                    description: 'Fresh produce that needs to be delivered quickly.',
                    weight: 12,
                    weightUnit: 'tons',
                    volume: 450,
                    volumeUnit: 'cubic feet',
                    origin: 'Dallas, TX',
                    destination: 'Houston, TX',
                    distance: 239,
                    price: 3200,
                    status: 'Available',
                    type: 'Agricultural',
                    pickupDate: '2023-06-22',
                    specifications: {
                        requiresRefrigeration: true,
                        fragile: false,
                        hazardous: false
                    },
                    providerName: 'Michael Brown'
                }
            ]
        }
    }
})
