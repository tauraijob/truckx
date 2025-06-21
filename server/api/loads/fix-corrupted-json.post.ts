import { createApiHandler } from '~/server/utils/api-imports'

// Skip authentication for this admin endpoint
export const skipAuth = true

export default createApiHandler(async (event, db) => {
    try {
        // Get all loads
        const loads = await db.load.findMany({
            select: {
                id: true,
                specifications: true
            }
        })

        console.log(`Found ${loads.length} loads to check`)

        const fixedLoads = []
        const corruptedLoads = []

        // Check each load's specifications
        for (const load of loads) {
            try {
                // If specifications is null or undefined, set it to an empty object
                if (!load.specifications) {
                    await db.load.update({
                        where: { id: load.id },
                        data: { specifications: {} }
                    })
                    fixedLoads.push({ id: load.id, action: 'Set empty object' })
                    continue
                }

                // If specifications is a string, try to parse it
                if (typeof load.specifications === 'string') {
                    try {
                        // Try to parse the string
                        const parsed = JSON.parse(load.specifications)
                        // If it's valid JSON, update the record
                        await db.load.update({
                            where: { id: load.id },
                            data: { specifications: parsed }
                        })
                        fixedLoads.push({ id: load.id, action: 'Parsed string to JSON' })
                    } catch (e) {
                        // If parsing fails, set to empty object
                        await db.load.update({
                            where: { id: load.id },
                            data: { specifications: {} }
                        })
                        corruptedLoads.push({ id: load.id, error: e.message })
                    }
                }
            } catch (error) {
                console.error(`Error processing load ${load.id}:`, error)
                corruptedLoads.push({ id: load.id, error: error.message })
            }
        }

        return {
            message: 'Load specifications check completed',
            summary: {
                total: loads.length,
                fixed: fixedLoads.length,
                corrupted: corruptedLoads.length
            },
            fixedLoads,
            corruptedLoads
        }
    } catch (error) {
        console.error('Error fixing corrupted JSON:', error)
        throw createError({
            statusCode: 500,
            message: 'Error fixing corrupted JSON data'
        })
    }
}) 