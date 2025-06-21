import { ref, computed } from 'vue'
import type { User, UserRole } from '~/types'

interface LoginResponse {
    user: User
    token: string
    message: string
}

// Create a single global instance for state
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Helper function to safely access localStorage
const getStoredToken = (): string | null => {
    if (process.client) {
        return localStorage.getItem('token')
    }
    return null
}

// Helper function to safely set token in localStorage
const setStoredToken = (token: string): void => {
    if (process.client) {
        localStorage.setItem('token', token)
    }
}

// Helper function to safely remove token from localStorage
const removeStoredToken = (): void => {
    if (process.client) {
        localStorage.removeItem('token')
    }
}

export const useAuth = () => {
    const isAuthenticated = computed(() => !!user.value)

    const login = async (email: string, password: string): Promise<boolean> => {
        loading.value = true
        error.value = null

        try {
            console.log('Making login API call with email:', email)

            const response = await $fetch<any>('/api/auth/login', {
                method: 'POST',
                body: { email, password }
            })

            console.log('Login API response:', JSON.stringify(response, null, 2))

            if (response.success === false) {
                error.value = response.message || 'Failed to login'
                return false
            }

            if (!response.token) {
                console.error('No token received in login response')
                error.value = 'Authentication failed: No token received'
                return false
            }

            // Store the token
            setStoredToken(response.token)
            console.log('Token stored in localStorage')

            if (!response.user) {
                console.error('No user data received in login response')
                error.value = 'Authentication failed: No user data received'
                return false
            }

            // Set the user
            user.value = response.user
            console.log('User state set to:', JSON.stringify(user.value, null, 2))

            // Return true since we have both token and user
            return true
        } catch (err: any) {
            console.error('Login API error:', err)

            if (err.response) {
                console.error('Response error:', err.response._data)
                error.value = err.response._data?.message || 'Failed to login'
            } else if (err.data) {
                console.error('Data error:', err.data)
                error.value = err.data?.message || 'Failed to login'
            } else {
                console.error('Unknown error:', err.message || err)
                error.value = err.message || 'Failed to login'
            }

            return false
        } finally {
            loading.value = false
        }
    }

    const logout = () => {
        user.value = null
        removeStoredToken()
        console.log('User logged out, auth state cleared')
    }

    const checkAuth = async () => {
        // Only check token on client-side
        if (!process.client) {
            console.log('checkAuth - running on server, skipping token check')
            return false
        }

        const token = getStoredToken()
        console.log('checkAuth - token exists:', !!token)

        if (!token) {
            console.log('checkAuth - no token found')
            user.value = null
            return false
        }

        try {
            console.log('checkAuth - calling validate token API')
            const { data } = await useFetch<{ user: User }>('/api/auth/validate-token', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log('checkAuth - API response:', data.value)

            if (data.value && data.value.user) {
                console.log('checkAuth - setting user data:', data.value.user)
                user.value = data.value.user
                return true
            } else {
                console.log('checkAuth - no user data in response')
                user.value = null
                removeStoredToken()
                return false
            }
        } catch (error) {
            console.error('checkAuth - error:', error)
            user.value = null
            removeStoredToken()
            return false
        }
    }

    const getToken = () => {
        return getStoredToken()
    }

    // Helper computed properties for role checks
    const isAdmin = computed(() => user.value?.role === UserRole.ADMIN || user.value?.role === UserRole.SUPER_ADMIN)
    const isTruckProvider = computed(() => user.value?.role === UserRole.TRUCK_PROVIDER)
    const isLoadProvider = computed(() => user.value?.role === UserRole.LOAD_PROVIDER)

    return {
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        isTruckProvider,
        isLoadProvider,
        login,
        logout,
        checkAuth,
        getToken
    }
} 