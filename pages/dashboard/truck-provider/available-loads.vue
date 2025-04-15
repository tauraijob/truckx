<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Available Loads</h1>
      <button 
        @click="refreshLoads" 
        class="flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
        :disabled="loading"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Filters -->
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
            placeholder="Search by title, origin, or destination..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <select 
          v-model="selectedWeightCategory"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Weight Categories</option>
          <option value="light">Light (< 10,000 kg)</option>
          <option value="medium">Medium (10,000-20,000 kg)</option>
          <option value="heavy">Heavy (> 20,000 kg)</option>
        </select>
      </div>
      <div>
        <select 
          v-model="sortBy" 
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="price">Price (High to Low)</option>
          <option value="priceAsc">Price (Low to High)</option>
          <option value="distance">Distance (Nearest First)</option>
          <option value="date">Pickup Date (Earliest First)</option>
        </select>
      </div>
    </div>

    <!-- Add loading indicator when data is being fetched -->
    <div v-if="loading" class="col-span-full p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p class="text-lg text-gray-500">Loading available loads...</p>
    </div>

    <!-- Loads Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div v-for="load in paginatedLoads" :key="load.id" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">{{ load.title }}</h3>
          <span class="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
            ${{ load.price.toFixed(2) }}
          </span>
        </div>
        
        <div class="mb-4">
          <div class="flex items-center text-sm text-gray-700">
            <MapPinIcon class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500" />
            <p>From: <span class="font-medium">{{ load.origin }}</span></p>
          </div>
          <div class="mt-1 flex items-center text-sm text-gray-700">
            <MapPinIcon class="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-500" />
            <p>To: <span class="font-medium">{{ load.destination }}</span></p>
          </div>
        </div>
        
        <div class="mb-4 text-sm text-gray-500">
          <p>{{ load.description }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
          <div>
            <p class="font-medium text-gray-700">Pickup Date</p>
            <p>{{ formatDate(load.pickupDate) }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Delivery Date</p>
            <p>{{ formatDate(load.deliveryDate) }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Weight</p>
            <p>{{ load.weight }} kg</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Distance</p>
            <p>{{ load.distance }} km</p>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="openBidModal(load)" 
            class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
          >
            Place Bid
          </button>
        </div>
      </div>
      
      <!-- No loads found state -->
      <div v-if="paginatedLoads.length === 0" class="col-span-full p-8 text-center">
        <p class="text-lg text-gray-500">No loads matching your criteria were found.</p>
        <p class="mt-2 text-sm text-gray-400">Try adjusting your filters or search query.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ paginationRangeText }} of {{ filteredLoads.length }} loads
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)" 
          :disabled="currentPage === 1" 
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Bid Modal -->
    <div v-if="showBidModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full my-8 mx-auto">
        <!-- Close button at top corner -->
        <button 
          @click="closeBidModal" 
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-primary-50">
          <h3 class="text-lg font-medium text-gray-900">Place a Bid</h3>
        </div>
        
        <!-- Modal Body (with scrolling) -->
        <div class="px-6 py-4 max-h-[calc(100vh-240px)] overflow-y-auto">
          <!-- Load Info Section -->
          <div class="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 class="text-md font-medium text-gray-800 mb-2">Load Details</h4>
            <p class="mb-2 text-sm">
              <span class="font-medium text-gray-700">Name:</span> 
              <span class="text-gray-900">{{ selectedLoad?.title }}</span>
            </p>
            <p class="mb-2 text-sm">
              <span class="font-medium text-gray-700">Route:</span> 
              <span class="text-gray-900">{{ selectedLoad?.origin }} → {{ selectedLoad?.destination }}</span>
            </p>
            <p class="mb-2 text-sm">
              <span class="font-medium text-gray-700">Asking price:</span> 
              <span class="text-primary-700 font-medium">${{ selectedLoad?.price.toFixed(2) }}</span>
            </p>
          </div>
          
          <!-- Bid Amount Field -->
          <div class="mb-5">
            <label for="bidAmount" class="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount ($)</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="bidAmount"
                v-model="bidAmount"
                type="number"
                min="0"
                step="10"
                class="block w-full pl-7 pr-12 py-2.5 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-lg"
                placeholder="0.00"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>
          
          <!-- Truck Selection Field -->
          <div class="mb-5">
            <label for="selectTruck" class="block text-sm font-medium text-gray-700 mb-1">Select Your Truck</label>
            <select 
              id="selectTruck"
              v-model="selectedTruckId" 
              class="block w-full py-2.5 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-md"
            >
              <option value="" disabled selected>-- Select a truck --</option>
              <option v-for="truck in availableTrucks" :key="truck.id" :value="truck.id">
                {{ truck.make }} {{ truck.model }} ({{ truck.registrationNumber }})
              </option>
            </select>
            <p v-if="availableTrucks.length === 0" class="mt-1 text-sm text-red-500">
              You have no available trucks. Please add a truck first.
            </p>
          </div>
          
          <!-- Notes Field -->
          <div class="mb-2">
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea 
              id="notes"
              v-model="bidNotes" 
              rows="3"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Any special requirements or information"
            ></textarea>
          </div>
        </div>
        
        <!-- Validation Messages -->
        <div v-if="validationMessages.length > 0" class="px-6 pt-2 pb-3 bg-red-50 border-t border-red-100">
          <p class="text-sm font-medium text-red-600 mb-1">Please fix the following issues:</p>
          <ul class="text-sm text-red-600 list-disc pl-5">
            <li v-for="(message, index) in validationMessages" :key="index">
              {{ message }}
            </li>
          </ul>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-gray-50 flex justify-between border-t border-gray-200">
          <button 
            @click="closeBidModal" 
            class="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="submitBid" 
            class="rounded-md border border-transparent bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!isValidBid || isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit Bid' }}
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
  MapPinIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'truck-provider-dashboard',
  middleware: ['auth']
})

