import { defineStore } from 'pinia'

interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'TRUCK_PROVIDER' | 'LOAD_PROVIDER' | 'SUPER_ADMIN'
}

interface AuthState {
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role,
        fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : ''
    },

    actions: {
        async login(email: string, password: string) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })

                if (!response.ok) {
                    throw new Error('Invalid credentials')
                }

                const data = await response.json()
                this.token = data.token
                this.user = data.user

                // Only access localStorage in browser environment
                if (process.client) {
                    localStorage.setItem('token', data.token)
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'An error occurred'
                throw error
            } finally {
                this.loading = false
            }
        },

        async register(userData: {
            email: string
            password: string
            firstName: string
            lastName: string
            role: 'TRUCK_PROVIDER' | 'LOAD_PROVIDER'
        }) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                })

                if (!response.ok) {
                    throw new Error('Registration failed')
                }

                const data = await response.json()
                this.token = data.token
                this.user = data.user

                // Only access localStorage in browser environment
                if (process.client) {
                    localStorage.setItem('token', data.token)
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'An error occurred'
                throw error
            } finally {
                this.loading = false
            }
        },

        async checkAuth() {
            this.loading = true
            this.error = null
            try {
                let token = this.token

                // Only access localStorage in browser environment
                if (process.client && !token) {
                    token = localStorage.getItem('token')
                }

                if (!token) {
                    throw new Error('No token found')
                }

                // TODO: Replace with actual API call
                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Invalid token')
                }

                const data = await response.json()
                this.token = token
                this.user = data.user
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'An error occurred'
                this.token = null
                this.user = null

                // Only access localStorage in browser environment
                if (process.client) {
                    localStorage.removeItem('token')
                }

                throw error
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.token = null
            this.user = null

            // Only access localStorage in browser environment
            if (process.client) {
                localStorage.removeItem('token')
            }
        }
    }
}) 