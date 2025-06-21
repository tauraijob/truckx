import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixLoads() {
    try {
        console.log('Starting load data fix...')

        // Get all loads
        const loads = await prisma.load.findMany({
            select: {
                id: true,
                specifications: true,
                images: true
            }
        })

        console.log(`Found ${loads.length} loads to process`)

        let updated = 0
        let errors = 0

        // Process each load
        for (const load of loads) {
            try {
                // Parse and validate specifications
                let specifications = {}
                try {
                    if (typeof load.specifications === 'string') {
                        specifications = JSON.parse(load.specifications)
                    } else if (load.specifications && typeof load.specifications === 'object') {
                        specifications = load.specifications
                    }
                } catch (e) {
                    console.warn(`Invalid specifications for load ${load.id}, resetting to empty object`)
                    specifications = {}
                }

                // Parse and validate images
                let images = []
                try {
                    if (typeof load.images === 'string') {
                        images = JSON.parse(load.images)
                    } else if (Array.isArray(load.images)) {
                        images = load.images
                    }

                    // Ensure images is an array
                    if (!Array.isArray(images)) {
                        images = []
                    }
                } catch (e) {
                    console.warn(`Invalid images for load ${load.id}, resetting to empty array`)
                    images = []
                }

                // Update the load with validated data
                await prisma.load.update({
                    where: { id: load.id },
                    data: {
                        specifications: specifications,
                        images: images
                    }
                })
                updated++
                console.log(`Updated load ${load.id}`)
            } catch (error) {
                errors++
                console.error(`Error updating load ${load.id}:`, error)
            }
        }

        console.log('\nUpdate completed:')
        console.log(`Total loads processed: ${loads.length}`)
        console.log(`Updated: ${updated}`)
        console.log(`Errors: ${errors}`)

    } catch (error) {
        console.error('Script error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the fix
fixLoads()
    .then(() => console.log('Script completed'))
    .catch(console.error) 