// Load interface
interface Load {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  distance: number;
  weight: number;
  price: number;
  providerId: string;
  providerName: string;
}

// Truck interface
interface Truck {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  type: string;
  capacityTons: number;
  availability: string;
}

// Pagination and filters
const currentPage = ref(1)
const itemsPerPage = ref(6)
const searchQuery = ref('')
const selectedWeightCategory = ref('all')
const sortBy = ref('price')

// Loads data
const loads = ref<Load[]>([])
const loading = ref(true)

// Available trucks for bidding
const availableTrucks = ref<Truck[]>([])

// Bid modal state and form data
const showBidModal = ref(false)
const selectedLoad = ref<Load | null>(null)
const selectedTruckId = ref('')
const bidAmount = ref<number | null>(null)
const bidNotes = ref('')

// Add a submitting state
const isSubmitting = ref(false)

// Filtered and sorted loads
const filteredLoads = computed(() => {
  let filtered = loads.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(load => 
      load.title.toLowerCase().includes(query) ||
      load.origin.toLowerCase().includes(query) ||
      load.destination.toLowerCase().includes(query) ||
      load.description.toLowerCase().includes(query) ||
      load.providerName.toLowerCase().includes(query)
    )
  }

  // Filter by weight category
  if (selectedWeightCategory.value !== 'all') {
    filtered = filtered.filter(load => {
      const weight = load.weight
      
      if (selectedWeightCategory.value === 'light') {
        return weight < 10000
      } 
      else if (selectedWeightCategory.value === 'medium') {
        return weight >= 10000 && weight <= 20000
      } 
      else if (selectedWeightCategory.value === 'heavy') {
        return weight > 20000
      }
      
      return true
    })
  }

  // Sort loads
  return filtered.sort((a, b) => {
    if (sortBy.value === 'price') {
      return b.price - a.price // High to low
    } 
    else if (sortBy.value === 'priceAsc') {
      return a.price - b.price // Low to high
    } 
    else if (sortBy.value === 'distance') {
      return a.distance - b.distance // Nearest first
    } 
    else if (sortBy.value === 'date') {
      return new Date(a.pickupDate) - new Date(b.pickupDate) // Earliest first
    }
    
    return 0
  })
})

