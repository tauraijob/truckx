<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold text-gray-900">TruckX Admin Setup</h1>
        <p class="mt-2 text-gray-600">Create a default admin account</p>
      </div>
      
      <div v-if="loading" class="flex justify-center py-6">
        <div class="h-6 w-6 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        <span class="ml-2">Creating admin account...</span>
      </div>
      
      <div v-else-if="result" class="rounded-md p-4" :class="result.success ? 'bg-green-50' : 'bg-yellow-50'">
        <div class="flex">
          <div class="flex-shrink-0" v-if="result.success">
            <CheckCircleIcon class="h-5 w-5 text-green-500" />
          </div>
          <div class="flex-shrink-0" v-else>
            <InformationCircleIcon class="h-5 w-5 text-yellow-500" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium" :class="result.success ? 'text-green-800' : 'text-yellow-800'">
              {{ result.message }}
            </h3>
            <div class="mt-2 text-sm" :class="result.success ? 'text-green-700' : 'text-yellow-700'">
              <p>Email: {{ result.user.email }}</p>
              <p>Role: {{ result.user.role }}</p>
              <p v-if="result.success">Password: Admin@123</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-6">
        <p class="text-sm text-gray-600">
          This will create a default admin account with the following credentials:
        </p>
        <div class="rounded-md bg-gray-50 p-4">
          <p><span class="font-medium">Email:</span> admin@truckx.com</p>
          <p><span class="font-medium">Password:</span> Admin@123</p>
          <p><span class="font-medium">Role:</span> ADMIN</p>
        </div>
        <button
          @click="createAdmin"
          class="w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Create Admin Account
        </button>
      </div>
      
      <div class="mt-6 text-center">
        <NuxtLink to="/auth/login" class="text-sm text-primary-600 hover:text-primary-500">
          Return to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const loading = ref(false)
const result = ref(null)

async function createAdmin() {
  loading.value = true
  try {
    const { data } = await useFetch('/api/admin/create', {
      method: 'POST'
    })
    result.value = data.value
  } catch (error) {
    console.error('Error creating admin:', error)
    result.value = {
      success: false,
      message: 'Error creating admin account',
      user: { email: 'admin@truckx.com', role: 'ADMIN' }
    }
  } finally {
    loading.value = false
  }
}
</script> 