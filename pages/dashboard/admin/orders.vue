<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
      <button 
        @click="fetchOrders" 
        class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center"
        :disabled="loading"
      >
        <ArrowPathIcon v-if="!loading" class="mr-2 h-5 w-5" />
        <span v-else class="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- Orders Filters -->
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
            placeholder="Search by order ID, load, truck, or provider info..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order Details</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load Info</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Truck Info</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Providers</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Payment</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">Order #{{ order.id.slice(0, 8) }}</div>
                  <div class="text-sm text-gray-500">Created: {{ formatDate(order.createdAt) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ order.loadName }}</div>
              <div class="text-sm text-gray-500">
                From: {{ order.pickupLocation }}<br/>
                To: {{ order.deliveryLocation }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ order.truckName }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                <div class="mb-1">
                  <span class="font-medium">Load Provider:</span> {{ order.loadProviderName }}
                  <div class="text-xs text-gray-500">{{ order.loadProviderEmail || 'No email' }}</div>
                </div>
                <div>
                  <span class="font-medium">Truck Provider:</span> {{ order.truckProviderName }}
                  <div class="text-xs text-gray-500">{{ order.truckProviderEmail || 'No email' }}</div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusBadgeClass(order.status)">
                {{ formatOrderStatus(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ formatCurrency(order.amount) }}</div>
              <div class="text-sm text-gray-500">{{ order.paymentStatus }}</div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button 
                  @click="openOrderDetails(order)" 
                  class="rounded bg-white p-1 text-gray-400 hover:text-blue-600" 
                  title="View Details"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
              No orders found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ totalItems }} orders
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

    <!-- View Details Modal -->
    <Teleport to="body">
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDetailsModal = false"></div>

          <!-- Modal panel -->
          <div class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    Order Details: #{{ selectedOrder?.id.slice(0, 8) }}
                  </h3>
                  
                  <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Order Information -->
                    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 class="mb-2 font-medium text-gray-700">Order Information</h4>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">ID:</span> {{ selectedOrder?.id }}
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Created:</span> {{ formatDate(selectedOrder?.createdAt || '') }}
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Status:</span> 
                        <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium" :class="getStatusBadgeClass(selectedOrder?.status || '')">
                          {{ formatOrderStatus(selectedOrder?.status || '') }}
                        </span>
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Amount:</span> {{ formatCurrency(selectedOrder?.amount || 0) }}
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Payment Status:</span> {{ selectedOrder?.paymentStatus }}
                      </div>
                    </div>

                    <!-- Load Information -->
                    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 class="mb-2 font-medium text-gray-700">Load Information</h4>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Name:</span> {{ selectedOrder?.loadName }}
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Pickup:</span> {{ selectedOrder?.pickupLocation }}
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Delivery:</span> {{ selectedOrder?.deliveryLocation }}
                      </div>
                    </div>

                    <!-- Truck Information -->
                    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 class="mb-2 font-medium text-gray-700">Truck Information</h4>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Details:</span> {{ selectedOrder?.truckName }}
                      </div>
                    </div>

                    <!-- Provider Information -->
                    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 class="mb-2 font-medium text-gray-700">Provider Information</h4>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Load Provider:</span> {{ selectedOrder?.loadProviderName }}
                        <div class="text-xs text-gray-500">{{ selectedOrder?.loadProviderEmail }}</div>
                      </div>
                      <div class="mb-1 text-sm">
                        <span class="font-medium">Truck Provider:</span> {{ selectedOrder?.truckProviderName }}
                        <div class="text-xs text-gray-500">{{ selectedOrder?.truckProviderEmail }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button 
                type="button" 
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="showDetailsModal = false"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'
import type { Order, OrderStatus } from '~/types'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

interface OrderWithDetails extends Order {
  loadName: string
  truckName: string
  driverName: string
  loadProviderName: string
  loadProviderEmail?: string
  truckProviderName?: string
  truckProviderEmail?: string
}

// Pagination settings
const itemsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref('')
const filterStatus = ref<OrderStatus | ''>('')

// Orders data
const orders = ref<OrderWithDetails[]>([])
const loading = ref(true)

// Display range for pagination
const displayedRange = computed(() => {
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, totalItems.value)
  const end = Math.min(start + orders.value.length - 1, totalItems.value)
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

// Format order status
function formatOrderStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pending'
    case OrderStatus.ACCEPTED:
      return 'Accepted'
    case OrderStatus.IN_TRANSIT:
      return 'In Transit'
    case OrderStatus.DELIVERED:
      return 'Delivered'
    case OrderStatus.COMPLETED:
      return 'Completed'
    case OrderStatus.CANCELLED:
      return 'Cancelled'
    default:
      return status
  }
}

