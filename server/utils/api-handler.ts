import { EventHandler, EventHandlerRequest, H3Event } from 'h3'
import { prisma } from './prisma'
import { PrismaClient } from '@prisma/client'

/**
 * Wrapper for API handlers that safely manages Prisma connections
 * This prevents the SSR issues with Prisma in Nuxt
 * 
 * @param handler The API handler function
 * @returns An event handler
 */
export function createApiHandler<T>(
    handler: (event: H3Event<EventHandlerRequest>, db: PrismaClient) => Promise<T>
): EventHandler<EventHandlerRequest, Promise<T>> {
    return async (event) => {
        try {
            // Execute the handler with the event and prisma client
            return await handler(event, prisma)
        } catch (error: any) {
            console.error('API Error:', error)

            // Rethrow as H3 error
            throw createError({
                statusCode: error.statusCode || 500,
                message: error.message || 'An unexpected error occurred'
            })
        }
    }
} 