// Pagination and filtering logic
const totalPages = computed(() => {
  let filteredCount = getFilteredCount()
  
  return Math.ceil(filteredCount / itemsPerPage.value)
})

// Paginated loads for display
const paginatedLoads = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLoads.value.slice(start, end)
})

// Pagination range text
const paginationRangeText = computed(() => {
  const filteredCount = getFilteredCount()
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage.value + 1, filteredCount)
  const end = Math.min(start + paginatedLoads.value.length - 1, filteredCount)
  
  return `${start}-${end}`
})

// Get filtered count for pagination
function getFilteredCount(): number {
  if (!searchQuery.value && !selectedWeightCategory.value) {
    return loads.value.length
  }
  
  let count = loads.value.filter(load => {
    // Search filter
    const matchesSearch = !searchQuery.value || 
      load.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.origin.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.providerName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Weight filter
    let matchesWeight = true
    if (selectedWeightCategory.value) {
      switch (selectedWeightCategory.value) {
        case 'light':
          matchesWeight = load.weight < 10000
          break
        case 'medium':
          matchesWeight = load.weight >= 10000 && load.weight <= 20000
          break
        case 'heavy':
          matchesWeight = load.weight > 20000
          break
      }
    }
    
    return matchesSearch && matchesWeight
  }).length
  
  return count
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

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Check if bid is valid
const isValidBid = computed(() => {
  return (
    bidAmount.value !== null && 
    bidAmount.value > 0 && 
    selectedTruckId.value !== ''
  )
})

// Validation messages
const validationMessages = computed(() => {
  const messages: string[] = []
  
  if (bidAmount.value === null || bidAmount.value <= 0) {
    messages.push('Please enter a valid bid amount greater than 0')
  }
  
  if (selectedTruckId.value === '') {
    messages.push('Please select a truck for this load')
  }
  
  return messages
})

// Bid modal functions
function openBidModal(load: Load) {
  selectedLoad.value = load
  bidAmount.value = load.price
  bidNotes.value = ''
  showBidModal.value = true
}

function closeBidModal() {
  showBidModal.value = false
  selectedLoad.value = null
  bidAmount.value = null
  selectedTruckId.value = ''
  bidNotes.value = ''
}

// Submit bid
async function submitBid() {
  if (!selectedLoad.value || !isValidBid.value) return
  
  try {
    isSubmitting.value = true
    
    // Find the selected truck details
    const selectedTruck = availableTrucks.value.find(truck => truck.id === selectedTruckId.value);
    
    console.log('Submitting bid...', {
      loadId: selectedLoad.value.id,
      truckId: selectedTruckId.value,
      truckDetails: selectedTruck,
      price: bidAmount.value,
      notes: bidNotes.value
    });
    
    const loadId = selectedLoad.value.id
    const truckId = selectedTruckId.value
    const price = bidAmount.value || 0
    const notes = bidNotes.value
    
    // Make the API call to create a bid (not an order)
    // Use the truck-provider specific endpoint
    const { data, error } = await useFetch('/api/truck-provider/bids', {
      method: 'POST',
      body: {
        loadId,
        truckId,
        price,
        notes
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (error.value) {
      console.error('Error submitting bid:', error.value)
      alert(`Failed to submit bid: ${error.value.message || 'Unknown error'}`)
      return
    }
    
    console.log('Bid submitted successfully:', data.value)
    
    // Close modal and show success message
    closeBidModal()
    alert('Your bid has been submitted successfully! The load provider will review your bid.')
    
    // Refresh the loads list
    await fetchAvailableLoads()
  } catch (error) {
    console.error('Error submitting bid:', error)
    alert(`An unexpected error occurred when submitting your bid: ${error.message || 'Unknown error'}`)
  } finally {
    isSubmitting.value = false
  }
}

// Function to fetch available loads
async function fetchAvailableLoads() {
  try {
    loading.value = true
    console.log('Fetching available loads from API...')
    
    // Fetch loads with isAvailable=true to get only available loads
    // Don't specify providerId to get loads from all providers
    const { data, error } = await useFetch('/api/loads', {
      query: {
        isAvailable: 'true'
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (error.value) {
      console.error('Error fetching loads:', error.value)
      alert(`Failed to fetch available loads: ${error.value.message || 'Unknown error'}`)
      return
    }
    
    if (data.value && data.value.loads) {
      console.log(`Received ${data.value.loads.length} loads from API`)
      
      // Map the API response to our Load interface
      loads.value = data.value.loads.map((load: any) => {
        console.log('Processing load:', load); // Debug the actual data structure
        
        return {
          id: load.id,
          title: load.name || load.title || 'Unnamed Load',
          description: load.description || 'No description available',
          origin: load.origin || load.pickupLocation || 'Unknown',
          destination: load.destination || load.deliveryLocation || 'Unknown',
          pickupDate: load.pickupDate || new Date().toISOString(),
          deliveryDate: load.deliveryDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          distance: load.distance || calculateDistance(load.origin || load.pickupLocation || '', load.destination || load.deliveryLocation || ''),
          weight: load.weight || 0,
          price: load.price || 0,
          providerId: load.providerId || load.userId || '',
          providerName: load.provider 
            ? `${load.provider.firstName || ''} ${load.provider.lastName || ''}`.trim() || 'Unknown' 
            : 'Unknown Provider'
        };
      })
      
      console.log('Loads processed and ready for display:', loads.value.length)
    } else {
      console.warn('No loads data received or invalid response format')
      loads.value = []
    }
  } catch (error) {
    console.error('Error processing loads data:', error)
    alert('An unexpected error occurred when fetching loads data')
    loads.value = []
  } finally {
    loading.value = false
  }
}

// Function to refresh loads data
async function refreshLoads() {
  await fetchAvailableLoads()
  await fetchTrucks()
}

// Function to fetch trucks
async function fetchTrucks() {
  try {
    console.log('Fetching available trucks...')
    
    // Fetch trucks belonging to the current user that are available
    const { data: trucksData, error: trucksError } = await useFetch('/api/trucks', {
      query: {
        providerId: 'current', // This should fetch the current user's trucks
        isAvailable: 'true'
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (trucksError.value) {
      console.error('Error fetching trucks:', trucksError.value)
      alert(`Failed to fetch your trucks: ${trucksError.value.message || 'Unknown error'}`)
      return
    }
    
    if (trucksData.value && trucksData.value.trucks) {
      console.log('Raw trucks data:', trucksData.value.trucks);
      
      // Transform the data to match our interface
      availableTrucks.value = trucksData.value.trucks.map((truck: any) => {
        const mappedTruck = {
          id: truck.id,
          make: truck.make || 'Unknown',
          model: truck.model || 'Unknown',
          registrationNumber: truck.licensePlate || truck.registrationNumber || 'Unknown',
          type: truck.type || 'STANDARD',
          capacityTons: truck.capacity || 0,
          availability: truck.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'
        };
        console.log('Mapped truck:', mappedTruck);
        return mappedTruck;
      })
      
      console.log(`Found ${availableTrucks.value.length} available trucks`)
      
      // If no trucks are found, log this for debugging
      if (availableTrucks.value.length === 0) {
        console.warn('No available trucks found for the current user')
      }
    } else {
      console.warn('No trucks data received or invalid response format')
      availableTrucks.value = []
    }
  } catch (error) {
    console.error('Error processing trucks data:', error)
    alert('An unexpected error occurred when fetching trucks data')
  }
}

// Fetch loads and available trucks
onMounted(async () => {
  // Initialize loading state
  loading.value = true
  
  try {
    // Fetch both loads and trucks in parallel
    await Promise.all([
      fetchAvailableLoads(),
      fetchTrucks()
    ])
  } catch (error) {
    console.error('Error during initial data fetching:', error)
  } finally {
    // Always reset loading state
    loading.value = false
  }
})

// Helper function to calculate approximate distance between two locations
function calculateDistance(origin: string, destination: string): number {
  // This is a placeholder function - in a real app, you'd use a geolocation API
  // Returns a random distance between 150-1500 kilometers for demonstration
  return Math.floor(Math.random() * 1350) + 150
}
</script> 