// Get status badge styling
function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800'
    case OrderStatus.ACCEPTED:
      return 'bg-blue-100 text-blue-800'
    case OrderStatus.IN_TRANSIT:
      return 'bg-purple-100 text-purple-800'
    case OrderStatus.DELIVERED:
    case OrderStatus.COMPLETED:
      return 'bg-green-100 text-green-800'
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format date
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

// Fetch orders
async function fetchOrders() {
  loading.value = true
  console.log('Starting fetchOrders function, current state:', { 
    currentPage: currentPage.value, 
    itemsPerPage, 
    searchQuery: searchQuery.value, 
    filterStatus: filterStatus.value 
  })
  
  try {
    console.log('Fetching admin orders...')
    // Check if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No auth token found in localStorage')
      return
    }
    
    console.log('Using token:', token.substring(0, 10) + '...')
    
    // Fetch orders from admin API
    const { data, error } = await useFetch('/api/admin/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      query: {
        page: currentPage.value,
        limit: itemsPerPage,
        search: searchQuery.value || undefined,
        status: filterStatus.value || undefined
      }
    })
    
    if (error.value) {
      console.error('API Error:', error.value)
      alert(`Error fetching orders: ${error.value?.message || 'Unknown error'}`)
      return
    }
    
    console.log('Admin orders response:', data.value)
    
    if (data.value && data.value.orders) {
      console.log('Processing orders from response:', data.value.orders.length)
      // Transform the data to match our UI structure
      orders.value = data.value.orders.map((order: any) => {
        console.log('Processing order:', order.id)
        return {
          id: order.id,
          createdAt: order.createdAt,
          loadName: order.load?.title || order.load?.name || 'Unknown Load',
          pickupLocation: order.load?.pickupLocation || 'Unknown',
          deliveryLocation: order.load?.deliveryLocation || 'Unknown',
          truckName: order.truck ? 
            `${order.truck.make || ''} ${order.truck.model || ''} (${order.truck.licensePlate || 'Unknown'})` : 
            'Unknown Truck',
          driverName: order.truckProvider ? 
            `${order.truckProvider.firstName} ${order.truckProvider.lastName}` : 
            'Unknown Driver',
          loadProviderName: order.loadProvider ? 
            `${order.loadProvider.firstName} ${order.loadProvider.lastName}` : 
            'Unknown Load Provider',
          loadProviderEmail: order.loadProvider?.email,
          truckProviderName: order.truckProvider ? 
            `${order.truckProvider.firstName} ${order.truckProvider.lastName}` : 
            'Unknown Truck Provider',
          truckProviderEmail: order.truckProvider?.email,
          status: order.status,
          amount: order.price || order.amount || 0,
          paymentStatus: order.payments && order.payments.length > 0 
            ? order.payments[0].status 
            : 'PENDING'
        }
      })
      
      console.log('Transformed orders:', orders.value)
      
      // Update pagination data
      if (data.value.pagination) {
        totalPages.value = data.value.pagination.totalPages || 1
        totalItems.value = data.value.pagination.total || 0
        console.log('Updated pagination:', { totalPages: totalPages.value, totalItems: totalItems.value })
      }
    } else {
      console.warn('No orders found in response')
      orders.value = []
      totalPages.value = 1
      totalItems.value = 0
    }
  } catch (error: any) {
    console.error('Exception fetching orders:', error)
    alert(`Error: ${error.message || 'Unknown error occurred'}`)
    orders.value = []
  } finally {
    loading.value = false
    console.log('Finished fetchOrders function, final state:', { 
      orderCount: orders.value.length, 
      totalPages: totalPages.value, 
      totalItems: totalItems.value,
      loading: loading.value
    })
  }
}

// Watch for changes in filters and pagination
watch([searchQuery, filterStatus, currentPage], async () => {
  loading.value = true
  try {
    // Reset to first page when filters change
    if (searchQuery.value || filterStatus.value) {
      currentPage.value = 1
    }
    
    // Fetch orders from API with updated filters
    await fetchOrders()
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
})

// Initial fetch
onMounted(() => {
  fetchOrders()
})

// States for modal
const showDetailsModal = ref(false)
const selectedOrder = ref<OrderWithDetails | null>(null)

// Open order details modal
function openOrderDetails(order: OrderWithDetails) {
  selectedOrder.value = order
  showDetailsModal.value = true
}
</script> 