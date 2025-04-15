import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
    const { isAuthenticated, user } = useAuth()

    // Log for debugging
    console.log('Auth Middleware - User:', user.value)
    console.log('Auth Middleware - Route:', to.path)

    // If user is not authenticated and trying to access protected routes
    if (!isAuthenticated.value && to.path.startsWith('/dashboard')) {
        console.log('Auth Middleware - Redirecting to login')
        return navigateTo('/auth/login')
    }

    // If user is authenticated but trying to access auth pages
    if (isAuthenticated.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
        console.log('Auth Middleware - Redirecting from auth pages')
        // Redirect to role-specific dashboard
        const userRole = user.value?.role
        if (userRole === 'TRUCK_PROVIDER') {
            return navigateTo('/dashboard/truck-provider')
        } else if (userRole === 'LOAD_PROVIDER') {
            return navigateTo('/dashboard/load-provider')
        } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            return navigateTo('/dashboard/admin')
        }
    }

    // Role-based access control
    if (isAuthenticated.value && to.path.startsWith('/dashboard')) {
        console.log('Auth Middleware - Checking role-based access')
        const userRole = user.value?.role
        const path = to.path

        // If accessing the root dashboard, redirect to role-specific dashboard
        if (path === '/dashboard') {
            console.log('Auth Middleware - Redirecting from root dashboard')
            if (userRole === 'TRUCK_PROVIDER') {
                return navigateTo('/dashboard/truck-provider')
            } else if (userRole === 'LOAD_PROVIDER') {
                return navigateTo('/dashboard/load-provider')
            } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
                return navigateTo('/dashboard/admin')
            }
        }

        // Check if user has access to the requested path
        if (userRole === 'TRUCK_PROVIDER' && !path.startsWith('/dashboard/truck-provider')) {
            console.log('Auth Middleware - Truck provider accessing non-permitted area')
            return navigateTo('/dashboard/truck-provider')
        }
        if (userRole === 'LOAD_PROVIDER' && !path.startsWith('/dashboard/load-provider')) {
            console.log('Auth Middleware - Load provider accessing non-permitted area')
            return navigateTo('/dashboard/load-provider')
        }
        if ((userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && !path.startsWith('/dashboard/admin')) {
            console.log('Auth Middleware - Admin accessing non-permitted area')
            return navigateTo('/dashboard/admin')
        }
    }
}) 