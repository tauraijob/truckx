<template>
  <div>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Truck Details</h1>
            <p class="mt-1 text-sm text-gray-500">View and manage your truck details.</p>
          </div>
          <div class="flex space-x-2">
            <NuxtLink :to="`/dashboard/truck-provider/my-trucks/${truckId}/edit`" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Truck
            </NuxtLink>
            <NuxtLink to="/dashboard/truck-provider/my-trucks" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to My Trucks
            </NuxtLink>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="bg-white shadow rounded-lg p-8">
          <div class="animate-pulse space-y-6">
            <div class="h-60 bg-gray-200 rounded-lg"></div>
            <div class="space-y-4">
              <div class="h-6 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="h-12 bg-gray-200 rounded"></div>
              <div class="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-white shadow rounded-lg p-8">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-red-800">Error loading truck details</h3>
            <p class="mt-2 text-gray-600">{{ error }}</p>
            <button @click="fetchTruck" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0070f3] hover:bg-[#0060df] focus:outline-none">
              Try Again
            </button>
          </div>
        </div>

        <!-- Truck details -->
        <div v-else-if="truck" class="bg-white shadow rounded-lg overflow-hidden">
          <!-- Image Gallery -->
          <div class="p-6">
            <TruckImageGallery :images="truck.images || []" :alt="truck.name || `${truck.make} ${truck.model}`" />
          </div>

          <!-- Truck Information -->
          <div class="border-t border-gray-200 px-6 py-5">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ truck.name || `${truck.make} ${truck.model}` }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">General Information</h3>
                
                <dl class="grid grid-cols-1 gap-y-3">
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Make</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.make }}</dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Model</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.model }}</dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Year</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.year }}</dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Type</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.type || 'Not specified' }}</dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Capacity</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.capacity }} tons</dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">License Plate</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.licensePlate }}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Status & Location</h3>
                
                <dl class="grid grid-cols-1 gap-y-3">
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">
                      <span class="px-2 py-1 text-xs font-medium rounded-full" 
                        :class="truck.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                        {{ truck.isAvailable ? 'Available' : 'Not Available' }}
                      </span>
                    </dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Current Location</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ truck.currentLocation || 'Not specified' }}</dd>
                  </div>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Added On</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(truck.createdAt) }}</dd>
                  </div>
                </dl>
                
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mt-6 mb-3">Actions</h3>
                <div class="flex flex-col space-y-2">
                  <button @click="toggleAvailability" :disabled="isUpdating"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none"
                    :class="truck.isAvailable ? 
                      'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100' : 
                      'border-green-300 bg-green-50 text-green-800 hover:bg-green-100'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {{ truck.isAvailable ? 'Mark as Unavailable' : 'Mark as Available' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No truck found -->
        <div v-else class="bg-white shadow rounded-lg p-8">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No truck found</h3>
            <p class="mt-2 text-gray-600">We couldn't find the truck you're looking for.</p>
            <NuxtLink to="/dashboard/truck-provider/my-trucks" 
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0070f3] hover:bg-[#0060df] focus:outline-none">
              Back to My Trucks
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TruckImageGallery from '~/components/TruckImageGallery.vue'

const route = useRoute()
const truckId = route.params.id

const truck = ref(null)
const loading = ref(true)
const error = ref(null)
const isUpdating = ref(false)

onMounted(() => {
  fetchTruck()
})

// Fetch truck details
async function fetchTruck() {
  loading.value = true
  error.value = null
  
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`/api/trucks/${truckId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch truck details')
    }
    
    const data = await response.json()
    truck.value = data.truck
    
    // Make sure images array exists
    if (!truck.value.images) {
      truck.value.images = ['/images/truckx-slide.webp']
    }
  } catch (err) {
    console.error('Error fetching truck:', err)
    error.value = err.message || 'Failed to load truck details'
  } finally {
    loading.value = false
  }
}

// Toggle truck availability
async function toggleAvailability() {
  if (isUpdating.value) return
  
  isUpdating.value = true
  
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`/api/trucks/${truckId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        isAvailable: !truck.value.isAvailable
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update truck availability')
    }
    
    // Update local state
    truck.value.isAvailable = !truck.value.isAvailable
  } catch (err) {
    console.error('Error updating truck availability:', err)
    alert(`Failed to update availability: ${err.message}`)
  } finally {
    isUpdating.value = false
  }
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 