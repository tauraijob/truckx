import { verifyToken, type AuthToken } from '../utils/auth'

export default defineEventHandler((event) => {
    // Skip auth check for non-API routes
    if (!event.path.startsWith('/api/')) {
        return
    }

    console.log(`[Auth Middleware] Processing request for path: ${event.path}`)

    // Skip auth check for public API routes
    const publicRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/admin/create-direct'
    ]

    // Check if the path starts with any of these prefixes
    const publicPrefixes = [
        '/api/public/'
    ]

    if (publicPrefixes.some(prefix => event.path.startsWith(prefix))) {
        console.log(`[Auth Middleware] Public API prefix route: ${event.path}`)
        return
    }

    // For development mode, add admin dashboard paths to public routes
    const isDev = process.env.NODE_ENV !== 'production'
    const adminRoutes = [
        '/api/admin/dashboard/stats',
        '/api/admin/users',
        '/api/admin/loads',
        '/api/admin/trucks',
        '/api/admin/test'
    ]

    if (isDev && adminRoutes.includes(event.path)) {
        console.log(`[Auth Middleware] Bypassing auth check for ${event.path} in development mode`)

        // For debugging, still check if token exists but don't require it
        const authHeader = getHeader(event, 'Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]
            try {
                const decoded = verifyToken(token)
                if (decoded) {
                    console.log(`[Auth Middleware] Token provided and valid for ${event.path}`)
                    event.context.auth = {
                        userId: decoded.userId,
                        role: decoded.role
                    }
                } else {
                    console.log(`[Auth Middleware] Token provided but invalid for ${event.path}`)
                }
            } catch (error) {
                console.log(`[Auth Middleware] Token validation error: ${error.message}`)
            }
        } else {
            console.log(`[Auth Middleware] No token provided for ${event.path} but continuing in dev mode`)
        }

        return
    }

    if (publicRoutes.includes(event.path)) {
        console.log(`[Auth Middleware] Public route: ${event.path}`)
        return
    }

    // Get the authorization header
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(`[Auth Middleware] Unauthorized: No token provided for ${event.path}`)
        throw createError({
            statusCode: 401,
            message: 'Unauthorized: No token provided'
        })
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    try {
        const decoded = verifyToken(token)

        if (!decoded) {
            console.log(`[Auth Middleware] Unauthorized: Invalid token for ${event.path}`)
            throw createError({
                statusCode: 401,
                message: 'Unauthorized: Invalid token'
            })
        }

        console.log(`[Auth Middleware] Valid token for ${event.path} - User ID: ${decoded.userId}, Role: ${decoded.role}`)

        // Add user info to the event context
        event.context.auth = {
            userId: decoded.userId,
            role: decoded.role
        }
    } catch (error) {
        console.log(`[Auth Middleware] Token verification error for ${event.path}: ${error.message}`)
        throw createError({
            statusCode: 401,
            message: `Unauthorized: ${error.message || 'Invalid token'}`
        })
    }
}) 