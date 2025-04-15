import jwt from 'jsonwebtoken'
import { db } from '~/server/db'
import { getJwtSecret } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
    console.log('Validate token API called')

    try {
        // Get the Authorization header
        const authHeader = getRequestHeader(event, 'Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No valid authorization header found')
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Extract the token
        const token = authHeader.split(' ')[1]
        console.log('Token received for validation')

        // Verify the token
        const secret = getJwtSecret()
        const decoded = jwt.verify(token, secret) as { userId: string }
        console.log('Token verified, userId:', decoded.userId)

        if (!decoded.userId) {
            console.log('No userId in token')
            throw createError({
                statusCode: 401,
                message: 'Invalid token'
            })
        }

        // Get user from database
        const user = await db.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) {
            console.log('No user found with id:', decoded.userId)
            throw createError({
                statusCode: 401,
                message: 'User not found'
            })
        }

        console.log('User found:', user.email, 'role:', user.role)
        return { user }
    } catch (error) {
        console.error('Token validation error:', error)
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }
}) 