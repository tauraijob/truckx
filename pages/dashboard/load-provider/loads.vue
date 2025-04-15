<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">My Loads</h1>
      <button
        @click="showAddLoadModal = true"
        class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
      >
        <PlusIcon class="mr-2 h-5 w-5" />
        Add New Load
      </button>
    </div>

    <!-- Add/Edit Load Modal -->
    <div v-if="showAddLoadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl">
          <div class="flex items-center">
            <CubeIcon class="h-7 w-7 text-white mr-3" />
            <h3 class="text-2xl font-semibold text-white">{{ editingLoad ? 'Edit Load Details' : 'Add New Load' }}</h3>
          </div>
          <button @click="closeModal" class="text-white hover:text-gray-200 p-2 hover:bg-primary-800 rounded-lg transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
          <!-- Basic Information Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <InformationCircleIcon class="h-5 w-5 text-primary-500 mr-2" />
              Basic Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="space-y-2">
                <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                <div class="relative">
                  <input
                    id="title"
                    v-model="formData.title"
                    type="text"
                    required
                    placeholder="e.g. Furniture Shipment"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <DocumentTextIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                <div class="relative">
                  <select
                    id="type"
                    v-model="formData.type"
                    required
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 bg-white transition-all duration-200"
                  >
                    <option value="">Select Type</option>
                    <option value="General Cargo">General Cargo</option>
                    <option value="Fragile Goods">Fragile Goods</option>
                    <option value="Hazardous Materials">Hazardous Materials</option>
                    <option value="Refrigerated">Refrigerated</option>
                    <option value="Oversized">Oversized</option>
                  </select>
                  <TagIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <!-- Load Specifications Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <ScaleIcon class="h-5 w-5 text-primary-500 mr-2" />
              Load Specifications
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="space-y-2">
                <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <div class="relative">
                  <input
                    id="weight"
                    v-model.number="formData.weight"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <ScaleIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="volume" class="block text-sm font-medium text-gray-700">Volume (m³)</label>
                <div class="relative">
                  <input
                    id="volume"
                    v-model.number="formData.volume"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <CubeIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <!-- Route Information Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <MapIcon class="h-5 w-5 text-primary-500 mr-2" />
              Route Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="space-y-2">
                <label for="pickupLocation" class="block text-sm font-medium text-gray-700">Pickup Location</label>
                <div class="relative">
                  <input
                    id="pickupLocation"
                    v-model="formData.pickupLocation"
                    type="text"
                    required
                    placeholder="e.g. New York, NY"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <MapPinIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="deliveryLocation" class="block text-sm font-medium text-gray-700">Delivery Location</label>
                <div class="relative">
                  <input
                    id="deliveryLocation"
                    v-model="formData.deliveryLocation"
                    type="text"
                    required
                    placeholder="e.g. Boston, MA"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <MapPinIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="distance" class="block text-sm font-medium text-gray-700">Distance (km)</label>
                <div class="relative">
                  <input
                    id="distance"
                    v-model.number="formData.distance"
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm h-12 pl-4 pr-12 transition-all duration-200"
                  />
                  <ArrowsRightLeftIcon class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div class="space-y-2">
                <label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                <div class="relative">
                  <input
                    id="price"
                    v-model.number="formData.price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
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
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="4"
                required
                placeholder="Enter detailed information about the load, special handling requirements, etc..."
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
            <p class="mb-4 text-sm text-gray-600">Upload a main image that will be displayed prominently for your load</p>
            
            <ImageUpload 
              ref="featuredImageUpload"
              mode="featured"
              @update:featured="handleFeaturedImageUpdate"
              @error="handleImageError"
            />
            
            <div v-if="imageErrors.featuredImage" class="text-red-500 mt-2 text-sm">{{ imageErrors.featuredImage }}</div>
          </div>
          
          <!-- Gallery Images Section -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 class="text-base font-medium text-gray-900 mb-6 flex items-center">
              <PhotoIcon class="h-5 w-5 text-primary-500 mr-2" />
              Gallery Images
            </h4>
            <p class="mb-4 text-sm text-gray-600">Add additional images to showcase your load's items (up to 7 images)</p>
            
            <ImageUpload 
              ref="galleryImageUpload"
              mode="gallery"
              :maxGalleryImages="7"
              @update:gallery="handleGalleryImagesUpdate"
              @error="handleImageError"
            />
            
            <div v-if="imageErrors.galleryImages" class="text-red-500 mt-2 text-sm">{{ imageErrors.galleryImages }}</div>
          </div>

          <!-- Modal Footer -->
          <div class="px-8 py-6 bg-gray-50 flex justify-end space-x-4 rounded-b-xl border-t border-gray-200 -mx-8 -mb-8">
            <button
              type="button"
              @click="closeModal"
              class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <XMarkIcon class="h-5 w-5 mr-2 text-gray-400" />
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <CheckIcon class="h-5 w-5 mr-2" />
              {{ loading ? 'Saving...' : (editingLoad ? 'Update Load' : 'Add Load') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Load Details Modal -->
    <div v-if="showLoadDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">Load Details</h3>
          <button @click="showLoadDetailsModal = false" class="text-gray-400 hover:text-gray-500">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <div v-if="selectedLoad" class="p-6">
          <!-- Load Image Gallery -->
          <LoadImageGallery 
            :images="getLoadImages(selectedLoad)" 
            :alt="selectedLoad.title" 
          />
          
          <div class="mt-6">
            <h3 class="text-xl font-bold text-gray-900">{{ selectedLoad.title }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ selectedLoad.type }}</p>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Weight</p>
              <p class="text-base font-medium text-gray-900">{{ selectedLoad.weight }} kg</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Volume</p>
              <p class="text-base font-medium text-gray-900">{{ selectedLoad.volume }} m³</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Pickup Location</p>
              <p class="text-base font-medium text-gray-900">{{ selectedLoad.pickupLocation }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Delivery Location</p>
              <p class="text-base font-medium text-gray-900">{{ selectedLoad.deliveryLocation }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Distance</p>
              <p class="text-base font-medium text-gray-900">{{ selectedLoad.distance }} km</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Price</p>
              <p class="text-base font-medium text-gray-900">${{ selectedLoad.price.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class="inline-flex rounded-full px-3 py-1 text-xs font-medium mt-1" :class="getStatusClass(selectedLoad.isAvailable, selectedLoad.activeOrderStatus)">
                {{ formatStatus(selectedLoad.isAvailable, selectedLoad.activeOrderStatus) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Created</p>
              <p class="text-base font-medium text-gray-900">{{ formatDate(selectedLoad.createdAt) }}</p>
            </div>
          </div>
          
          <div class="mt-6">
            <p class="text-sm text-gray-500">Description</p>
            <p class="mt-2 text-sm text-gray-600">{{ selectedLoad.description }}</p>
          </div>
          
          <div class="mt-6 flex justify-end space-x-4">
            <button 
              v-if="selectedLoad.isAvailable && !selectedLoad.activeOrderStatus"
              @click="editLoad(selectedLoad); showLoadDetailsModal = false"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <PencilIcon class="h-5 w-5 mr-2 text-gray-500" />
              Edit Load
            </button>
            <button 
              @click="showLoadDetailsModal = false"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              <XMarkIcon class="h-5 w-5 mr-2" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search loads by title, origin, or destination..."
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
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="pending">Order Pending</option>
          <option value="accepted">Order Accepted</option>
          <option value="in_transit">In Transit</option>
        </select>
      </div>
    </div>

    <!-- Loads Table -->
    <div class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load Information</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Dates</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="load in filteredLoads" :key="load.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-md overflow-hidden">
                    <img 
                      v-if="getLoadImages(load).length > 0" 
                      :src="getLoadImages(load)[0]" 
                      alt="Load image" 
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                      <CubeIcon class="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ load.title }}</div>
                  <div class="text-xs text-gray-500">{{ load.type }} • {{ load.weight }}kg</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center text-sm text-gray-900">
                <MapPinIcon class="mr-1 h-4 w-4 text-gray-400" />
                {{ load.pickupLocation }} → {{ load.deliveryLocation }}
              </div>
              <div class="text-xs text-gray-500">{{ load.distance }}km</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div>Pickup: {{ formatDate(load.createdAt) }}</div>
              <div>Delivery: {{ formatDate(load.createdAt) }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">${{ load.price.toFixed(2) }}</div>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusClass(load.isAvailable, load.activeOrderStatus)">
                {{ formatStatus(load.isAvailable, load.activeOrderStatus) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button 
                  @click="openLoadDetails(load)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-blue-600"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="load.isAvailable && !load.activeOrderStatus"
                  @click="editLoad(load)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-indigo-600"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="load.isAvailable && !load.activeOrderStatus"
                  @click="deleteLoad(load.id)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredLoads.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No loads found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ loads.length }} loads
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  CubeIcon,
  MapPinIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ScaleIcon,
  MapIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  CheckIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import ImageUpload from '~/components/ImageUpload.vue'
import LoadImageGallery from '~/components/LoadImageGallery.vue'

definePageMeta({
  layout: 'load-provider-dashboard',
  middleware: ['auth']
})

// Load interface
interface Load {
  id: string;
  title: string;
  type: string;
  weight: number;
  volume: number;
  description: string;
  pickupLocation: string;
  deliveryLocation: string;
  distance: number;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  activeOrderStatus?: string;
  images?: string[];
  specifications?: any;
}

// Pagination and filters
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('')
const filterStatus = ref('')

// Loads data and loading state
const loads = ref<Load[]>([])
const loading = ref(true)

// Modal states
const showAddLoadModal = ref(false)
const showLoadDetailsModal = ref(false)
const editingLoad = ref<Load | null>(null)
const formData = ref({
  title: '',
  type: '',
  weight: 0,
  volume: 0,
  description: '',
  pickupLocation: '',
  deliveryLocation: '',
  distance: 0,
  price: 0,
  specifications: {}
})

// Image handling refs
const featuredImageUpload = ref<InstanceType<typeof ImageUpload> | null>(null)
const galleryImageUpload = ref<InstanceType<typeof ImageUpload> | null>(null)
const featuredImage = ref<string | null>(null)
const galleryImages = ref<string[]>([])
const imageErrors = ref({
  featuredImage: '',
  galleryImages: ''
})

// Add these changes below the modal states
const selectedLoad = ref<Load | null>(null)

// Filter loads
const filteredLoads = computed(() => {
  let result = loads.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(load => 
      load.title.toLowerCase().includes(query) ||
      load.pickupLocation.toLowerCase().includes(query) ||
      load.deliveryLocation.toLowerCase().includes(query) ||
      load.type.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filterStatus.value) {
    switch (filterStatus.value) {
      case 'available':
        result = result.filter(load => load.isAvailable && !load.activeOrderStatus)
        break
      case 'unavailable':
        result = result.filter(load => !load.isAvailable && !load.activeOrderStatus)
        break
      case 'pending':
        result = result.filter(load => load.activeOrderStatus === 'PENDING')
        break
      case 'accepted':
        result = result.filter(load => load.activeOrderStatus === 'ACCEPTED')
        break
      case 'in_transit':
        result = result.filter(load => load.activeOrderStatus === 'IN_TRANSIT')
        break
    }
  }

  // Paginate results
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages
const totalPages = computed(() => {
  if (loads.value.length === 0) return 1
  
  // Get filtered count
  let filteredCount = getFilteredCount()
  
  return Math.ceil(filteredCount / itemsPerPage)
})

// Get filtered count for pagination
function getFilteredCount(): number {
  if (!searchQuery.value && !filterStatus.value) {
    return loads.value.length
  }
  
  return loads.value.filter(load => {
    const matchesSearch = !searchQuery.value || 
      load.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.pickupLocation.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.deliveryLocation.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      load.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    let matchesStatus = true
    if (filterStatus.value) {
      switch (filterStatus.value) {
        case 'available':
          matchesStatus = load.isAvailable && !load.activeOrderStatus
          break
        case 'unavailable':
          matchesStatus = !load.isAvailable && !load.activeOrderStatus
          break
        case 'pending':
          matchesStatus = load.activeOrderStatus === 'PENDING'
          break
        case 'accepted':
          matchesStatus = load.activeOrderStatus === 'ACCEPTED'
          break
        case 'in_transit':
          matchesStatus = load.activeOrderStatus === 'IN_TRANSIT'
          break
      }
    }
    
    return matchesSearch && matchesStatus
  }).length
}

// Display range for pagination
const displayedRange = computed(() => {
  const filteredCount = getFilteredCount()
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, filteredCount)
  const end = Math.min(start + filteredLoads.value.length - 1, filteredCount)
  
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

// Format status based on isAvailable and activeOrderStatus
function formatStatus(isAvailable: boolean, activeOrderStatus?: string): string {
  if (activeOrderStatus) {
    switch (activeOrderStatus) {
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
  return isAvailable ? 'Available' : 'Unavailable'
}

// Get status badge class
function getStatusClass(isAvailable: boolean, activeOrderStatus?: string): string {
  if (activeOrderStatus) {
    switch (activeOrderStatus) {
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
  return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

// Modal functions
function openLoadDetails(load: Load) {
  selectedLoad.value = load
  showLoadDetailsModal.value = true
}

// Fetch loads
async function fetchLoads() {
  try {
    loading.value = true
    
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }
    
    console.log('Fetching loads with token:', token ? 'Token exists' : 'No token')
    
    const { data, error } = await useFetch('/api/loads', {
      query: {
        providerId: 'current' // This will be replaced with the actual user ID by the API
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (error.value) {
      console.error('Error fetching loads:', error.value)
      alert(`Failed to fetch loads: ${error.value.message || 'Unknown error'}`)
      return
    }
    
    console.log('API response:', data.value)
    
    if (data.value && data.value.loads) {
      console.log(`Found ${data.value.loads.length} loads`)
      loads.value = data.value.loads
      
      // If we've added a load but it's not showing, try to reset filters
      if (loads.value.length === 0) {
        console.log('No loads found, clearing filters')
        searchQuery.value = ''
        filterStatus.value = ''
      }
    } else {
      console.error('Invalid response format:', data.value)
      loads.value = []
    }
  } catch (error) {
    console.error('Error fetching loads:', error)
    alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
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
  if (error.includes('featured')) {
    imageErrors.value.featuredImage = error
  } else {
    imageErrors.value.galleryImages = error
  }
}

// Handle form submission
async function handleSubmit() {
  try {
    loading.value = true
    
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You are not authenticated. Please log in again.')
      return
    }
    
    // Log the form data to debug issues
    console.log('Form data before processing:', JSON.stringify(formData.value, null, 2))
    
    // Validate required fields on the client side
    const requiredFields = ['title', 'description', 'weight', 'volume', 'pickupLocation', 
                           'deliveryLocation', 'distance', 'price', 'type']
    
    const missingFields = requiredFields.filter(field => {
      const value = formData.value[field]
      return value === undefined || value === null || value === '' || 
        (typeof value === 'number' && (isNaN(value) || value <= 0))
    })
    
    if (missingFields.length > 0) {
      console.error('Missing or invalid fields:', missingFields)
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }
    
    // Ensure specifications is a valid object
    if (!formData.value.specifications) {
      formData.value.specifications = {}
    }
    
    // Convert number fields to actual numbers (in case they're strings)
    const apiFormData = {
      title: formData.value.title,
      description: formData.value.description,
      weight: Number(formData.value.weight),
      volume: Number(formData.value.volume),
      pickupLocation: formData.value.pickupLocation,
      deliveryLocation: formData.value.deliveryLocation,
      distance: Number(formData.value.distance),
      price: Number(formData.value.price),
      type: formData.value.type,
      specifications: formData.value.specifications || {}
    }
    
    // Add images if they exist
    if (featuredImage.value) {
      Object.assign(apiFormData, { featuredImage: featuredImage.value });
    }
    
    if (galleryImages.value && galleryImages.value.length > 0) {
      Object.assign(apiFormData, { galleryImages: galleryImages.value });
    }
    
    console.log('Form data after processing for API:', JSON.stringify({
      ...apiFormData,
      featuredImage: featuredImage.value ? 'Base64Image' : null,
      galleryImages: galleryImages.value && galleryImages.value.length > 0 ? `${galleryImages.value.length} images` : null
    }, null, 2))
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    
    if (editingLoad.value) {
      // Update existing load
      const { data, error } = await useFetch(`/api/loads/${editingLoad.value.id}`, {
        method: 'PUT',
        body: apiFormData,
        headers
      })
      
      if (error.value) {
        console.error('Error updating load:', error.value)
        alert(`Failed to update load: ${error.value.message || 'Unknown error'}`)
        return
      }
      
      console.log('Load updated successfully:', data.value)
    } else {
      // Create new load
      const { data, error } = await useFetch('/api/loads', {
        method: 'POST',
        body: apiFormData,
        headers
      })
      
      if (error.value) {
        console.error('Error creating load:', error.value)
        alert(`Failed to create load: ${error.value.message || 'Unknown error'}`)
        return
      }
      
      console.log('Load created successfully:', data.value)
    }
    await fetchLoads()
    closeModal()
  } catch (error) {
    console.error('Error saving load:', error)
    alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
}

// Close modal and reset form
function closeModal() {
  showAddLoadModal.value = false
  editingLoad.value = null
  formData.value = {
    title: '',
    type: '',
    weight: 0,
    volume: 0,
    description: '',
    pickupLocation: '',
    deliveryLocation: '',
    distance: 0,
    price: 0,
    specifications: {}
  }
  // Reset image values
  featuredImage.value = null
  galleryImages.value = []
  imageErrors.value = {
    featuredImage: '',
    galleryImages: ''
  }
  
  // Reset image upload components if they exist
  featuredImageUpload.value?.resetFeatured?.()
  galleryImageUpload.value?.resetGallery?.()
}

// Edit load
function editLoad(load: Load) {
  editingLoad.value = load
  formData.value = {
    title: load.title,
    type: load.type,
    weight: load.weight,
    volume: load.volume,
    description: load.description,
    pickupLocation: load.pickupLocation,
    deliveryLocation: load.deliveryLocation,
    distance: load.distance,
    price: load.price,
    specifications: load.specifications ? {...load.specifications} : {}
  }
  
  // Set images if present
  const loadImages = getLoadImages(load);
  if (loadImages.length > 0) {
    // The first image is the featured image
    featuredImage.value = loadImages[0];
    
    // Additional images are gallery images
    if (loadImages.length > 1) {
      galleryImages.value = loadImages.slice(1);
    }
  }
  
  showAddLoadModal.value = true
}

// Delete load
async function deleteLoad(id: string) {
  if (!confirm('Are you sure you want to delete this load?')) return
  
  try {
    loading.value = true
    
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You are not authenticated. Please log in again.')
      return
    }
    
    const { error } = await useFetch(`/api/loads/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (error.value) {
      console.error('Error deleting load:', error.value)
      alert(`Failed to delete load: ${error.value.message || 'Unknown error'}`)
      return
    }
    
    await fetchLoads()
  } catch (error) {
    console.error('Error deleting load:', error)
    alert(`An unexpected error occurred: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchLoads()
})

// Add this helper function to get images from either source
function getLoadImages(load: Load): string[] {
  if (!load) return [];
  
  // First try to get images from the images field (after migration)
  if (load.images && Array.isArray(load.images) && load.images.length > 0) {
    return load.images;
  }
  
  // If not present, try to get from specifications._images (before migration)
  if (load.specifications && typeof load.specifications === 'object' && 
      '_images' in load.specifications && 
      Array.isArray(load.specifications._images)) {
    return load.specifications._images as string[];
  }
  
  // Default empty array if no images found
  return [];
}
</script>