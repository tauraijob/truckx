import { ref, computed } from 'vue'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'TRUCK_PROVIDER' | 'LOAD_PROVIDER' | 'SUPER_ADMIN' | 'ADMIN'
    phoneNumber: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface LoginResponse {
    user: User
    token: string
    message: string
}

// Create a single global instance for state
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useAuth = () => {
    const isAuthenticated = computed(() => !!user.value)

    const login = async (email: string, password: string): Promise<boolean> => {
        loading.value = true
        error.value = null

        try {
            console.log('Making login API call with email:', email)

            const response = await $fetch<LoginResponse>('/api/auth/login', {
                method: 'POST',
                body: { email, password }
            })

            console.log('Login API full response:', JSON.stringify(response, null, 2))

            if (!response.token) {
                console.error('No token received in login response')
                error.value = 'Authentication failed: No token received'
                return false
            }

            // Store the token
            localStorage.setItem('token', response.token)
            console.log('Token stored in localStorage')

            if (!response.user) {
                console.error('No user data received in login response')
                error.value = 'Authentication failed: No user data received'
                return false
            }

            // Set the user
            user.value = { ...response.user }
            console.log('User state set to:', JSON.stringify(user.value, null, 2))

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
        localStorage.removeItem('token')
        console.log('User logged out, auth state cleared')
    }

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
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
                localStorage.removeItem('token')
                return false
            }
        } catch (error) {
            console.error('checkAuth - error:', error)
            user.value = null
            localStorage.removeItem('token')
            return false
        }
    }

    const getToken = () => {
        const token = localStorage.getItem('token')
        console.log('getToken called, token exists:', !!token)
        return token
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        checkAuth,
        getToken
    }
} 