<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
      <button 
        @click="fetchOrders"
        class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        :disabled="loading"
      >
        <ArrowPathIcon v-if="!loading" class="mr-2 h-5 w-5" />
        <div v-else class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        {{ loading ? 'Loading...' : 'Refresh Orders' }}
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
            placeholder="Search orders..."
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
          <option value="ACCEPTED">Accepted</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      <div>
        <select
          v-model="sortBy"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="price-asc">Price (Low to High)</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order Details</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load Information</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Truck</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <ClipboardDocumentCheckIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">Order #{{ order.id.slice(0, 8) }}</div>
                  <div class="text-xs text-gray-500">Created: {{ formatDate(order.createdAt) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ order.loadName }}</div>
              <div class="text-xs text-gray-500">
                <div class="flex items-center text-xs text-gray-500">
                  <MapPinIcon class="mr-1 h-3 w-3 text-gray-400" />
                  {{ order.origin }} → {{ order.destination }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div class="text-sm text-gray-900">{{ order.truckName }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">${{ order.price.toFixed(2) }}</div>
              <div class="text-xs text-gray-500">
                <span v-if="order.status === 'DELIVERED'">
                  Earnings: ${{ calculateEarnings(order.price).toFixed(2) }}
                </span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusClass(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button 
                  @click="openOrderDetails(order)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-blue-600"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="order.status === 'PENDING'"
                  @click="openUpdateStatusModal(order, 'ACCEPTED')"
                  class="rounded bg-white p-1 text-gray-400 hover:text-green-600"
                  title="Accept Order"
                >
                  <CheckIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="order.status === 'PENDING'"
                  @click="openRejectModal(order)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-red-600"
                  title="Reject Order"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="order.status === 'ACCEPTED'"
                  @click="openUpdateStatusModal(order, 'IN_TRANSIT')"
                  class="rounded bg-white p-1 text-gray-400 hover:text-purple-600"
                  title="Mark as In Transit"
                >
                  <TruckIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="order.status === 'IN_TRANSIT'"
                  @click="openUpdateStatusModal(order, 'DELIVERED')"
                  class="rounded bg-white p-1 text-gray-400 hover:text-green-600"
                  title="Mark as Delivered"
                >
                  <CheckBadgeIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No orders found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ orders.length }} orders
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

    <!-- Order Details Modal -->
    <div v-if="showOrderDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Order Details</h3>
        </div>
        <div v-if="selectedOrder" class="p-6 space-y-6">
          <!-- Order Info -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-2">Order Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Order ID</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Created</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedOrder.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium" :class="getStatusClass(selectedOrder.status)">
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Price</p>
                <p class="text-sm font-medium text-gray-900">${{ selectedOrder.price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Load Info -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-2">Load Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Load Name</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.loadName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Load Provider</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.loadProviderName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Origin</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.origin }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Destination</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.destination }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Pickup Date</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedOrder.pickupDate) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Delivery Date</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedOrder.deliveryDate) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Truck Info -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-2">Truck Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Truck</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.truckName }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end">
          <button 
            @click="showOrderDetailsModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div v-if="showUpdateStatusModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Update Order Status</h3>
        </div>
        <div v-if="selectedOrder" class="p-6">
          <p class="mb-4 text-sm text-gray-500">
            Are you sure you want to update the status of order #{{ selectedOrder.id.slice(0, 8) }} to <span class="font-medium">{{ formatStatus(newStatus) }}</span>?
          </p>
          
          <div v-if="newStatus === 'IN_TRANSIT'" class="mb-4">
            <label for="pickupNotes" class="block text-sm font-medium text-gray-700">Pickup Notes</label>
            <textarea
              id="pickupNotes"
              v-model="statusNotes"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Add any notes about the pickup"
            ></textarea>
          </div>
          
          <div v-if="newStatus === 'DELIVERED'" class="mb-4">
            <label for="deliveryNotes" class="block text-sm font-medium text-gray-700">Delivery Notes</label>
            <textarea
              id="deliveryNotes"
              v-model="statusNotes"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Add any notes about the delivery"
            ></textarea>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showUpdateStatusModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="updateOrderStatus"
            class="rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Order Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Reject Order</h3>
        </div>
        <div v-if="selectedOrder" class="p-6">
          <p class="mb-4 text-sm text-gray-500">
            Are you sure you want to reject order #{{ selectedOrder.id.slice(0, 8) }}? This action cannot be undone.
          </p>
          
          <div class="mb-4">
            <label for="rejectionReason" class="block text-sm font-medium text-gray-700">Reason for Rejection</label>
            <textarea
              id="rejectionReason"
              v-model="rejectionReason"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Please provide a reason for rejection"
            ></textarea>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showRejectModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="rejectOrder"
            class="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            Reject Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Order, OrderStatus } from '~/types'
import { 
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  MapPinIcon,
  TruckIcon,
  EyeIcon,
  CheckIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'truck-provider-dashboard',
  middleware: ['auth']
})

interface OrderWithDetails extends Order {
  loadName: string
  loadProviderName: string
  loadProviderId: string
  truckName: string
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
}

// Pagination and filters
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const filterStatus = ref<OrderStatus | ''>('')
const sortBy = ref('date-desc')

// Orders data
const orders = ref<OrderWithDetails[]>([])
const loading = ref(true)

// Modals and selected order
const showOrderDetailsModal = ref(false)
const showUpdateStatusModal = ref(false)
const showRejectModal = ref(false)
const selectedOrder = ref<OrderWithDetails | null>(null)
const newStatus = ref('')
const statusNotes = ref('')
const rejectionReason = ref('')

// Filter and sort orders
const filteredOrders = computed(() => {
  let result = orders.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.loadName.toLowerCase().includes(query) ||
      order.truckName.toLowerCase().includes(query) ||
      order.origin.toLowerCase().includes(query) ||
      order.destination.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filterStatus.value) {
    result = result.filter(order => order.status === filterStatus.value)
  }

  // Apply sorting
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'price-desc':
        return b.price - a.price
      case 'price-asc':
        return a.price - b.price
      default:
        return 0
    }
  })

  // Paginate results
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages
const totalPages = computed(() => {
  if (orders.value.length === 0) return 1
  
  // Get filtered count
  let filteredCount = getFilteredCount()
  
  return Math.ceil(filteredCount / itemsPerPage)
})

