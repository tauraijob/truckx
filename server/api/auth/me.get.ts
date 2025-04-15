import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        // Get user from context (set by auth middleware)
        const auth = event.context.auth
        if (!auth) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: auth.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true
            }
        })

        if (!user) {
            throw createError({
                statusCode: 404,
                message: 'User not found'
            })
        }

        return user
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error'
        })
    }
}) 