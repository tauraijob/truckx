<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Available Loads</h1>
      <div class="flex space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search loads..."
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
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
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
    <div v-else-if="filteredLoads.length === 0" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">No loads available</h3>
      <p class="text-gray-500">There are no loads matching your criteria</p>
    </div>

    <!-- Loads Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="load in filteredLoads"
        :key="load.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ load.title }}
              </h3>
              <p class="text-gray-600 line-clamp-2">{{ load.description }}</p>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                {
                  'bg-yellow-100 text-yellow-800': load.status === 'PENDING',
                  'bg-blue-100 text-blue-800': load.status === 'ASSIGNED',
                  'bg-green-100 text-green-800': load.status === 'IN_TRANSIT',
                  'bg-gray-100 text-gray-800': load.status === 'DELIVERED',
                  'bg-red-100 text-red-800': load.status === 'CANCELLED',
                }
              ]"
            >
              {{ load.status }}
            </span>
          </div>

          <div class="space-y-3 mb-4">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-500">Pickup</p>
                <p class="text-gray-900">{{ load.pickupLocation }}</p>
              </div>
            </div>
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-500">Delivery</p>
                <p class="text-gray-900">{{ load.deliveryLocation }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Weight</p>
              <p class="text-gray-900">{{ load.weight }} tons</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Dimensions</p>
              <p class="text-gray-900">
                {{ load.dimensions.length }}m × {{ load.dimensions.width }}m × {{ load.dimensions.height }}m
              </p>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div class="text-2xl font-bold text-gray-900">
              ${{ load.price.toLocaleString() }}
            </div>
            <button
              @click="acceptLoad(load)"
              :disabled="load.status !== 'PENDING'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                load.status === 'PENDING'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              Accept Load
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Accept Load Modal -->
    <div
      v-if="showAcceptModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Accept Load</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to accept this load? This will create an order and assign your truck to the load.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showAcceptModal = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmAcceptLoad"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="loading"
          >
            {{ loading ? 'Processing...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLoad } from '~/composables/useLoad'
import { useOrder } from '~/composables/useOrder'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { loads, loading, error, fetchLoads } = useLoad()
const { createOrder, calculateFee } = useOrder()

const searchQuery = ref('')
const filterStatus = ref('')
const showAcceptModal = ref(false)
const selectedLoad = ref<any>(null)

const filteredLoads = computed(() => {
  return loads.value.filter(load => {
    const matchesSearch = searchQuery.value
      ? load.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        load.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        load.pickupLocation.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        load.deliveryLocation.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true

    const matchesStatus = filterStatus.value
      ? load.status === filterStatus.value
      : true

    return matchesSearch && matchesStatus
  })
})

onMounted(async () => {
  await fetchLoads()
})

const acceptLoad = (load: any) => {
  selectedLoad.value = load
  showAcceptModal.value = true
}

const confirmAcceptLoad = async () => {
  if (!selectedLoad.value) return

  try {
    const orderData = {
      loadId: selectedLoad.value.id,
      truckId: '', // TODO: Get selected truck ID
      loadProviderId: selectedLoad.value.loadProviderId,
      truckProviderId: authStore.user?.id,
      status: 'PENDING',
      price: selectedLoad.value.price,
      pickupDate: new Date().toISOString(),
      deliveryDate: new Date().toISOString(),
    }

    await createOrder(orderData)
    showAcceptModal.value = false
    selectedLoad.value = null
  } catch (err) {
    console.error('Error accepting load:', err)
  }
}
</script> 