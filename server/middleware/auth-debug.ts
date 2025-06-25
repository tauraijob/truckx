import { getServerSession } from '#auth'

const devLog = (...args: any[]) => { if (process.env.NODE_ENV !== 'production') console.log(...args) }

// Export a properly named middleware function
export default defineEventHandler(async (event) => {
    const method = event.node.req.method
    const url = event.node.req.url || ''

    // Only log for API routes
    if (url.startsWith('/api/')) {
        devLog(`[AUTH-DEBUG] ${method} ${url}`)

        try {
            const session = await getServerSession(event)
            if (session) {
                devLog(`[AUTH-DEBUG] Authenticated as: ${session.user.email} (${session.user.role})`)
            } else {
                devLog('[AUTH-DEBUG] No authentication session found')

                // Log headers to debug authentication issues
                const headers = event.node.req.headers
                devLog('[AUTH-DEBUG] Headers:', {
                    cookie: headers.cookie ? 'Present' : 'Missing',
                    authorization: headers.authorization ? 'Present' : 'Missing'
                })
            }
        } catch (error) {
            devLog('[AUTH-DEBUG] Error getting session:', error)
        }
    }
}) 