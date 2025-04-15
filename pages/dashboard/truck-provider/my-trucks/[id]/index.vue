<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ truck.make }} {{ truck.model }}</h1>
          <p class="mt-1 text-sm text-gray-600">{{ truck.name || `${truck.year} ${truck.make} ${truck.model}` }}</p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon class="mr-2 h-4 w-4" />
            Back
          </button>
          <button
            @click="goToEdit"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <PencilIcon class="mr-2 h-4 w-4" />
            Edit Truck
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-500 font-medium mb-2">{{ error }}</div>
        <button
          @click="goBack"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Truck Images and Status -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <!-- Image Gallery -->
            <div class="p-6 border-b border-gray-200">
              <TruckImageGallery 
                :images="truck.images" 
                :alt="`${truck.make} ${truck.model} ${truck.year}`"
              />
            </div>
            
            <!-- Availability Status -->
            <div class="px-6 py-4 flex justify-between items-center">
              <div class="flex items-center">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="truck.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ truck.isAvailable ? 'Available' : 'Not Available' }}
                </span>
                <button 
                  @click="toggleAvailability"
                  class="ml-4 text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  {{ truck.isAvailable ? 'Mark as Unavailable' : 'Mark as Available' }}
                </button>
              </div>
              <span class="text-sm text-gray-500">
                License Plate: {{ truck.licensePlate }}
              </span>
            </div>
          </div>
          
          <!-- Specifications -->
          <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Truck Specifications</h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Make</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ truck.make }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Model</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ truck.model }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Year</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ truck.year }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Type</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ truck.type || 'Standard' }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Capacity</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ truck.capacity }} tons</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Current Location</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ truck.currentLocation || 'Not specified' }}</dd>
                </div>
                
                <template v-if="truck.specifications">
                  <div v-if="truck.specifications.engineType" class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Engine Type</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ truck.specifications.engineType }}</dd>
                  </div>
                  <div v-if="truck.specifications.transmission" class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Transmission</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ truck.specifications.transmission }}</dd>
                  </div>
                  <div v-if="truck.specifications.fuelType" class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Fuel Type</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ truck.specifications.fuelType }}</dd>
                  </div>
                  <div v-if="truck.specifications.mileage" class="sm:col-span-1">
                    <dt class="text-sm font-medium text-gray-500">Mileage</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ truck.specifications.mileage.toLocaleString() }} miles</dd>
                  </div>
                  <div v-if="truck.specifications.additionalInfo" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500">Additional Information</dt>
                    <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ truck.specifications.additionalInfo }}</dd>
                  </div>
                </template>
              </dl>
            </div>
          </div>
        </div>
        
        <!-- Recent Orders and Actions -->
        <div class="lg:col-span-1">
          <!-- Quick Actions -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div class="px-4 py-5 sm:p-6 space-y-4">
              <button 
                @click="goToEdit"
                class="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <PencilIcon class="mr-2 h-4 w-4" />
                Edit Truck Details
              </button>
              <button 
                @click="toggleAvailability"
                class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TagIcon class="mr-2 h-4 w-4" />
                {{ truck.isAvailable ? 'Mark as Unavailable' : 'Mark as Available' }}
              </button>
              <button 
                @click="confirmDelete"
                class="w-full flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon class="mr-2 h-4 w-4" />
                Delete Truck
              </button>
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div v-if="loadingOrders" class="py-10 text-center">
                <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                <p class="mt-2 text-sm text-gray-600">Loading recent orders...</p>
              </div>
              <div v-else-if="!recentOrders || recentOrders.length === 0" class="text-center py-10">
                <ClipboardDocumentCheckIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No recent orders</h3>
                <p class="mt-1 text-sm text-gray-500">This truck hasn't been assigned to any loads yet.</p>
              </div>
              <div v-else>
                <ul role="list" class="divide-y divide-gray-200">
                  <li v-for="order in recentOrders" :key="order.id" class="py-4">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center justify-center h-8 w-8 rounded-full" :class="getStatusClass(order.status)">
                          <StatusIcon :status="order.status" class="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ order.load.title }}
                        </p>
                        <p class="text-sm text-gray-500 truncate">
                          {{ formatDate(order.createdAt) }} · {{ order.status }}
                        </p>
                      </div>
                      <div>
                        <NuxtLink :to="`/dashboard/truck-provider/orders/${order.id}`" class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                          View
                        </NuxtLink>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="mt-6 text-center">
                  <NuxtLink to="/dashboard/truck-provider/orders" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View All Orders
                    <ArrowRightIcon class="ml-2 h-4 w-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Truck</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete this truck? This action cannot be undone.
                  All data associated with this truck will be permanently removed.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteTruck"
            >
              Delete
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TagIcon, 
  TrashIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'
