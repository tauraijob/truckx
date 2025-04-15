<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">API Test Page</h1>
    
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">Test Admin Orders API</h2>
      <button 
        @click="testOrdersApi" 
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Testing...' : 'Test Orders API' }}
      </button>
      
      <div v-if="apiResult" class="mt-4">
        <h3 class="font-medium text-lg mb-2">API Response:</h3>
        <pre class="bg-gray-100 p-4 rounded overflow-auto max-h-60">{{ JSON.stringify(apiResult, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-800 rounded">
        <p class="font-bold">Error:</p>
        <p>{{ error }}</p>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Auth Info</h2>
      <div v-if="user" class="space-y-2">
        <p><span class="font-medium">User ID:</span> {{ user.id }}</p>
        <p><span class="font-medium">Name:</span> {{ user.firstName }} {{ user.lastName }}</p>
        <p><span class="font-medium">Email:</span> {{ user.email }}</p>
        <p><span class="font-medium">Role:</span> {{ user.role }}</p>
      </div>
      <div v-else class="text-red-600">
        Not authenticated
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

const { user } = useAuth()
const loading = ref(false)
const apiResult = ref(null)
const error = ref(null)

async function testOrdersApi() {
  loading.value = true
  error.value = null
  apiResult.value = null
  
  try {
    console.log('Testing admin orders API...')
    const token = localStorage.getItem('token')
    
    if (!token) {
      error.value = 'No token found in localStorage'
      return
    }
    
    const { data, error: fetchError } = await useFetch('/api/admin/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: {
        page: 1,
        limit: 5
      }
    })
    
    if (fetchError.value) {
      console.error('API Error:', fetchError.value)
      error.value = `API Error: ${fetchError.value.message || 'Unknown error'}`
      return
    }
    
    console.log('API Response:', data.value)
    apiResult.value = data.value
  } catch (err) {
    console.error('Exception:', err)
    error.value = `Exception: ${err.message || 'Unknown error occurred'}`
  } finally {
    loading.value = false
  }
}
</script> 