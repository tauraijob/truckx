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
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
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
          <option value="REJECTED">Rejected</option>
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Truck Provider</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load Information</th>
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
              <div class="text-sm font-medium text-gray-900">{{ order.truckProviderName }}</div>
              <div class="text-xs text-gray-500">{{ order.truckName }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ order.loadName }}</div>
              <div class="flex items-center text-xs text-gray-500">
                <MapPinIcon class="mr-1 h-3 w-3 text-gray-400" />
                {{ order.origin }} → {{ order.destination }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">${{ order.price.toFixed(2) }}</div>
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
                  title="View Details"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="order.status === 'PENDING'"
                  @click="openAcceptModal(order)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-green-600"
                  title="Accept Order"
                  :disabled="order.status !== 'PENDING' || actionLoading === order.id"
                >
                  <CheckIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="order.status === 'PENDING'"
                  @click="openCancelModal(order)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-red-600"
                  title="Cancel Order"
                  :disabled="order.status !== 'PENDING' || actionLoading === order.id"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="['ACCEPTED', 'IN_TRANSIT'].includes(order.status) && !order.paymentStatus"
                  @click="openPaymentModal(order)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-green-600"
                  title="Record Payment"
                >
                  <CurrencyDollarIcon class="h-5 w-5" />
                </button>
                <span 
                  v-if="order.paymentStatus === 'COMPLETED'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                >
                  Paid
                </span>
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
          
          <!-- Truck Provider Info -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-2">Truck Provider Information</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Provider Name</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedOrder.truckProviderName }}</p>
              </div>
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

    <!-- Cancel Order Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Cancel Order</h3>
        </div>
        <div v-if="selectedOrder" class="p-6">
          <p class="mb-4 text-sm text-gray-500">
            Are you sure you want to cancel order #{{ selectedOrder.id.slice(0, 8) }}? This action cannot be undone.
          </p>
          
          <div class="mb-4">
            <label for="cancellationReason" class="block text-sm font-medium text-gray-700">Reason for Cancellation</label>
            <textarea
              id="cancellationReason"
              v-model="cancellationReason"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Please provide a reason for cancellation"
            ></textarea>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showCancelModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Back
          </button>
          <button 
            @click="cancelOrder"
            class="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>

    <!-- Accept Order Modal -->
    <div v-if="showAcceptModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Accept Bid</h3>
        </div>
        <div v-if="selectedOrder" class="p-6">
          <p class="mb-4 text-sm text-gray-500">
            Are you sure you want to accept this bid from <span class="font-medium">{{ selectedOrder.truckProviderName }}</span>?
          </p>
          <div class="bg-gray-50 p-4 rounded-md mb-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Truck:</span>
              <span class="text-sm text-gray-900">{{ selectedOrder.truckName }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Price:</span>
              <span class="text-sm font-medium text-gray-900">${{ selectedOrder.price.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500">Load:</span>
              <span class="text-sm text-gray-900">{{ selectedOrder.loadName }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-500">
            Accepting this bid will create a contract between you and the truck provider. The truck provider will be notified.
          </p>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showAcceptModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="acceptOrder"
            class="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            Accept Bid
          </button>
        </div>
      </div>
    </div>

    <!-- Record Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Record Payment</h3>
        </div>
        <div v-if="selectedOrder" class="p-6">
          <p class="mb-4 text-sm text-gray-500">
            Record a payment for order #{{ selectedOrder.id.slice(0, 8) }} to {{ selectedOrder.truckProviderName }}.
          </p>
          
          <div class="bg-gray-50 p-4 rounded-md mb-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Load:</span>
              <span class="text-sm text-gray-900">{{ selectedOrder.loadName }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Truck Provider:</span>
              <span class="text-sm text-gray-900">{{ selectedOrder.truckProviderName }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-500">Truck:</span>
              <span class="text-sm text-gray-900">{{ selectedOrder.truckName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm font-medium text-gray-500">Amount Due:</span>
              <span class="text-sm font-medium text-gray-900">${{ selectedOrder.price.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="paymentAmount" class="block text-sm font-medium text-gray-700">Payment Amount ($)</label>
              <input
                id="paymentAmount"
                v-model.number="paymentAmount"
                type="number"
                step="0.01"
                :min="0"
                :max="selectedOrder.price"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                id="paymentMethod"
                v-model="paymentMethod"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="PAYPAL">PayPal</option>
                <option value="CHECK">Check</option>
                <option value="CASH">Cash</option>
              </select>
            </div>
            
            <div>
              <label for="paymentNotes" class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="paymentNotes"
                v-model="paymentNotes"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Optional payment notes or reference"
              ></textarea>
            </div>
            
            <div class="rounded-md bg-yellow-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">Important</h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <p>
                      This will record the payment in the system, but <strong>will not process an actual payment</strong>. 
                      Make sure you have completed the actual money transfer using your preferred payment method.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showPaymentModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="recordPayment"
            :disabled="!isPaymentValid"
            class="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Record Payment
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
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'load-provider-dashboard',
  middleware: ['auth']
})

interface OrderWithDetails extends Order {
  loadName: string
  truckName: string
  truckProviderName: string
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
const showCancelModal = ref(false)
const showAcceptModal = ref(false)
const showPaymentModal = ref(false)
const selectedOrder = ref<OrderWithDetails | null>(null)
const cancellationReason = ref('')
const paymentAmount = ref(0)
const paymentMethod = ref('')
const paymentNotes = ref('')
const actionLoading = ref<string | null>(null)

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
      order.truckProviderName.toLowerCase().includes(query) ||
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
      order.truckProviderName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
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
function formatStatus(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'ACCEPTED':
      return 'Accepted'
    case 'IN_TRANSIT':
      return 'In Transit'
    case 'DELIVERED':
      return 'Delivered'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    case 'REJECTED':
      return 'Rejected'
    default:
      return status
  }
}

// Get status badge class
function getStatusClass(status: string): string {
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
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Modal functions
function openOrderDetails(order: OrderWithDetails) {
  selectedOrder.value = order
  showOrderDetailsModal.value = true
}

function openCancelModal(order: OrderWithDetails) {
  if (order.status !== 'PENDING') {
    alert('This order is no longer pending. The list will be refreshed.');
    fetchOrders();
    return;
  }
  selectedOrder.value = order
  cancellationReason.value = ''
  showCancelModal.value = true
}

function openAcceptModal(order: OrderWithDetails) {
  if (order.status !== 'PENDING') {
    alert('This order is no longer pending. The list will be refreshed.');
    fetchOrders();
    return;
  }
  selectedOrder.value = order
  showAcceptModal.value = true
}

function openPaymentModal(order: OrderWithDetails) {
  selectedOrder.value = order
  paymentAmount.value = order.price
  paymentMethod.value = ''
  paymentNotes.value = ''
  showPaymentModal.value = true
}

// Cancel order
async function cancelOrder() {
  if (!selectedOrder.value) return
  actionLoading.value = selectedOrder.value.id
  try {
    // Call the API to cancel the order
    const { data, error: cancelError } = await useFetch(`/api/orders/${selectedOrder.value.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: { 
        reason: cancellationReason.value
      }
    })
    if (cancelError.value) {
      // Soft success for already-cancelled orders
      if (cancelError.value.message && cancelError.value.message.includes('Cannot cancel order in CANCELLED status')) {
        fetchOrders();
        showCancelModal.value = false
        selectedOrder.value = null
        cancellationReason.value = ''
        actionLoading.value = null
        return
      }
      console.error('Error cancelling order:', cancelError.value);
      throw new Error(cancelError.value.message || 'Failed to cancel order')
    }
    // Find and update the order in our local data
    const index = orders.value.findIndex(o => o.id === selectedOrder.value!.id)
    if (index !== -1) {
      orders.value[index].status = 'CANCELLED'
    }
    showCancelModal.value = false
    selectedOrder.value = null
    cancellationReason.value = ''
    // Show success message
    alert('Order cancelled successfully')
    fetchOrders();
  } catch (error) {
    console.error('Error cancelling order:', error)
    alert(`Error cancelling order: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    actionLoading.value = null
  }
}

// Accept order
async function acceptOrder() {
  if (!selectedOrder.value) return
  actionLoading.value = selectedOrder.value.id
  try {
    // Call the API to accept the order
    const { data, error: acceptError } = await useFetch(`/api/orders/${selectedOrder.value.id}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: {
        status: 'ACCEPTED',
        notes: 'Order accepted by load provider'
      }
    })
    if (acceptError.value) {
      // Soft success for already-accepted orders
      if (acceptError.value.message && acceptError.value.message.includes('Cannot change order status from ACCEPTED to ACCEPTED')) {
        fetchOrders();
        showAcceptModal.value = false
        selectedOrder.value = null
        actionLoading.value = null
        return
      }
      console.error('Error accepting order:', acceptError.value);
      throw new Error(acceptError.value.message || 'Failed to accept order')
    }
    // Find and update the order in our local data
    const index = orders.value.findIndex(o => o.id === selectedOrder.value!.id)
    if (index !== -1) {
      orders.value[index].status = 'ACCEPTED'
    }
    showAcceptModal.value = false
    selectedOrder.value = null
    // Show success message
    alert('Order accepted successfully')
    fetchOrders();
  } catch (error) {
    console.error('Error accepting order:', error)
    alert(`Error accepting order: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    actionLoading.value = null
  }
}

// Record payment
async function recordPayment() {
  if (!selectedOrder.value) return
  
  try {
    // Call the API to record the payment
    const { data, error: recordError } = await useFetch(`/api/orders/${selectedOrder.value.id}/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: {
        amount: paymentAmount.value,
        method: paymentMethod.value,
        notes: paymentNotes.value
      }
    })
    
    if (recordError.value) {
      console.error('Error recording payment:', recordError.value);
      throw new Error(recordError.value.message || 'Failed to record payment')
    }
    
    // Find and update the order in our local data
    const index = orders.value.findIndex(o => o.id === selectedOrder.value!.id)
    if (index !== -1) {
      orders.value[index].paymentStatus = 'COMPLETED'
    }
    
    showPaymentModal.value = false
    selectedOrder.value = null
    paymentAmount.value = 0
    paymentMethod.value = ''
    paymentNotes.value = ''
    
    // Show success message
    alert('Payment recorded successfully')
  } catch (error) {
    console.error('Error recording payment:', error)
    alert(`Error recording payment: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fetch orders
async function fetchOrders() {
  loading.value = true
  try {
    // Only send status if user has selected a filter
    const queryObj: any = {
      page: 1,
      limit: 50
    }
    if (filterStatus.value) {
      queryObj.status = filterStatus.value
    }
    const { data, error: fetchError } = await useFetch('/api/orders', {
      query: queryObj,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (fetchError.value) {
      console.error('API error response:', fetchError.value);
      throw new Error(fetchError.value.message || 'Failed to fetch orders')
    }
    
    console.log('API response for orders:', data.value);
    
    if (data.value?.orders) {
      console.log(`Found ${data.value.orders.length} orders from API`);
      
      // Transform the API response to match our local interface
      orders.value = data.value.orders.map((order: any) => {
        console.log('Processing order:', order.id, 'Status:', order.status);
        return {
          id: order.id,
          loadId: order.loadId,
          loadName: order.load?.title || 'Unknown Load',
          truckId: order.truckId,
          truckName: order.truck ? `${order.truck.make} ${order.truck.model} - ${order.truck.licensePlate}` : 'Unknown Truck',
          truckProviderId: order.truckProviderId,
          truckProviderName: `${order.truckProvider?.firstName || ''} ${order.truckProvider?.lastName || ''}`.trim() || 'Unknown Provider',
          origin: order.load?.pickupLocation || 'Unknown',
          destination: order.load?.deliveryLocation || 'Unknown',
          pickupDate: order.acceptedAt || order.createdAt,
          deliveryDate: order.completedAt || new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          price: order.price || 0,
          status: order.status,
          createdAt: order.createdAt,
          paymentStatus: order.paymentStatus
        };
      });
      
      console.log(`Mapped ${orders.value.length} orders for display`);
    } else {
      console.log('No orders found in API response');
      orders.value = []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    orders.value = [] // Ensure we clear any mock data
  } finally {
    loading.value = false
  }
}

// Add a watch for filter changes
watch([filterStatus, searchQuery, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

// Fetch orders on component mount
onMounted(() => {
  fetchOrders()
})

const isPaymentValid = computed(() => {
  return paymentAmount.value > 0 && 
         (selectedOrder.value ? paymentAmount.value <= selectedOrder.value.price : false) && 
         paymentMethod.value !== '';
});
</script> 