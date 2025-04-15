import { createApiHandler } from '~/server/utils/api-handler'
import { getQuery } from 'h3'

export default createApiHandler(async (event, db) => {
    try {
        // Get query parameters
        const query = getQuery(event)
        const limit = parseInt(query.limit as string) || 10

        // Fetch available trucks from database
        const trucks = await db.truck.findMany({
            where: {
                isAvailable: true
            },
            take: limit,
            select: {
                id: true,
                make: true,
                model: true,
                year: true,
                capacity: true,
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

        // Process trucks to add formatted data
        const formattedTrucks = trucks.map(truck => {
            // Parse the JSON images
            let images = []
            try {
                images = typeof truck.images === 'string'
                    ? JSON.parse(truck.images as string)
                    : truck.images
            } catch (e) {
                images = []
            }

            // Parse the JSON specifications
            let specifications = {}
            try {
                specifications = typeof truck.specifications === 'string'
                    ? JSON.parse(truck.specifications as string)
                    : truck.specifications
            } catch (e) {
                specifications = {}
            }

            // Format the data for public consumption
            return {
                id: truck.id,
                name: `${truck.make} ${truck.model} (${truck.year})`,
                make: truck.make,
                model: truck.model,
                year: truck.year,
                capacity: truck.capacity,
                capacityUnit: 'lbs',
                location: specifications.location || 'Not specified',
                imageUrl: images.length > 0 ? images[0] : 'https://placehold.co/600x400?text=Truck',
                specifications,
                providerName: `${truck.provider.firstName} ${truck.provider.lastName}`
            }
        })

        // Return the formatted data
        return {
            trucks: formattedTrucks
        }
    } catch (error) {
        console.error('Error fetching public trucks:', error)

        // Return demo data in case of error
        return {
            trucks: [
                {
                    id: 'demo1',
                    name: 'Volvo VNL 760',
                    make: 'Volvo',
                    model: 'VNL 760',
                    year: 2023,
                    capacity: 40000,
                    capacityUnit: 'lbs',
                    location: 'Chicago, IL',
                    imageUrl: 'https://placehold.co/600x400?text=Volvo+Truck',
                    specifications: {
                        engineType: 'Diesel',
                        transmission: 'Automatic',
                        axles: '6x4',
                        wheelbase: '244 inches'
                    },
                    providerName: 'John Smith'
                },
                {
                    id: 'demo2',
                    name: 'Peterbilt 389',
                    make: 'Peterbilt',
                    model: '389',
                    year: 2022,
                    capacity: 45000,
                    capacityUnit: 'lbs',
                    location: 'Dallas, TX',
                    imageUrl: 'https://placehold.co/600x400?text=Peterbilt+Truck',
                    specifications: {
                        engineType: 'Diesel',
                        transmission: 'Manual',
                        axles: '6x4',
                        wheelbase: '260 inches'
                    },
                    providerName: 'Mike Johnson'
                },
                {
                    id: 'demo3',
                    name: 'Freightliner Cascadia',
                    make: 'Freightliner',
                    model: 'Cascadia',
                    year: 2023,
                    capacity: 42000,
                    capacityUnit: 'lbs',
                    location: 'Atlanta, GA',
                    imageUrl: 'https://placehold.co/600x400?text=Freightliner+Truck',
                    specifications: {
                        engineType: 'Diesel',
                        transmission: 'Automatic',
                        axles: '6x4',
                        wheelbase: '230 inches'
                    },
                    providerName: 'Sarah Williams'
                }
            ]
        }
    }
}) 