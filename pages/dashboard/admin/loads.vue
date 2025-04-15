<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Load Management</h1>
      <button class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
        Add New Load
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>You may need to log in again to access the data.</p>
          </div>
          <div class="mt-4">
            <div class="-mx-2 -my-1.5 flex">
              <NuxtLink to="/auth/login" class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100">
                Go to login
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      <p class="mt-2 text-sm text-gray-600">Loading loads...</p>
    </div>

    <!-- Loads Filters -->
    <div v-if="!loading && !error" class="mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search loads by title, origin, destination..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loads Table -->
    <div class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load Information</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Provider</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="load in filteredLoads" :key="load.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <TruckIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ load.title }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(load.pickupDate) }}</div>
                  <div class="text-xs text-gray-500">ID: {{ load.id.slice(0, 8) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                <div class="flex items-center">
                  <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                  <span>{{ load.origin }}</span>
                </div>
                <div class="flex items-center mt-1">
                  <ArrowLongRightIcon class="h-4 w-4 text-gray-400 mx-1" />
                </div>
                <div class="flex items-center mt-1">
                  <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                  <span>{{ load.destination }}</span>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ load.price.toFixed(2) }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusBadgeClass(load.status)">
                {{ formatStatus(load.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div class="text-sm">{{ load.providerName }}</div>
              <div class="text-xs text-gray-400">{{ load.providerEmail }}</div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button class="rounded bg-white p-1 text-gray-400 hover:text-blue-600">
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button class="rounded bg-white p-1 text-gray-400 hover:text-green-600">
                  <PencilIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredLoads.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No loads found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ loads.length }} loads
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  MagnifyingGlassIcon,
  TruckIcon,
  MapPinIcon,
  ArrowLongRightIcon,
  EyeIcon,
  PencilIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

interface Load {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  price: number;
  status: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
}

// Pagination settings
const itemsPerPage = 10
const currentPage = ref(1)
const searchQuery = ref('')
const filterStatus = ref('')

// Loads data
const loads = ref<Load[]>([])
const loading = ref(true)
const error = ref('')

// Filter loads based on search and status filter
const filteredLoads = computed(() => {
  let result = loads.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(load => 
      load.title.toLowerCase().includes(query) || 
      load.origin.toLowerCase().includes(query) || 
      load.destination.toLowerCase().includes(query) ||
      load.providerName.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    result = result.filter(load => load.status === filterStatus.value)
  }

  // Return paginated result
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages
const totalPages = ref(1)

// Display range for pagination
const displayedRange = computed(() => {
  const filteredCount = loads.value.length
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, filteredCount)
  const end = Math.min(start + filteredLoads.value.length - 1, filteredCount)
  
  return `${start}-${end}`
})

// Pagination methods
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format status for display
function formatStatus(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'ASSIGNED':
      return 'Assigned'
    case 'IN_TRANSIT':
      return 'In Transit'
    case 'DELIVERED':
      return 'Delivered'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return status
  }
}

// Get status badge styling
function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_TRANSIT':
      return 'bg-purple-100 text-purple-800'
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Fetch loads
async function fetchLoads() {
  loading.value = true
  error.value = ''
  
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    console.log('Using token for loads API:', token ? 'Token available' : 'No token')
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    if (filterStatus.value) {
      params.append('status', filterStatus.value)
    }
    
    const url = `/api/admin/loads?${params.toString()}`
    console.log('Fetching from URL:', url)
    
    // Prepare headers
    const headers: HeadersInit = {
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
      error.value = errorData.message || `Failed to load data (${response.status})`
      return
    }
    
    const data = await response.json()
    console.log('Received loads data:', data)
    
    if (data && data.loads) {
      // Transform the data to match the expected format
      loads.value = data.loads.map(load => ({
        id: load.id,
        title: load.title,
        description: load.description || '',
        origin: load.pickupLocation,
        destination: load.deliveryLocation,
        price: load.price || 0,
        status: load.isAvailable ? 'Active' : 'Assigned',
        providerName: load.providerName || 'Unknown Provider',
        createdAt: load.createdAt
      }))
      
      // Update total pages based on API response
      if (data.pagination) {
        totalPages.value = data.pagination.totalPages
      }
    }
  } catch (err: any) {
    console.error('Error fetching loads:', err)
    error.value = err.message || 'An error occurred while loading data'
  } finally {
    loading.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchLoads()
})

// Watch for changes in filters and pagination
watch([searchQuery, filterStatus, currentPage], () => {
  // Reset to first page when filters change
  if ((searchQuery.value || filterStatus.value) && currentPage.value !== 1) {
    currentPage.value = 1
    return // The watch will trigger again with the updated page
  }
  
  fetchLoads()
})
</script> 