// Get filtered count for pagination
function getFilteredCount(): number {
  if (!searchQuery.value && !filterStatus.value) {
    return orders.value.length
  }
  
  return orders.value.filter(order => {
    const matchesSearch = !searchQuery.value || 
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.loadName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.truckName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.origin.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || order.status === filterStatus.value
    
    return matchesSearch && matchesStatus
  }).length
}

// Display range for pagination
const displayedRange = computed(() => {
  const filteredCount = getFilteredCount()
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, filteredCount)
  const end = Math.min(start + filteredOrders.value.length - 1, filteredCount)
  
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

// Format status
function formatStatus(status: OrderStatus): string {
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

// Get status badge class
function getStatusClass(status: OrderStatus): string {
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

// Calculate earnings (95% of price)
function calculateEarnings(price: number): number {
  return price * 0.95
}

// Modal functions
function openOrderDetails(order: OrderWithDetails) {
  selectedOrder.value = order
  showOrderDetailsModal.value = true
}

function openUpdateStatusModal(order: OrderWithDetails, status: OrderStatus) {
  selectedOrder.value = order
  newStatus.value = status
  statusNotes.value = ''
  showUpdateStatusModal.value = true
}

function openRejectModal(order: OrderWithDetails) {
  selectedOrder.value = order
  rejectionReason.value = ''
  showRejectModal.value = true
}

// Reject order
async function rejectOrder() {
  if (!selectedOrder.value) return
  
  try {
    console.log(`Rejecting order ${selectedOrder.value.id} with reason: ${rejectionReason.value}`)
    
    // Call the API to reject the order
    const { data, error: rejectError } = await useFetch(`/api/orders/${selectedOrder.value.id}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: { 
        reason: rejectionReason.value
      }
    })
    
    if (rejectError.value) {
      console.error('Error rejecting order:', rejectError.value)
      throw new Error(rejectError.value.message || 'Failed to reject order')
    }
    
    console.log('Order rejected successfully:', data.value)
    
    // Find and update the order in our local data
    const index = orders.value.findIndex(o => o.id === selectedOrder.value!.id)
    if (index !== -1) {
      orders.value[index].status = 'CANCELLED'
    }
    
    showRejectModal.value = false
    selectedOrder.value = null
    rejectionReason.value = ''
    
    // Show success message
    alert('Order rejected successfully')
  } catch (error) {
    console.error('Error rejecting order:', error)
    alert(`Error rejecting order: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Update order status
async function updateOrderStatus() {
  if (!selectedOrder.value) return
  
  try {
    console.log(`Updating order ${selectedOrder.value.id} status to ${newStatus.value}`)
    
    // Call the API to update the order status
    const { data, error: updateError } = await useFetch(`/api/orders/${selectedOrder.value.id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: { 
        status: newStatus.value,
        notes: statusNotes.value
      }
    })
    
    if (updateError.value) {
      console.error('Error updating order status:', updateError.value)
      throw new Error(updateError.value.message || 'Failed to update order status')
    }
    
    console.log('Order status updated successfully:', data.value)
    
    // Find and update the order in our local data
    const index = orders.value.findIndex(o => o.id === selectedOrder.value!.id)
    if (index !== -1) {
      orders.value[index].status = newStatus.value
    }
    
    showUpdateStatusModal.value = false
    selectedOrder.value = null
    newStatus.value = ''
    statusNotes.value = ''
    
    // Show success message
    alert('Order status updated successfully')
  } catch (error) {
    console.error('Error updating order status:', error)
    alert(`Error updating order status: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fetch orders
async function fetchOrders() {
  loading.value = true
  try {
    console.log('Fetching orders for truck provider...')
    
    // Fetch real data from API
    const { data, error: fetchError } = await useFetch('/api/orders', {
      query: {
        status: filterStatus.value || undefined,
        page: 1,
        limit: 50 // Get more at once for client-side filtering/sorting
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (fetchError.value) {
      console.error('API error response:', fetchError.value)
      throw new Error(fetchError.value.message || 'Failed to fetch orders')
    }
    
    console.log('API response for orders:', data.value)
    
    if (data.value?.orders) {
      console.log(`Found ${data.value.orders.length} orders from API`)
      
      // Transform the API response to match our local interface
      orders.value = data.value.orders.map((order: any) => {
        console.log('Processing order:', order.id, 'Status:', order.status)
        return {
          id: order.id,
          loadId: order.loadId,
          loadName: order.load?.title || 'Unknown Load',
          loadProviderName: `${order.loadProvider?.firstName || ''} ${order.loadProvider?.lastName || ''}`.trim() || 'Unknown Provider',
          loadProviderId: order.loadProviderId,
          truckId: order.truckId,
          truckName: order.truck ? `${order.truck.make} ${order.truck.model} - ${order.truck.licensePlate}` : 'Unknown Truck',
          origin: order.load?.pickupLocation || 'Unknown',
          destination: order.load?.deliveryLocation || 'Unknown',
          pickupDate: order.acceptedAt || order.createdAt,
          deliveryDate: order.completedAt || new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          price: order.price || 0,
          status: order.status,
          createdAt: order.createdAt
        }
      })
      
      console.log(`Mapped ${orders.value.length} orders for display`)
    } else {
      console.log('No orders found in API response')
      orders.value = []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    orders.value = [] // Ensure we clear any mock data
  } finally {
    loading.value = false
  }
}

// Fetch orders on component mount
onMounted(() => {
  fetchOrders()
})

// Add a watch for filter changes
watch([filterStatus, searchQuery, sortBy], () => {
  currentPage.value = 1
}, { deep: true })
</script> 