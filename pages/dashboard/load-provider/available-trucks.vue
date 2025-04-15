<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Available Trucks</h1>
      <p class="mt-1 text-sm text-gray-500">Browse and request trucks for your loads</p>
    </div>

    <!-- Server connection error -->
    <div v-if="serverError" class="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Server Connection Error</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>Unable to connect to the server. Please check your internet connection and try again later.</p>
            <button 
              @click="retryConnection" 
              class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="!serverError" class="mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by registration, make, model, or location..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
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
      <div>
        <select
          v-model="filterCapacity"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Capacities</option>
          <option value="low">Under 10 tons</option>
          <option value="medium">10-20 tons</option>
          <option value="high">Over 20 tons</option>
        </select>
      </div>
    </div>

    <!-- Trucks Grid -->
    <div v-if="!serverError && !loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="truck in filteredTrucks" :key="truck.id" 
        class="bg-white rounded-lg shadow overflow-hidden transition-all duration-200 hover:shadow-lg">
        <!-- Truck Image -->
        <div class="relative h-48">
          <img 
            :src="truck.images && truck.images.length > 0 ? truck.images[0] : '/images/truckx-slide.webp'"
            :alt="`${truck.make} ${truck.model}`" 
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 right-3">
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Available
            </span>
          </div>
          
          <!-- Image count badge -->
          <div v-if="truck.images && truck.images.length > 1" class="absolute bottom-3 right-3">
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-black bg-opacity-60 text-white">
              {{ truck.images.length }} Photos
            </span>
          </div>
        </div>
        
        <!-- Truck Info -->
        <div class="p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ truck.name || `${truck.make} ${truck.model}` }}
            </h3>
          </div>
          
          <div class="mt-3 space-y-2">
            <div class="flex items-center text-sm text-gray-500">
              <TruckIcon class="h-4 w-4 mr-2 text-[#0070f3]" />
              <span>{{ formatTruckType(truck.type) }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <ScaleIcon class="h-4 w-4 mr-2 text-[#0070f3]" />
              <span>{{ truck.capacity }} tons</span>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <CalendarIcon class="h-4 w-4 mr-2 text-[#0070f3]" />
              <span>{{ truck.year }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <MapPinIcon class="h-4 w-4 mr-2 text-[#0070f3]" />
              <span>{{ truck.currentLocation || 'Location not specified' }}</span>
            </div>
            <div v-if="truck.specifications?.engineType" class="flex items-center text-sm text-gray-500">
              <WrenchScrewdriverIcon class="h-4 w-4 mr-2 text-[#0070f3]" />
              <span>{{ truck.specifications.engineType }}</span>
            </div>
          </div>
          
          <div class="mt-5 flex justify-end">
            <button @click="openTruckDetails(truck)" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0060df] focus:outline-none">
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty state (only show when no server error, not loading, and no trucks) -->
      <div v-if="!serverError && !loading && filteredTrucks.length === 0" class="col-span-full py-10 text-center">
        <div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <TruckIcon class="h-10 w-10 text-gray-400" />
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No trucks found</h3>
        <p class="mt-1 text-sm text-gray-500">
          No trucks match your search criteria. Try adjusting your filters.
        </p>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading && !serverError" class="py-20 text-center">
      <div class="inline-flex h-20 w-20 items-center justify-center">
        <svg class="h-12 w-12 animate-spin text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 class="mt-4 text-sm font-medium text-gray-900">Loading available trucks...</h3>
    </div>
    
    <!-- Pagination -->
    <div v-if="trucks.length > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredCount) }} of {{ filteredCount }} trucks
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
    
    <!-- Truck Details Modal -->
    <div v-if="showTruckDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Truck Details</h3>
          <button @click="showTruckDetailsModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="selectedTruck" class="p-6">
          <!-- Truck Image Gallery -->
          <TruckImageGallery :images="selectedTruck.images || []" :alt="`${selectedTruck.make} ${selectedTruck.model}`" />
          
          <div class="mt-6 flex items-center space-x-4">
            <div class="h-16 w-16 rounded-md bg-blue-100 flex items-center justify-center">
              <TruckIcon class="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h3 class="text-xl font-medium text-gray-900">{{ selectedTruck.make }} {{ selectedTruck.model }}</h3>
              <p class="text-sm text-gray-500">{{ selectedTruck.registrationNumber }}</p>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Type</p>
              <p class="text-base font-medium text-gray-900">{{ formatTruckType(selectedTruck.type) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Capacity</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.capacity }} tons</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Year</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.year }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Current Location</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.currentLocation || 'Not specified' }}</p>
            </div>
            <div v-if="selectedTruck.specifications?.engineType">
              <p class="text-sm text-gray-500">Engine Type</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.specifications.engineType }}</p>
            </div>
            <div v-if="selectedTruck.specifications?.transmission">
              <p class="text-sm text-gray-500">Transmission</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.specifications.transmission }}</p>
            </div>
            <div v-if="selectedTruck.specifications?.fuelType">
              <p class="text-sm text-gray-500">Fuel Type</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.specifications.fuelType }}</p>
            </div>
            <div v-if="selectedTruck.specifications?.mileage">
              <p class="text-sm text-gray-500">Mileage</p>
              <p class="text-base font-medium text-gray-900">{{ selectedTruck.specifications.mileage }} km</p>
            </div>
          </div>
          
          <div class="mt-6">
            <p class="text-sm text-gray-500">Provider</p>
            <p class="text-base font-medium text-gray-900">{{ selectedTruck.providerName }}</p>
          </div>
          
          <div v-if="selectedTruck.description || selectedTruck.specifications?.additionalInfo" class="mt-6">
            <p class="text-sm text-gray-500">Description</p>
            <p class="mt-2 text-sm text-gray-600">{{ selectedTruck.description || selectedTruck.specifications?.additionalInfo }}</p>
          </div>
          
          <div class="mt-6">
            <button 
              @click="requestTruck(selectedTruck)" 
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
              Request This Truck
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Request Truck Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl">
          <div class="flex items-center">
            <TruckIcon class="h-7 w-7 text-white mr-3" />
            <h3 class="text-2xl font-semibold text-white">Request Truck</h3>
          </div>
          <button @click="showRequestModal = false" class="text-white hover:text-gray-200 p-2 hover:bg-primary-800 rounded-lg transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <!-- Form Content -->
        <div v-if="selectedTruck" class="p-8 space-y-8">
          <!-- Selected Truck Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <TruckIcon class="h-5 w-5 text-primary-500 mr-2" />
              Selected Truck
            </h4>
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <TruckIcon class="h-9 w-9 text-blue-600" />
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ selectedTruck.make }} {{ selectedTruck.model }}</h3>
                <p class="text-sm text-gray-500">{{ selectedTruck.registrationNumber }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500">{{ formatTruckType(selectedTruck.type) }}</span>
                  <span class="text-gray-300">•</span>
                  <span class="text-xs text-gray-500">{{ selectedTruck.capacity }} tons</span>
                  <span class="text-gray-300">•</span>
                  <span class="text-xs text-gray-500">{{ selectedTruck.currentLocation }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Load Selection Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <CubeIcon class="h-5 w-5 text-primary-500 mr-2" />
              Load Details
            </h4>
            
            <div class="space-y-6">
              <div class="space-y-2">
                <label for="loadSelect" class="block text-sm font-medium text-gray-700">Select Your Load</label>
                <div class="relative">
                  <select
                    id="loadSelect"
                    v-model="selectedLoadId"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 bg-white transition-all duration-200"
                  >
                    <option value="" disabled>Select a load</option>
                    <option v-for="load in availableLoads" :key="load.id" :value="load.id">
                      {{ load.title }} ({{ load.origin }} → {{ load.destination }})
                    </option>
                  </select>
                  <MapPinIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <p v-if="availableLoads.length === 0" class="text-xs text-orange-500 mt-2">
                  You don't have any available loads. Please create a load first.
                </p>
              </div>
              
              <div class="space-y-2">
                <label for="proposedPrice" class="block text-sm font-medium text-gray-700">Proposed Price ($)</label>
                <div class="relative">
                  <input
                    id="proposedPrice"
                    v-model.number="proposedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter your price offer"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <CurrencyDollarIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Additional Information -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon class="h-5 w-5 text-primary-500 mr-2" />
              Additional Information
            </h4>
            <div class="space-y-2">
              <label for="additionalNotes" class="block text-sm font-medium text-gray-700">Notes for the Truck Provider</label>
              <textarea
                id="additionalNotes"
                v-model="additionalNotes"
                rows="4"
                placeholder="Any specific requirements, pickup/delivery instructions, or other details the truck provider should know..."
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-4 transition-all duration-200"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-8 py-6 bg-gray-50 flex justify-end space-x-4 rounded-b-xl border-t border-gray-200">
          <button 
            @click="showRequestModal = false"
            class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <XMarkIcon class="h-5 w-5 mr-2 text-gray-400" />
            Cancel
          </button>
          <button 
            @click="submitTruckRequest"
            :disabled="!selectedLoadId || !proposedPrice"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <CheckIcon class="h-5 w-5 mr-2" />
            Submit Request
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  MagnifyingGlassIcon,
  TruckIcon,
  XMarkIcon,
  CubeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckIcon,
  CalendarIcon,
  ScaleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/vue/24/outline'
import TruckImageGallery from '~/components/TruckImageGallery.vue'

definePageMeta({
  layout: 'load-provider-dashboard',
  middleware: ['auth']
})

// Interfaces
interface Truck {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  type: string;
  capacity: number;
  year: number;
  currentLocation: string;
  providerId: string;
  providerName: string;
  description?: string;
  images?: string[];
  specifications?: {
    engineType?: string;
    transmission?: string;
    fuelType?: string;
    mileage?: number;
    additionalInfo?: string;
  };
}

interface Load {
  id: string;
  title: string;
  origin: string;
  destination: string;
  status: string;
}

// Pagination and filters
const currentPage = ref(1)
const itemsPerPage = 9
const searchQuery = ref('')
const filterType = ref('')
const filterCapacity = ref('')

// Data
const trucks = ref<Truck[]>([])
const availableLoads = ref<Load[]>([])
const loading = ref(true)
const serverError = ref(false)

// Modal states
const showTruckDetailsModal = ref(false)
const showRequestModal = ref(false)
const selectedTruck = ref<Truck | null>(null)
const selectedLoadId = ref('')
const proposedPrice = ref<number | null>(null)
const additionalNotes = ref('')

// Filter trucks
const filteredTrucks = computed(() => {
  let result = trucks.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(truck => 
      truck.make.toLowerCase().includes(query) ||
      truck.model.toLowerCase().includes(query) ||
      truck.registrationNumber.toLowerCase().includes(query) ||
      truck.currentLocation.toLowerCase().includes(query) ||
      formatTruckType(truck.type).toLowerCase().includes(query) ||
      truck.providerName.toLowerCase().includes(query)
    )
  }

  // Apply type filter
  if (filterType.value) {
    result = result.filter(truck => truck.type === filterType.value)
  }

  // Apply capacity filter
  if (filterCapacity.value) {
    switch (filterCapacity.value) {
      case 'low':
        result = result.filter(truck => truck.capacity < 10)
        break
      case 'medium':
        result = result.filter(truck => truck.capacity >= 10 && truck.capacity <= 20)
        break
      case 'high':
        result = result.filter(truck => truck.capacity > 20)
        break
    }
  }

  // Paginate results
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages and filtered count
const filteredCount = computed(() => {
  return getFilteredCount()
})

const totalPages = computed(() => {
  if (trucks.value.length === 0) return 1
  return Math.ceil(filteredCount.value / itemsPerPage)
})

// Get filtered count for pagination
function getFilteredCount(): number {
  if (!searchQuery.value && !filterType.value && !filterCapacity.value) {
    return trucks.value.length
  }
  
  return trucks.value.filter(truck => {
    // Apply search filter
    const matchesSearch = !searchQuery.value || 
      truck.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.registrationNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.currentLocation.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      formatTruckType(truck.type).toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.providerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Apply type filter
    const matchesType = !filterType.value || truck.type === filterType.value
    
    // Apply capacity filter
    let matchesCapacity = true
    if (filterCapacity.value) {
      switch (filterCapacity.value) {
        case 'low':
          matchesCapacity = truck.capacity < 10
          break
        case 'medium':
          matchesCapacity = truck.capacity >= 10 && truck.capacity <= 20
          break
        case 'high':
          matchesCapacity = truck.capacity > 20
          break
      }
    }
    
    return matchesSearch && matchesType && matchesCapacity
  }).length
}

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

// Modal functions
function openTruckDetails(truck: Truck) {
  selectedTruck.value = truck
  showTruckDetailsModal.value = true
}

function openRequestModal(truck: Truck) {
  selectedTruck.value = truck
  showRequestModal.value = true
}

// Request truck directly from details modal
function requestTruck(truck: Truck) {
  openRequestModal(truck)
  showTruckDetailsModal.value = false
}

// Submit truck request
async function submitTruckRequest() {
  if (!selectedTruck.value || !selectedLoadId.value || !proposedPrice.value) {
    alert('Please fill in all required fields')
    return
  }
  
  try {
    loading.value = true
    
    console.log(`Submitting truck request: Truck ID: ${selectedTruck.value.id}, Load ID: ${selectedLoadId.value}, Price: ${proposedPrice.value}`)
    
    // Make the API call to create an order
    const { data, error } = await useFetch('/api/orders', {
      method: 'POST',
      body: {
        truckId: selectedTruck.value.id,
        loadId: selectedLoadId.value,
        price: proposedPrice.value,
        notes: additionalNotes.value
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (error.value) {
      console.error('Error submitting truck request:', error.value)
      let errorMessage = error.value.message || 'Unknown error'
      
      if (error.value.data && error.value.data.message) {
        errorMessage = error.value.data.message
      }
      
      alert(`Failed to submit request: ${errorMessage}`)
      return
    }
    
    console.log('Truck request submitted successfully:', data.value)
    
    // Close the modal and reset form values
    showRequestModal.value = false
    selectedTruck.value = null
    selectedLoadId.value = ''
    proposedPrice.value = null
    additionalNotes.value = ''
    
    // Show success message
    alert('Your truck request has been submitted successfully! Navigating to orders page...')
    
    // Navigate to the orders page
    navigateTo('/dashboard/load-provider/orders')
  } catch (error) {
    console.error('Error submitting truck request:', error)
    alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
}

// Retry connection function
async function retryConnection() {
  serverError.value = false
  loading.value = true
  
  try {
    await fetchTrucks()
    try {
      await fetchAvailableLoads()
    } catch (loadError) {
      console.error('Failed to fetch loads during retry:', loadError)
      // Continue anyway - the user can still view trucks without loads
    }
  } catch (error) {
    console.error('Error retrying connection:', error)
    serverError.value = true
  } finally {
    loading.value = false
  }
}

// Fetch trucks function
async function fetchTrucks() {
  try {
    console.log('Fetching available trucks')
    
    const { data, error } = await useFetch('/api/trucks', {
      query: {
        isAvailable: 'true'
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 10000, // 10 second timeout
      retry: 1
    })
    
    if (error.value) {
      console.error('Error fetching trucks:', error.value)
      if (error.value.message && error.value.message.includes('Failed to fetch')) {
        serverError.value = true
      }
      trucks.value = [] // Use empty array to continue with the app
      return
    }

    console.log('API response:', data.value)
    serverError.value = false
    
    if (data.value && data.value.trucks) {
      // Transform the truck data to match our interface
      trucks.value = data.value.trucks.map(truck => {
        // Extract specifications from the JSON field
        const specs = truck.specifications || {};
        
        return {
          id: truck.id,
          make: truck.make,
          model: truck.model,
          registrationNumber: truck.licensePlate,
          type: specs.type || 'STANDARD',
          capacity: truck.capacity,
          year: truck.year,
          currentLocation: specs.currentLocation || 'Unknown',
          providerId: truck.provider.id,
          providerName: `${truck.provider.firstName} ${truck.provider.lastName}`,
          description: specs.description || '',
          images: truck.images || [],
          specifications: specs
        };
      })
      
      console.log(`Found ${trucks.value.length} available trucks`)
    } else {
      console.error('Invalid API response format or no trucks found')
      trucks.value = []
    }
  } catch (error) {
    console.error('Error fetching trucks:', error)
    serverError.value = true
    trucks.value = []
    throw error
  }
}

// Fetch data
onMounted(async () => {
  loading.value = true
  serverError.value = false
  
  try {
    // Fetch trucks
    await fetchTrucks()
    
    // Try to fetch available loads but don't block the main functionality
    try {
      await fetchAvailableLoads()
    } catch (loadError) {
      console.error('Failed to fetch loads:', loadError)
      // Continue anyway - the user can still view trucks without loads
    }
  } catch (error) {
    console.error('Error during initial data loading:', error)
    serverError.value = true
  } finally {
    loading.value = false
  }
})

// Fetch available loads for this provider
async function fetchAvailableLoads() {
  try {
    console.log('Fetching available loads...')
    
    const { data, error } = await useFetch('/api/loads', {
      query: {
        providerId: 'current',
        isAvailable: 'true'
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      onResponseError: (error) => {
        console.error('Response error fetching loads:', error)
      },
      retry: 1
    })
    
    if (error.value) {
      console.error('Error fetching available loads:', error.value)
      availableLoads.value = [] // Use empty array to continue with the app
      return
    }
    
    if (data.value && data.value.loads) {
      // Transform the load data to match our interface
      availableLoads.value = data.value.loads.map(load => ({
        id: load.id,
        title: load.title,
        origin: load.pickupLocation,
        destination: load.deliveryLocation,
        status: load.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'
      }))
      
      console.log(`Found ${availableLoads.value.length} available loads`)
    } else {
      console.warn('No loads found or invalid API response format')
      availableLoads.value = []
    }
  } catch (error) {
    console.error('Error fetching available loads:', error)
    availableLoads.value = [] // Use empty array to allow users to continue using the app
  }
}

// Format truck type from DB format (e.g., FLATBED) to display format (e.g., Flatbed)
function formatTruckType(type: string): string {
  if (!type) return 'Unknown';
  
  // Handle SNAKE_CASE to Title Case conversion
  if (type.includes('_')) {
    return type.toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle UPPERCASE to Title Case
  if (type === type.toUpperCase()) {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
  
  return type;
}
</script> 