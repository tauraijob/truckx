import { verifyToken, type AuthToken } from '../utils/auth'
import { fileURLToPath } from 'url'
import { resolve } from 'pathe'

const devLog = (...args: any[]) => { if (process.env.NODE_ENV !== 'production') console.log(...args) }

export default defineEventHandler(async (event) => {
    const path = event.node.req.url
    if (path === '/api/auth/forgot-password' || path === '/api/auth/reset-password') {
        // Skip auth for forgot-password and reset-password endpoints
        return
    }

    // Skip auth check for non-API routes
    if (!event.path.startsWith('/api/')) {
        return
    }

    // --- Check for skipAuth export on the route handler ---
    try {
        // Only check for skipAuth on /api/ routes
        // Remove query string and .ts/.js extension
        let routePath = event.path
        if (routePath.endsWith('.ts') || routePath.endsWith('.js')) {
            routePath = routePath.replace(/\.(ts|js)$/, '')
        }
        // Map /api/foo/bar to server/api/foo/bar(.ts|.js)
        const handlerPath = resolve(
            fileURLToPath(import.meta.url),
            '../../api' + routePath.replace('/api', '')
        )
        // Try both .ts and .js
        let handlerModule
        try {
            handlerModule = await import(handlerPath + '.ts')
        } catch {
            try {
                handlerModule = await import(handlerPath + '.js')
            } catch { }
        }
        if (handlerModule && handlerModule.skipAuth) {
            devLog(`[Auth Middleware] skipAuth detected for ${event.path}`)
            return
        }
    } catch (e) {
        // Ignore errors in skipAuth check
    }

    devLog(`[Auth Middleware] Processing request for path: ${event.path}`)

    // Skip auth check for public API routes
    const publicRoutes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/verify-otp',
        '/api/admin/create-direct',
        '/api/uploads'
    ]

    // Check if the path starts with any of these prefixes
    const publicPrefixes = [
        '/api/public/'
    ]

    if (publicPrefixes.some(prefix => event.path.startsWith(prefix))) {
        devLog(`[Auth Middleware] Public API prefix route: ${event.path}`)
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
        devLog(`[Auth Middleware] Bypassing auth check for ${event.path} in development mode`)

        // For debugging, still check if token exists but don't require it
        const authHeader = getHeader(event, 'Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]
            try {
                const decoded = verifyToken(token)
                if (decoded) {
                    devLog(`[Auth Middleware] Token provided and valid for ${event.path}`)
                    event.context.auth = {
                        userId: decoded.userId,
                        role: decoded.role
                    }
                } else {
                    devLog(`[Auth Middleware] Token provided but invalid for ${event.path}`)
                }
            } catch (error) {
                devLog(`[Auth Middleware] Token validation error: ${(error as any).message}`)
            }
        } else {
            devLog(`[Auth Middleware] No token provided for ${event.path} but continuing in dev mode`)
        }

        return
    }

    if (publicRoutes.includes(event.path)) {
        devLog(`[Auth Middleware] Public route: ${event.path}`)
        return
    }

    // Get the authorization header
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        devLog(`[Auth Middleware] Unauthorized: No token provided for ${event.path}`)
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
            devLog(`[Auth Middleware] Unauthorized: Invalid token for ${event.path}`)
            throw createError({
                statusCode: 401,
                message: 'Unauthorized: Invalid token'
            })
        }

        devLog(`[Auth Middleware] Valid token for ${event.path} - User ID: ${decoded.userId}, Role: ${decoded.role}`)

        // Add user info to the event context
        event.context.auth = {
            userId: decoded.userId,
            role: decoded.role
        }
    } catch (error) {
        devLog(`[Auth Middleware] Token verification error for ${event.path}: ${(error as any).message}`)
        throw createError({
            statusCode: 401,
            message: `Unauthorized: ${(error as any).message || 'Invalid token'}`
        })
    }
}) 