<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Available Trucks</h1>
      <div class="flex space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search trucks..."
            class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <select
          v-model="filterCapacity"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Capacities</option>
          <option value="5">Up to 5 tons</option>
          <option value="10">Up to 10 tons</option>
          <option value="20">Up to 20 tons</option>
          <option value="30">Up to 30 tons</option>
          <option value="50">50+ tons</option>
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
    <div v-else-if="filteredTrucks.length === 0" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 mb-2">No trucks available</h3>
      <p class="text-gray-500">There are no trucks matching your criteria</p>
    </div>

    <!-- Trucks Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="truck in filteredTrucks"
        :key="truck.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="relative h-48">
          <img
            :src="truck.images[0] || '/placeholder-truck.jpg'"
            :alt="truck.make + ' ' + truck.model"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 right-2">
            <span
              :class="[
                'px-2 py-1 rounded-full text-sm font-medium',
                truck.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ truck.isAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ truck.make }} {{ truck.model }}
          </h3>
          <div class="space-y-3 mb-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h1a1 1 0 011 1v6.05A2.5 2.5 0 0115.95 16H15a1 1 0 01-1-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0011 7h-1a1 1 0 00-1 1v5a1 1 0 01-1 1H8.05a2.5 2.5 0 00-4.9 0H5a1 1 0 01-1-1V5a1 1 0 011-1h9a1 1 0 011 1v1z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-500">Year</p>
                <p class="text-gray-900">{{ truck.year }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582A1 1 0 004 6.82v10.36a1 1 0 001.046.895L10 18.677V19a1 1 0 102 0v-.323l4.954-1.582A1 1 0 0018 17.18V6.82a1 1 0 00-1.046-.895L11 4.323V3a1 1 0 00-1-1zM8 6.82v10.36l4 1.6V8.42L8 6.82z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-500">Capacity</p>
                <p class="text-gray-900">{{ truck.capacity }} tons</p>
              </div>
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-500">License Plate</p>
                <p class="text-gray-900">{{ truck.licensePlate }}</p>
              </div>
            </div>
          </div>

          <button
            @click="selectTruck(truck)"
            :disabled="!truck.isAvailable"
            :class="[
              'w-full px-4 py-2 rounded-lg font-medium transition-colors',
              truck.isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            Select Truck
          </button>
        </div>
      </div>
    </div>

    <!-- Select Truck Modal -->
    <div
      v-if="showSelectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Select Truck</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to select this truck for your load? This will create an order and assign the truck to your load.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showSelectModal = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmSelectTruck"
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
import { useTruck } from '~/composables/useTruck'
import { useOrder } from '~/composables/useOrder'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { trucks, loading, error, fetchTrucks } = useTruck()
const { createOrder, calculateFee } = useOrder()

const searchQuery = ref('')
const filterCapacity = ref('')
const showSelectModal = ref(false)
const selectedTruck = ref<any>(null)

const filteredTrucks = computed(() => {
  return trucks.value.filter(truck => {
    const matchesSearch = searchQuery.value
      ? truck.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        truck.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        truck.licensePlate.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true

    const matchesCapacity = filterCapacity.value
      ? truck.capacity <= parseFloat(filterCapacity.value)
      : true

    return matchesSearch && matchesCapacity && truck.isAvailable
  })
})

onMounted(async () => {
  await fetchTrucks()
})

const selectTruck = (truck: any) => {
  selectedTruck.value = truck
  showSelectModal.value = true
}

const confirmSelectTruck = async () => {
  if (!selectedTruck.value) return

  try {
    const orderData = {
      truckId: selectedTruck.value.id,
      loadId: '', // TODO: Get selected load ID
      loadProviderId: authStore.user?.id,
      truckProviderId: selectedTruck.value.providerId,
      status: 'PENDING',
      price: 0, // TODO: Get load price
      pickupDate: new Date().toISOString(),
      deliveryDate: new Date().toISOString(),
    }

    await createOrder(orderData)
    showSelectModal.value = false
    selectedTruck.value = null
  } catch (err) {
    console.error('Error selecting truck:', err)
  }
}
</script> 