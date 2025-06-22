<template>
  <div class="min-h-screen bg-navy-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="/images/logo.png" alt="TruckX">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-navy-900">
        Welcome Back
      </h2>
      <p class="mt-2 text-center text-sm text-navy-600">
        Sign in to your account to continue
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-navy-700">
              Email address
            </label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-navy-700">
              Password
            </label>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="rememberMe" name="remember-me" type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-navy-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-navy-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="/auth/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
              <span v-if="loading">Signing in...</span>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-navy-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-navy-500">
                Or
              </span>
            </div>
          </div>

          <div class="mt-6">
            <NuxtLink to="/auth/register"
              class="w-full flex justify-center py-2 px-4 border border-navy-300 rounded-md shadow-sm text-sm font-medium text-navy-700 bg-white hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-colors duration-200">
              Create a new account
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import * as Toastify from 'vue-toastification'
const { useToast } = Toastify

const router = useRouter()
const { login } = useAuth()
const toast = useToast()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleLogin = async () => {
  if (!email.value) {
    error.value = 'Email is required.'
    return
  }
  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  if (!password.value) {
    error.value = 'Password is required.'
    return
  }
  try {
    loading.value = true
    error.value = ''
    console.log('Attempting login with:', { email: email.value })

    // Get auth instance
    const auth = useAuth()
    
    // Attempt login
    const success = await auth.login(email.value, password.value)
    console.log('Login result:', success)
    
    if (!success) {
      console.log('Login failed, error:', auth.error.value)
      error.value = auth.error.value || 'Login failed'
      return
    }

    // Wait for next tick to ensure state is updated
    await nextTick()
    
    // Get user after state update
    const user = auth.user.value
    console.log('User after login:', JSON.stringify(user, null, 2))
    
    if (!user) {
      console.error('User object is null after login')
      error.value = 'Authentication failed: No user data available'
      return
    }

    console.log('User role is:', user.role)
    
    // Determine redirect path
    let redirectPath = '/dashboard/admin' // Default to admin dashboard
    
    switch(user.role) {
      case 'TRUCK_PROVIDER':
        redirectPath = '/dashboard/truck-provider'
        break
      case 'LOAD_PROVIDER':
        redirectPath = '/dashboard/load-provider'
        break
      case 'ADMIN':
      case 'SUPER_ADMIN':
        redirectPath = '/dashboard/admin'
        break
    }
    
    console.log('Redirecting to:', redirectPath)
    
    // Use navigateTo instead of router.push for better middleware handling
    await navigateTo(redirectPath)
    
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.message || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}

// Watch for error changes and show Vue Toastification toast
watch(error, (val) => {
  if (val) {
    toast.error(val, {
      timeout: 4000,
      position: 'top-right',
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
    error.value = ''
  }
})
</script>