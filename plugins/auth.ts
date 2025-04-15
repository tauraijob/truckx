import { defineNuxtPlugin } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
    const auth = useAuth()

    console.log('Auth plugin initializing')

    // Only access localStorage in browser environment
    if (process.client) {
        const token = localStorage.getItem('token')
        console.log('Auth plugin - token found in localStorage:', !!token)

        if (token) {
            try {
                console.log('Auth plugin - checking auth state')
                const success = await auth.checkAuth()
                console.log('Auth plugin - auth check result:', success)

                if (success) {
                    console.log('Auth plugin - user authenticated:', auth.user.value?.role)
                } else {
                    console.log('Auth plugin - user authentication failed')
                }
            } catch (error) {
                console.error('Auth plugin - error checking auth:', error)
                localStorage.removeItem('token')
            }
        }
    }

    // Make auth store available globally
    nuxtApp.provide('auth', auth)
}) 