<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Truck Management</h1>
      <div class="flex space-x-2">
        <button @click="fetchTrucks" class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center" :disabled="loading">
          <ArrowPathIcon v-if="!loading" class="mr-2 h-5 w-5" />
          <span v-else class="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
        <button class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
          Add New Truck
        </button>
      </div>
    </div>

    <!-- Trucks Filters -->
    <div class="mb-6 flex flex-wrap items-center gap-4">
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
            placeholder="Search trucks by ID, model, or location..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <select
          v-model="filterAvailability"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Availability</option>
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
      <div>
        <select
          v-model="filterType"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          <option value="FLATBED">Flatbed</option>
          <option value="REFRIGERATED">Refrigerated</option>
          <option value="DRY_VAN">Dry Van</option>
          <option value="STEP_DECK">Step Deck</option>
          <option value="TANKER">Tanker</option>
        </select>
      </div>
    </div>

    <!-- Trucks Table -->
    <div class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Truck Information</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type & Capacity</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Provider</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="truck in filteredTrucks" :key="truck.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                    <TruckIcon class="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ truck.make }} {{ truck.model }}</div>
                  <div class="text-sm text-gray-500">{{ truck.registrationNumber }}</div>
                  <div class="text-xs text-gray-500">ID: {{ truck.id.slice(0, 8) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ formatTruckType(truck.type) }}</div>
              <div class="text-sm text-gray-500">
                <span class="mr-2">{{ truck.capacityTons }} tons</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center text-sm text-gray-900">
                <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                <span>{{ truck.currentLocation }}</span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span v-if="truck.hasActiveOrder" class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getOrderStatusClass(truck.activeOrderStatus)">
                {{ formatOrderStatus(truck.activeOrderStatus) }}
                <span v-if="truck.activeLoadInfo" class="ml-1">- {{ truck.activeLoadInfo.title }}</span>
              </span>
              <span v-else class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusBadgeClass(truck.status)">
                {{ formatTruckStatus(truck.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div class="text-sm">{{ truck.providerName }}</div>
              <div class="text-xs text-gray-400">{{ truck.providerEmail }}</div>
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
          <tr v-if="filteredTrucks.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No trucks found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ totalCount }} trucks
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
  EyeIcon,
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

// Truck interface
interface Truck {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  type: string;
  capacityTons: number;
  year: number;
  currentLocation: string;
  status: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
  hasActiveOrder: boolean;
  activeOrderStatus: string;
  activeLoadInfo: {
    id: string;
    title: string;
  } | null;
}

// Pagination settings
const itemsPerPage = 10
const currentPage = ref(1)
const searchQuery = ref('')
const filterAvailability = ref('')
const filterType = ref('')

// Trucks data
const trucks = ref<Truck[]>([])
const loading = ref(true)
const totalCount = ref(0)
const totalPages = ref(1)

// Filter trucks based on search and filter selections
const filteredTrucks = computed(() => {
  let result = trucks.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(truck => 
      truck.make.toLowerCase().includes(query) || 
      truck.model.toLowerCase().includes(query) || 
      truck.registrationNumber.toLowerCase().includes(query) ||
      truck.currentLocation.toLowerCase().includes(query) ||
      truck.providerName.toLowerCase().includes(query)
    )
  }

  // Filter by availability status
  if (filterAvailability.value) {
    result = result.filter(truck => truck.status === filterAvailability.value)
  }

  // Filter by truck type
  if (filterType.value) {
    result = result.filter(truck => truck.type === filterType.value)
  }

  // Return paginated result
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Display range for pagination
const displayedRange = computed(() => {
  if (totalCount.value === 0) return '0-0'
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, totalCount.value)
  const end = Math.min(start + trucks.value.length - 1, totalCount.value)
  
  return `${start}-${end}`
})

// Fetch trucks
onMounted(async () => {
  loading.value = true
  fetchTrucks()
})

// Watch for filter changes to update results
watch([searchQuery, filterAvailability, filterType, currentPage], () => {
  fetchTrucks()
})

// Fetch trucks from API
async function fetchTrucks() {
  try {
    loading.value = true
    console.log('Fetching trucks...', {
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchQuery.value,
      availability: filterAvailability.value,
      type: filterType.value
    })
    
    const { data, error } = await useFetch('/api/admin/trucks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      query: {
        page: currentPage.value,
        limit: itemsPerPage,
        search: searchQuery.value || undefined,
        availability: filterAvailability.value || undefined,
        type: filterType.value || undefined
      }
    })
    
    if (error.value) {
      console.error('Error fetching trucks:', error.value)
      return
    }
    
    console.log('Trucks API response:', data.value)
    
    if (data.value && Array.isArray(data.value.trucks)) {
      trucks.value = data.value.trucks.map((truck: any) => {
        // Determine status based on available data
        let status = 'UNKNOWN';
        
        if (truck.hasActiveOrder) {
          status = truck.activeOrderStatus || 'BUSY';
        } else if (truck.isAvailable !== undefined) {
          status = truck.isAvailable ? 'AVAILABLE' : 'BUSY';
        } else if (truck.specifications?.availability) {
          status = truck.specifications.availability;
        }
        
        return {
          id: truck.id,
          make: truck.make || 'N/A',
          model: truck.model || 'N/A',
          registrationNumber: truck.licensePlate || 'N/A',
          type: truck.specifications?.type || 'UNKNOWN',
          capacityTons: truck.capacity || 0,
          year: truck.year || new Date().getFullYear(),
          currentLocation: truck.specifications?.currentLocation || 'Unknown',
          status: status,
          providerId: truck.providerId,
          providerName: truck.provider ? `${truck.provider.firstName} ${truck.provider.lastName}` : 'Unknown',
          providerEmail: truck.provider ? truck.provider.email : 'unknown@example.com',
          createdAt: truck.createdAt,
          hasActiveOrder: truck.hasActiveOrder,
          activeOrderStatus: truck.activeOrderStatus,
          activeLoadInfo: truck.activeLoadInfo
        };
      });
      
      // Update pagination from API response
      if (data.value.pagination) {
        totalCount.value = data.value.pagination.total || 0
        totalPages.value = data.value.pagination.totalPages || 1
        currentPage.value = Math.min(currentPage.value, totalPages.value)
      }
    } else {
      trucks.value = []
      totalCount.value = 0
      totalPages.value = 1
    }
  } catch (error) {
    console.error('Exception fetching trucks:', error)
    trucks.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// Update pagination methods to fetch new data
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    // Fetch will be triggered by the watcher
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    // Fetch will be triggered by the watcher
  }
}

// Format truck type
function formatTruckType(type: string): string {
  switch (type) {
    case 'FLATBED':
      return 'Flatbed'
    case 'REFRIGERATED':
      return 'Refrigerated'
    case 'DRY_VAN':
      return 'Dry Van'
    case 'STEP_DECK':
      return 'Step Deck'
    case 'TANKER':
      return 'Tanker'
    default:
      return type
  }
}

// Format truck status
function formatTruckStatus(status: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'Available'
    case 'BUSY':
      return 'Busy'
    case 'MAINTENANCE':
      return 'Maintenance'
    case 'INACTIVE':
      return 'Inactive'
    default:
      return status
  }
}

// Get status badge styling
function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800'
    case 'BUSY':
      return 'bg-blue-100 text-blue-800'
    case 'MAINTENANCE':
      return 'bg-yellow-100 text-yellow-800'
    case 'INACTIVE':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get order status class
function getOrderStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_TRANSIT':
      return 'bg-purple-100 text-purple-800'
    case 'DELIVERED':
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format order status
function formatOrderStatus(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Order Pending'
    case 'ACCEPTED':
      return 'Order Accepted'
    case 'IN_TRANSIT':
      return 'In Transit'
    case 'DELIVERED':
    case 'COMPLETED':
      return 'Delivered'
    case 'CANCELLED':
      return 'Cancelled'
    case 'REJECTED':
      return 'Rejected'
    default:
      return status
  }
}
</script> 