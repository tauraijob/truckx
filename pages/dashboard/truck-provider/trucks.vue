<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">My Trucks</h1>
      <button 
        @click="showAddTruckModal = true"
        class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
      >
        <PlusIcon class="mr-2 h-5 w-5" />
        Add New Truck
      </button>
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
            placeholder="Search by registration, make, or model..."
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Current Location</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Availability</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="truck in filteredTrucks" :key="truck.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <TruckIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ truck.make }} {{ truck.model }}</div>
                  <div class="text-xs text-gray-500">
                    <span>{{ truck.registrationNumber }}</span>
                    <span class="mx-1">•</span>
                    <span>{{ truck.year }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ formatTruckType(truck.type) }}</div>
              <div class="text-sm text-gray-500">{{ truck.capacityTons }} tons</div>
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
              <span v-else class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getAvailabilityClass(truck.availability)">
                {{ formatAvailability(truck.availability) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button 
                  @click="openEditModal(truck)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-blue-600"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button 
                  @click="openStatusModal(truck)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-green-600"
                >
                  <ArrowPathIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredTrucks.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              No trucks found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ trucks.length }} trucks
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

    <!-- Add/Edit Truck Modal -->
    <div v-if="showAddTruckModal || showEditTruckModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl">
          <div class="flex items-center">
            <TruckIcon class="h-7 w-7 text-white mr-3" />
            <h3 class="text-2xl font-semibold text-white">{{ showEditTruckModal ? 'Edit Truck Details' : 'Add New Truck' }}</h3>
          </div>
          <button @click="closeModal" class="text-white hover:text-gray-200 p-2 hover:bg-primary-800 rounded-lg transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-8 space-y-8">
          <!-- Basic Information Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <InformationCircleIcon class="h-5 w-5 text-primary-500 mr-2" />
              Basic Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="space-y-2">
                <label for="make" class="block text-sm font-medium text-gray-700">Make</label>
                <div class="relative">
                  <input 
                    id="make"
                    v-model="truckForm.make"
                    type="text"
                    placeholder="e.g. Volvo"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <BuildingOfficeIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
                <div class="relative">
                  <input 
                    id="model"
                    v-model="truckForm.model"
                    type="text"
                    placeholder="e.g. FH16"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <TagIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="registration" class="block text-sm font-medium text-gray-700">Registration Number</label>
                <div class="relative">
                  <input 
                    id="registration"
                    v-model="truckForm.registrationNumber"
                    type="text"
                    placeholder="e.g. ABC123"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 uppercase transition-all duration-200"
                  />
                  <IdentificationIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
                <div class="relative">
                  <input 
                    id="year"
                    v-model="truckForm.year"
                    type="number"
                    min="1900"
                    :max="new Date().getFullYear() + 1"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <CalendarIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <!-- Specifications Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <WrenchScrewdriverIcon class="h-5 w-5 text-primary-500 mr-2" />
              Specifications
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="space-y-2">
                <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                <div class="relative">
                  <select 
                    id="type"
                    v-model="truckForm.type"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 bg-white transition-all duration-200"
                  >
                    <option value="FLATBED">Flatbed</option>
                    <option value="REFRIGERATED">Refrigerated</option>
                    <option value="DRY_VAN">Dry Van</option>
                    <option value="STEP_DECK">Step Deck</option>
                    <option value="TANKER">Tanker</option>
                  </select>
                  <TruckIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity (tons)</label>
                <div class="relative">
                  <input 
                    id="capacity"
                    v-model="truckForm.capacityTons"
                    type="number"
                    step="0.1"
                    min="0"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <ScaleIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="location" class="block text-sm font-medium text-gray-700">Current Location</label>
                <div class="relative">
                  <input 
                    id="location"
                    v-model="truckForm.currentLocation"
                    type="text"
                    placeholder="e.g. New York, NY"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <MapPinIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="availability" class="block text-sm font-medium text-gray-700">Availability</label>
                <div class="relative">
                  <select 
                    id="availability"
                    v-model="truckForm.availability"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 bg-white transition-all duration-200"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="BUSY">Busy</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <ClockIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description"
                v-model="truckForm.description"
                rows="4"
                placeholder="Enter any additional details about the truck..."
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-4 transition-all duration-200"
              ></textarea>
            </div>
          </div>
          
          <!-- Featured Image Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <PhotoIcon class="h-5 w-5 text-primary-500 mr-2" />
              Featured Image
            </h4>
            <p class="mb-4 text-sm text-gray-600">Upload a main image that will be displayed prominently for your truck</p>
            
            <ImageUpload 
              ref="featuredImageUpload"
              mode="featured"
              @update:featured="handleFeaturedImageUpdate"
              @error="handleImageError"
            />
            
            <div v-if="errors.featuredImage" class="text-red-500 mt-2 text-sm">{{ errors.featuredImage }}</div>
          </div>
          
          <!-- Gallery Images Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <PhotoIcon class="h-5 w-5 text-primary-500 mr-2" />
              Gallery Images
            </h4>
            <p class="mb-4 text-sm text-gray-600">Add additional images to showcase your truck (up to 7 images)</p>
            
            <ImageUpload 
              ref="galleryImageUpload"
              mode="gallery"
              :maxGalleryImages="7"
              @update:gallery="handleGalleryImagesUpdate"
              @error="handleImageError"
            />
            
            <div v-if="errors.galleryImages" class="text-red-500 mt-2 text-sm">{{ errors.galleryImages }}</div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-8 py-6 bg-gray-50 flex justify-end space-x-4 rounded-b-xl border-t border-gray-200">
          <button 
            @click="closeModal"
            class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <XMarkIcon class="h-5 w-5 mr-2 text-gray-400" />
            Cancel
          </button>
          <button 
            @click="saveTruck"
            :disabled="isSaving"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="isSaving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            <CheckIcon v-else class="h-5 w-5 mr-2" />
            {{ isSaving ? 'Saving...' : (showEditTruckModal ? 'Update Truck' : 'Add Truck') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Change Status Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Update Truck Status</h3>
        </div>
        <div class="p-6">
          <p class="mb-4 text-sm text-gray-500">
            Update the availability status for <span class="font-medium">{{ selectedTruck?.make }} {{ selectedTruck?.model }}</span> 
            ({{ selectedTruck?.registrationNumber }})
          </p>
          
          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700">New Status</label>
            <select 
              id="status"
              v-model="newStatus"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="AVAILABLE">Available</option>
              <option value="BUSY">Busy</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showStatusModal = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            @click="updateStatus"
            :disabled="isSaving"
            class="rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="isSaving" class="inline-block mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            {{ isSaving ? 'Updating...' : 'Update Status' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="showNotification" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">{{ notification?.message }}</h3>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button 
            @click="showNotification = false"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Close
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
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
  BuildingOfficeIcon,
  TagIcon,
  IdentificationIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ScaleIcon,
  ClockIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import ImageUpload from '~/components/ImageUpload.vue'

definePageMeta({
  layout: 'truck-provider-dashboard',
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
  availability: string;
  description?: string;
  activeOrderStatus?: string;
  hasActiveOrder?: boolean;
  activeLoadInfo?: {
    id: string;
    title: string;
  };
}

// Pagination and filters
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const filterAvailability = ref('')
const filterType = ref('')

// Trucks data
const trucks = ref<Truck[]>([])
const loading = ref(true)
const isSaving = ref(false)

// Modal states and form
const showAddTruckModal = ref(false)
const showEditTruckModal = ref(false)
const showStatusModal = ref(false)
const selectedTruck = ref<Truck | null>(null)
const newStatus = ref('')
const notification = ref<{ type: 'success' | 'error', message: string } | null>(null)
const showNotification = ref(false)

const truckForm = ref({
  id: '',
  make: '',
  model: '',
  registrationNumber: '',
  type: 'FLATBED',
  capacityTons: 0,
  year: new Date().getFullYear(),
  currentLocation: '',
  availability: 'AVAILABLE',
  description: ''
})

// Form state
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
// Image upload refs
const featuredImageUpload = ref<InstanceType<typeof ImageUpload> | null>(null)
const galleryImageUpload = ref<InstanceType<typeof ImageUpload> | null>(null)
const featuredImage = ref<string | null>(null)
const galleryImages = ref<string[]>([])

// Filter and paginate trucks
const filteredTrucks = computed(() => {
  let result = trucks.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(truck => 
      truck.registrationNumber.toLowerCase().includes(query) ||
      truck.make.toLowerCase().includes(query) ||
      truck.model.toLowerCase().includes(query) ||
      truck.currentLocation.toLowerCase().includes(query)
    )
  }

  // Apply availability filter
  if (filterAvailability.value) {
    result = result.filter(truck => truck.availability === filterAvailability.value)
  }

  // Apply type filter
  if (filterType.value) {
    result = result.filter(truck => truck.type === filterType.value)
  }

  // Paginate results
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages
const totalPages = computed(() => {
  if (trucks.value.length === 0) return 1
  
  // Get filtered count
  let filteredCount = getFilteredCount()
  
  return Math.ceil(filteredCount / itemsPerPage)
})

// Get filtered count for pagination
function getFilteredCount(): number {
  if (!searchQuery.value && !filterAvailability.value && !filterType.value) {
    return trucks.value.length
  }
  
  return trucks.value.filter(truck => {
    const matchesSearch = !searchQuery.value || 
      truck.registrationNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      truck.currentLocation.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesAvailability = !filterAvailability.value || truck.availability === filterAvailability.value
    const matchesType = !filterType.value || truck.type === filterType.value
    
    return matchesSearch && matchesAvailability && matchesType
  }).length
}

// Display range for pagination
const displayedRange = computed(() => {
  const filteredCount = getFilteredCount()
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, filteredCount)
  const end = Math.min(start + filteredTrucks.value.length - 1, filteredCount)
  
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

// Format truck type for display
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

// Format availability for display
function formatAvailability(availability: string): string {
  switch (availability) {
    case 'AVAILABLE':
      return 'Available'
    case 'BUSY':
      return 'Busy'
    case 'MAINTENANCE':
      return 'Maintenance'
    case 'INACTIVE':
      return 'Inactive'
    default:
      return availability
  }
}

// Get availability badge class
function getAvailabilityClass(availability: string): string {
  switch (availability) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800'
    case 'BUSY':
      return 'bg-yellow-100 text-yellow-800'
    case 'MAINTENANCE':
      return 'bg-orange-100 text-orange-800'
    case 'INACTIVE':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Format order status
function formatOrderStatus(status?: string): string {
  if (!status) return 'Active Order'
  
  switch (status) {
    case 'PENDING':
      return 'Order Pending'
    case 'ACCEPTED':
      return 'Order Accepted'
    case 'IN_TRANSIT':
      return 'In Transit'
    default:
      return 'Active Order'
  }
}

// Get order status badge class
function getOrderStatusClass(status?: string): string {
  if (!status) return 'bg-indigo-100 text-indigo-800'
  
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_TRANSIT':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-indigo-100 text-indigo-800'
  }
}

// Modal functions
function closeModal() {
  showAddTruckModal.value = false
  showEditTruckModal.value = false
  resetForm()
}

function resetForm() {
  truckForm.value = {
    id: '',
    make: '',
    model: '',
    registrationNumber: '',
    type: 'FLATBED',
    capacityTons: 0,
    year: new Date().getFullYear(),
    currentLocation: '',
    availability: 'AVAILABLE',
    description: ''
  }
  selectedTruck.value = null
  featuredImage.value = null
  galleryImages.value = []
  
  // Reset image upload components if they exist
  featuredImageUpload.value?.resetFeatured?.()
  galleryImageUpload.value?.resetGallery?.()
}

function openEditModal(truck: Truck) {
  selectedTruck.value = truck
  truckForm.value = { ...truck }
  showEditTruckModal.value = true
}

function openStatusModal(truck: Truck) {
  selectedTruck.value = truck
  newStatus.value = truck.availability
  showStatusModal.value = true
}

// Handle image updates
const handleFeaturedImageUpdate = (file: File | null) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      featuredImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    featuredImage.value = null
  }
}

const handleGalleryImagesUpdate = (files: File[]) => {
  galleryImages.value = []
  
  if (files && files.length > 0) {
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          galleryImages.value.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

const handleImageError = (error: string) => {
  console.error('Image upload error:', error)
}

// Save truck (create or update)
async function saveTruck() {
  try {
    // Basic validation
    if (!truckForm.value.make || !truckForm.value.model || !truckForm.value.registrationNumber) {
      notification.value = {
        type: 'error',
        message: 'Please fill out all required fields'
      }
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 5000)
      return;
    }
    
    if (showEditTruckModal.value && selectedTruck.value) {
      // Update existing truck
      isSaving.value = true;
      const response = await $fetch(`/api/trucks/${selectedTruck.value.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: {
          make: truckForm.value.make,
          model: truckForm.value.model,
          year: truckForm.value.year,
          capacity: truckForm.value.capacityTons,
          licensePlate: truckForm.value.registrationNumber,
          isAvailable: truckForm.value.availability === 'AVAILABLE',
          specifications: {
            type: truckForm.value.type,
            currentLocation: truckForm.value.currentLocation,
            availability: truckForm.value.availability,
            description: truckForm.value.description
          },
          featuredImage: featuredImage.value,
          galleryImages: galleryImages.value || []
        }
      });
      
      // Update local state
      const index = trucks.value.findIndex(t => t.id === selectedTruck.value!.id)
      if (index !== -1) {
        trucks.value[index] = {
          ...trucks.value[index],
          make: truckForm.value.make,
          model: truckForm.value.model,
          year: truckForm.value.year,
          capacityTons: truckForm.value.capacityTons,
          registrationNumber: truckForm.value.registrationNumber,
          type: truckForm.value.type,
          currentLocation: truckForm.value.currentLocation,
          availability: truckForm.value.availability,
          description: truckForm.value.description
        }
      }
      
      // Show success notification
      notification.value = {
        type: 'success',
        message: 'Truck updated successfully'
      }
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 5000)
      isSaving.value = false;
    } else {
      // Create new truck
      isSaving.value = true;
      
      // Prepare the request body
      const requestBody = {
        make: truckForm.value.make,
        model: truckForm.value.model,
        year: truckForm.value.year,
        capacity: truckForm.value.capacityTons,
        licensePlate: truckForm.value.registrationNumber,
        specifications: {
          type: truckForm.value.type,
          currentLocation: truckForm.value.currentLocation,
          availability: truckForm.value.availability,
          description: truckForm.value.description
        }
      };
      
      // Only add featuredImage if it exists
      if (featuredImage.value) {
        Object.assign(requestBody, { featuredImage: featuredImage.value });
      }
      
      // Only add galleryImages if they exist
      if (galleryImages.value && galleryImages.value.length > 0) {
        Object.assign(requestBody, { galleryImages: galleryImages.value });
      }
      
      console.log('Sending truck creation request with body:', JSON.stringify({
        ...requestBody,
        featuredImage: featuredImage.value ? 'Base64Image' : null,
        galleryImages: galleryImages.value && galleryImages.value.length > 0 ? `${galleryImages.value.length} images` : null
      }));
      
      const response = await $fetch('/api/trucks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: requestBody
      });
      
      if (response.exists) {
        // Show a notification that the license plate already exists
        notification.value = {
          type: 'error',
          message: `${response.message} (${response.existingTruck.make} ${response.existingTruck.model}, ${response.existingTruck.year})`
        }
        showNotification.value = true
        setTimeout(() => {
          showNotification.value = false
        }, 7000)
        isSaving.value = false;
        return;
      }
      
      if (response && response.truck) {
        // Add to local state
        const newTruck: Truck = {
          id: response.truck.id,
          make: response.truck.make,
          model: response.truck.model,
          year: response.truck.year,
          capacityTons: response.truck.capacity,
          registrationNumber: response.truck.licensePlate,
          type: response.truck.specifications?.type || 'FLATBED',
          currentLocation: response.truck.specifications?.currentLocation || '',
          availability: response.truck.specifications?.availability || 'AVAILABLE',
          description: response.truck.specifications?.description || '',
          activeOrderStatus: response.truck.activeOrderStatus,
          hasActiveOrder: response.truck.hasActiveOrder,
          activeLoadInfo: response.truck.activeLoadInfo
        }
        trucks.value.push(newTruck)
        
        // Show success notification
        notification.value = {
          type: 'success',
          message: 'Truck added successfully'
        }
        showNotification.value = true
        setTimeout(() => {
          showNotification.value = false
        }, 5000)
      }
      isSaving.value = false;
    }
    
    closeModal()
  } catch (error: any) {
    console.error('Error saving truck:', error)
    isSaving.value = false;
    
    // Show error notification
    notification.value = {
      type: 'error',
      message: error.message || 'Error saving truck'
    }
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 5000)
  }
}

// Update truck status
async function updateStatus() {
  if (!selectedTruck.value) return
  
  try {
    const truckId = selectedTruck.value.id
    isSaving.value = true
    
    // Update truck status via API
    const response = await $fetch(`/api/trucks/${truckId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: {
        specifications: {
          ...selectedTruck.value,
          availability: newStatus.value
        }
      }
    });
    
    // Update local state
    const index = trucks.value.findIndex(t => t.id === truckId)
    if (index !== -1) {
      trucks.value[index].availability = newStatus.value
    }
    
    showStatusModal.value = false
    notification.value = {
      type: 'success',
      message: 'Truck status updated successfully'
    }
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 5000)
  } catch (error) {
    console.error('Error updating truck status:', error)
    notification.value = {
      type: 'error',
      message: 'Error updating truck status'
    }
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 5000)
  } finally {
    isSaving.value = false
  }
}

// Fetch trucks data
onMounted(async () => {
  loading.value = true
  try {
    // Fetch trucks from API
    const response = await $fetch('/api/trucks', {
      query: {
        providerId: 'current' // This will be replaced with the actual user ID by the API
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response && response.trucks) {
      console.log('Trucks data received:', response.trucks)
      // Transform API data to match our Truck interface
      trucks.value = response.trucks.map((truck: any) => {
        // Extract specifications from the JSON field
        const specs = truck.specifications || {}
        
        return {
          id: truck.id,
          make: truck.make,
          model: truck.model,
          year: truck.year,
          capacityTons: truck.capacity,
          registrationNumber: truck.licensePlate,
          type: specs.type || 'FLATBED',
          currentLocation: specs.currentLocation || 'Unknown',
          availability: specs.availability || 'AVAILABLE',
          description: specs.description || '',
          activeOrderStatus: truck.activeOrderStatus,
          hasActiveOrder: truck.hasActiveOrder,
          activeLoadInfo: truck.activeLoadInfo
        }
      })
    }
  } catch (error) {
    console.error('Error fetching trucks:', error)
  } finally {
    loading.value = false
  }
})
</script> 