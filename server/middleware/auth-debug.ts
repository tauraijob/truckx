import { getServerSession } from '#auth'

// Export a properly named middleware function
export default defineEventHandler(async (event) => {
    const method = event.node.req.method
    const url = event.node.req.url || ''

    // Only log for API routes
    if (url.startsWith('/api/')) {
        console.log(`[AUTH-DEBUG] ${method} ${url}`)

        try {
            const session = await getServerSession(event)
            if (session) {
                console.log(`[AUTH-DEBUG] Authenticated as: ${session.user.email} (${session.user.role})`)
            } else {
                console.log('[AUTH-DEBUG] No authentication session found')

                // Log headers to debug authentication issues
                const headers = event.node.req.headers
                console.log('[AUTH-DEBUG] Headers:', {
                    cookie: headers.cookie ? 'Present' : 'Missing',
                    authorization: headers.authorization ? 'Present' : 'Missing'
                })
            }
        } catch (error) {
            console.error('[AUTH-DEBUG] Error getting session:', error)
        }
    }
}) 