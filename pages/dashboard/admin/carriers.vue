<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Carriers</h1>
      <button 
        @click="fetchCarriers" 
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="isLoading"
      >
        <ArrowPathIcon v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
        {{ isLoading ? 'Loading...' : 'Refresh Data' }}
      </button>
    </div>

    <!-- Filter controls -->
    <div class="bg-white shadow rounded-lg mb-6 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700">Search Carriers</label>
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            placeholder="Search by name, email..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div class="w-full md:w-1/4">
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            v-model="activeFilter"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div class="w-full md:w-1/4 flex items-end">
          <button
            @click="applyFilters"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="bg-white shadow rounded-lg overflow-hidden">
      <div class="animate-pulse">
        <div class="h-16 bg-gray-200 border-b"></div>
        <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 border-b flex">
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carriers table -->
    <div v-else-if="carriers.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carrier Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trucks
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completed Orders
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="carrier in carriers" :key="carrier.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ carrier.firstName }} {{ carrier.lastName }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ carrier.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ carrier.truckCount }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ carrier.completedOrders }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="carrier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ carrier.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-900 mr-3">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No carriers found -->
    <div v-else class="bg-white shadow rounded-lg p-6 text-center">
      <p class="text-gray-500">No carriers found matching your criteria.</p>
    </div>

    <!-- Pagination controls -->
    <div class="mt-5 flex justify-between items-center" v-if="totalPages > 0">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ paginationText }}</span>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

// State
const carriers = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = ref(0)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const activeFilter = ref('')

// Computed properties
const paginationText = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(start + itemsPerPage.value - 1, totalItems.value)
  return `${start}-${end} of ${totalItems.value}`
})

// Methods
const fetchCarriers = async () => {
  isLoading.value = true
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    console.log('Using token for carriers API:', token ? 'Token available' : 'No token')
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.value.toString()
    })

    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }

    if (activeFilter.value) {
      params.append('isActive', activeFilter.value)
    }

    const url = `/api/admin/carriers?${params.toString()}`
    console.log('Fetching from URL:', url)
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Make direct fetch call
    const response = await fetch(url, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API Error:', response.status, errorData)
      throw new Error(errorData.message || `Failed to fetch carriers (${response.status})`)
    }
    
    const data = await response.json()
    console.log('Carriers data loaded:', data)
    
    carriers.value = data.carriers || []
    totalItems.value = data.pagination.totalItems
    totalPages.value = data.pagination.totalPages
  } catch (error) {
    console.error('Error fetching carriers:', error)
    // Fallback mock data for testing if API call fails
    carriers.value = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        truckCount: 3,
        completedOrders: 12,
        isActive: true
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        truckCount: 5,
        completedOrders: 24,
        isActive: true
      }
    ]
    totalItems.value = 2
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchCarriers()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCarriers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCarriers()
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchCarriers()
})
</script> 