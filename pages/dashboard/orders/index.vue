<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
      <div class="flex space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search orders..."
            class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
      <p class="text-gray-500">There are no orders matching your criteria</p>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Order #{{ order.id.slice(0, 8) }}
            </h3>
            <p class="text-gray-600">
              {{ order.load.title }}
            </p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              {
                'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                'bg-green-100 text-green-800': order.status === 'ACCEPTED',
                'bg-red-100 text-red-800': order.status === 'REJECTED',
                'bg-blue-100 text-blue-800': order.status === 'IN_TRANSIT',
                'bg-purple-100 text-purple-800': order.status === 'COMPLETED',
                'bg-red-100 text-red-800': order.status === 'CANCELLED',
              }
            ]"
          >
            {{ formatStatus(order.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Load Details</h4>
            <p class="text-gray-900">{{ order.load.description }}</p>
            <div class="mt-2 space-y-1">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Pickup:</span> {{ order.load.pickupLocation }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Delivery:</span> {{ order.load.deliveryLocation }}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Weight:</span> {{ order.load.weight }} tons
              </p>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Truck Details</h4>
            <p class="text-gray-900">
              {{ order.truck.make }} {{ order.truck.model }}
            </p>
            <div class="mt-2 space-y-1">
              <p class="text-sm text-gray-600">
                <span class="font-medium">Capacity:</span> {{ order.truck.capacity }} tons
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">License:</span> {{ order.truck.licensePlate }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="space-y-1">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Price:</span> ${{ formatPrice(order.price) }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Created:</span> {{ formatDate(order.createdAt) }}
            </p>
            <p v-if="order.completedAt" class="text-sm text-gray-600">
              <span class="font-medium">Completed:</span> {{ formatDate(order.completedAt) }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              v-if="order.status === 'PENDING' && isTruckProvider"
              @click="handleAccept(order.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button
              v-if="order.status === 'PENDING' && isTruckProvider"
              @click="handleReject(order.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
            <button
              v-if="order.status === 'ACCEPTED' && isTruckProvider"
              @click="handleStartDelivery(order.id)"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Delivery
            </button>
            <button
              v-if="order.status === 'IN_TRANSIT' && isLoadProvider"
              @click="handleComplete(order.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Delivery
            </button>
            <button
              v-if="['PENDING', 'ACCEPTED'].includes(order.status)"
              @click="handleCancel(order.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          :class="[
            'px-3 py-1 rounded-md',
            pagination.currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          Previous
        </button>
        <div
          v-for="page in pagesArray"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1 rounded-md cursor-pointer',
            pagination.currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </div>
        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage === pagination.totalPages"
          :class="[
            'px-3 py-1 rounded-md',
            pagination.currentPage === pagination.totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          ]"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useOrder } from '~/composables/useOrder'
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const { orders, loading, error, fetchOrders, updateOrderStatus, cancelOrder, completeOrder } = useOrder()
const toast = useToast()

const searchQuery = ref('')
const filterStatus = ref('')
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10
})

const isLoadProvider = computed(() => authStore.user?.role === 'LOAD_PROVIDER')
const isTruckProvider = computed(() => authStore.user?.role === 'TRUCK_PROVIDER')

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = searchQuery.value
      ? (order.id && order.id.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (order.load?.title && order.load.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (order.load?.description && order.load.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
      : true

    const matchesStatus = filterStatus.value
      ? order.status === filterStatus.value
      : true

    return matchesSearch && matchesStatus
  })
})

const pagesArray = computed(() => {
  const pages = []
  for (let i = 1; i <= pagination.value.totalPages; i++) {
    pages.push(i)
  }
  return pages
})

// Format functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return '0.00'
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatStatus = (status) => {
  if (!status) return ''
  const statusMap = {
    'PENDING': 'Pending',
    'ACCEPTED': 'Accepted',
    'REJECTED': 'Rejected',
    'IN_TRANSIT': 'In Transit',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled'
  }
  return statusMap[status] || status
}

// Action handlers
const handleAccept = async (orderId) => {
  try {
    await updateOrderStatus(orderId, 'ACCEPTED')
    toast.success('Order accepted successfully')
  } catch (err) {
    toast.error('Failed to accept order')
  }
}

const handleReject = async (orderId) => {
  try {
    await updateOrderStatus(orderId, 'REJECTED')
    toast.success('Order rejected successfully')
  } catch (err) {
    toast.error('Failed to reject order')
  }
}

const handleStartDelivery = async (orderId) => {
  try {
    await updateOrderStatus(orderId, 'IN_TRANSIT')
    toast.success('Delivery started successfully')
  } catch (err) {
    toast.error('Failed to start delivery')
  }
}

const handleComplete = async (orderId) => {
  try {
    await completeOrder(orderId)
    toast.success('Order completed successfully')
  } catch (err) {
    toast.error('Failed to complete order')
  }
}

const handleCancel = async (orderId) => {
  try {
    await cancelOrder(orderId)
    toast.success('Order cancelled successfully')
  } catch (err) {
    toast.error('Failed to cancel order')
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  pagination.value.currentPage = page
  loadOrders()
}

const loadOrders = async () => {
  try {
    const page = pagination.value.currentPage
    const status = filterStatus.value
    const response = await fetchOrders()
    
    if (response && response.pagination) {
      pagination.value = {
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        itemsPerPage: response.pagination.itemsPerPage
      }
    }
  } catch (err) {
    console.error('Error loading orders:', err)
  }
}

// Watch for filter changes
watch([filterStatus, searchQuery], () => {
  pagination.value.currentPage = 1
  loadOrders()
}, { debounce: 300 })

onMounted(async () => {
  await loadOrders()
})
</script> 