import TruckImageGallery from '~/components/TruckImageGallery.vue'

const router = useRouter()
const route = useRoute()
const truckId = route.params.id as string

// Data
const truck = ref<any>({
  name: '',
  make: '',
  model: '',
  year: 0,
  type: '',
  capacity: 0,
  licensePlate: '',
  currentLocation: '',
  isAvailable: true,
  images: [],
  specifications: {}
})

const recentOrders = ref<any[]>([])
const isLoading = ref(true)
const loadingOrders = ref(true)
const error = ref<string | null>(null)
const showDeleteModal = ref(false)

// Fetch truck data
onMounted(async () => {
  try {
    const response = await $fetch(`/api/trucks/${truckId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    truck.value = response.truck
    fetchRecentOrders()
  } catch (err: any) {
    console.error('Error loading truck:', err)
    error.value = err.response?._data?.message || 'Failed to load truck data'
  } finally {
    isLoading.value = false
  }
})

// Fetch recent orders for this truck
const fetchRecentOrders = async () => {
  loadingOrders.value = true
  
  try {
    const response = await $fetch(`/api/truck-provider/trucks/${truckId}/orders?limit=3`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    recentOrders.value = response.orders || []
  } catch (error) {
    console.error('Error fetching recent orders:', error)
  } finally {
    loadingOrders.value = false
  }
}

// Toggle truck availability
const toggleAvailability = async () => {
  try {
    const response = await $fetch(`/api/trucks/${truckId}`, {
      method: 'PUT',
      body: {
        isAvailable: !truck.value.isAvailable
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    truck.value = response.truck
  } catch (error) {
    console.error('Error toggling availability:', error)
    alert('Failed to update truck availability')
  }
}

// Delete truck
const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteTruck = async () => {
  try {
    await $fetch(`/api/trucks/${truckId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    router.push('/dashboard/truck-provider/my-trucks')
  } catch (error) {
    console.error('Error deleting truck:', error)
    alert('Failed to delete truck')
  } finally {
    showDeleteModal.value = false
  }
}

// Navigation
const goBack = () => {
  router.back()
}

const goToEdit = () => {
  router.push(`/dashboard/truck-provider/my-trucks/${truckId}/edit`)
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  })
}

// Get status class for order
const getStatusClass = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500'
    case 'IN_TRANSIT':
      return 'bg-blue-500'
    case 'ACCEPTED':
      return 'bg-indigo-500'
    case 'PENDING':
      return 'bg-yellow-500'
    case 'CANCELLED':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

// Status icon component
const StatusIcon = (props: { status: string }) => {
  switch (props.status) {
    case 'COMPLETED':
      return h(CheckCircleIcon)
    case 'IN_TRANSIT':
      return h(TruckIcon)
    case 'ACCEPTED':
      return h(CheckCircleIcon)
    case 'PENDING':
      return h(ClockIcon)
    case 'CANCELLED':
      return h(XCircleIcon)
    default:
      return h(ClockIcon)
  }
}

definePageMeta({
  layout: 'truck-provider-dashboard',
  middleware: ['auth']
})
</script> 