<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Add New Truck</h1>
        <p class="mt-1 text-sm text-gray-600">Fill out the form below to add a new truck to your fleet.</p>
      </div>
      
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <form @submit.prevent="submitForm">
            <!-- Basic Truck Information -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold mb-4">Basic Information</h2>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <!-- Truck Name -->
                <div class="sm:col-span-3">
                  <label for="name" class="block text-sm font-medium text-gray-700">Truck Name (Optional)</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="name" 
                      v-model="truckData.name" 
                      placeholder="E.g. Big Blue" 
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Give your truck a name (optional)</p>
                  <div v-if="errors.name" class="text-red-500 mt-1 text-sm">{{ errors.name }}</div>
                </div>
                
                <!-- Make -->
                <div class="sm:col-span-3">
                  <label for="make" class="block text-sm font-medium text-gray-700">Make *</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="make" 
                      v-model="truckData.make" 
                      placeholder="E.g. Volvo" 
                      required
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <div v-if="errors.make" class="text-red-500 mt-1 text-sm">{{ errors.make }}</div>
                </div>
                
                <!-- Model -->
                <div class="sm:col-span-2">
                  <label for="model" class="block text-sm font-medium text-gray-700">Model *</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="model" 
                      v-model="truckData.model" 
                      placeholder="E.g. VNL 860" 
                      required
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <div v-if="errors.model" class="text-red-500 mt-1 text-sm">{{ errors.model }}</div>
                </div>
                
                <!-- Year -->
                <div class="sm:col-span-2">
                  <label for="year" class="block text-sm font-medium text-gray-700">Year *</label>
                  <div class="mt-1">
                    <input 
                      type="number" 
                      id="year" 
                      v-model.number="truckData.year" 
                      min="1990" 
                      :max="new Date().getFullYear() + 1"
                      required
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <div v-if="errors.year" class="text-red-500 mt-1 text-sm">{{ errors.year }}</div>
                </div>
                
                <!-- Type -->
                <div class="sm:col-span-2">
                  <label for="type" class="block text-sm font-medium text-gray-700">Truck Type</label>
                  <div class="mt-1">
                    <select 
                      id="type" 
                      v-model="truckData.type" 
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="Box Truck">Box Truck</option>
                      <option value="Flatbed">Flatbed</option>
                      <option value="Refrigerated">Refrigerated</option>
                      <option value="Semi-Trailer">Semi-Trailer</option>
                      <option value="Tanker">Tanker</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Dump Truck">Dump Truck</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div v-if="errors.type" class="text-red-500 mt-1 text-sm">{{ errors.type }}</div>
                </div>
                
                <!-- Capacity -->
                <div class="sm:col-span-2">
                  <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity (tons) *</label>
                  <div class="mt-1">
                    <input 
                      type="number" 
                      id="capacity" 
                      v-model.number="truckData.capacity" 
                      min="0.1" 
                      step="0.1"
                      required
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <div v-if="errors.capacity" class="text-red-500 mt-1 text-sm">{{ errors.capacity }}</div>
                </div>
                
                <!-- License Plate -->
                <div class="sm:col-span-2">
                  <label for="licensePlate" class="block text-sm font-medium text-gray-700">License Plate *</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="licensePlate" 
                      v-model="truckData.licensePlate" 
                      placeholder="E.g. ABC123"
                      required
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <div v-if="errors.licensePlate" class="text-red-500 mt-1 text-sm">{{ errors.licensePlate }}</div>
                </div>
                
                <!-- Current Location -->
                <div class="sm:col-span-2">
                  <label for="currentLocation" class="block text-sm font-medium text-gray-700">Current Location</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="currentLocation" 
                      v-model="truckData.currentLocation" 
                      placeholder="E.g. Los Angeles, CA"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                  <div v-if="errors.currentLocation" class="text-red-500 mt-1 text-sm">{{ errors.currentLocation }}</div>
                </div>
              </div>
            </div>
            
            <!-- Featured Image Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold mb-4">Featured Image</h2>
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
            <div class="mb-8">
              <h2 class="text-lg font-semibold mb-4">Gallery Images</h2>
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
            
            <!-- Specifications Section -->
            <div class="mb-8">
              <h2 class="text-lg font-semibold mb-4">Specifications</h2>
              <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                  <label for="specifications.engineType" class="block text-sm font-medium text-gray-700">Engine Type</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="specifications.engineType" 
                      v-model="specifications.engineType" 
                      placeholder="E.g. Diesel, Electric"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                
                <div class="sm:col-span-3">
                  <label for="specifications.transmission" class="block text-sm font-medium text-gray-700">Transmission</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="specifications.transmission" 
                      v-model="specifications.transmission" 
                      placeholder="E.g. Automatic, Manual"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                
                <div class="sm:col-span-3">
                  <label for="specifications.fuelType" class="block text-sm font-medium text-gray-700">Fuel Type</label>
                  <div class="mt-1">
                    <input 
                      type="text" 
                      id="specifications.fuelType" 
                      v-model="specifications.fuelType" 
                      placeholder="E.g. Diesel, Gasoline"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                
                <div class="sm:col-span-3">
                  <label for="specifications.mileage" class="block text-sm font-medium text-gray-700">Mileage</label>
                  <div class="mt-1">
                    <input 
                      type="number" 
                      id="specifications.mileage" 
                      v-model.number="specifications.mileage" 
                      placeholder="E.g. 50000"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                
                <div class="sm:col-span-6">
                  <label for="specifications.additionalInfo" class="block text-sm font-medium text-gray-700">Additional Information</label>
                  <div class="mt-1">
                    <textarea 
                      id="specifications.additionalInfo" 
                      v-model="specifications.additionalInfo" 
                      rows="3"
                      placeholder="Any other details about the truck that may be relevant"
                      class="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-end mt-8">
              <button
                type="button"
                @click="goBack"
                class="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span v-if="isSubmitting">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
                <span v-else>Create Truck</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ImageUpload from '~/components/ImageUpload.vue'

const router = useRouter()

// Truck data object
const truckData = ref({
  name: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'Semi-Trailer',
  capacity: 0,
  licensePlate: '',
  currentLocation: '',
})

// Specifications as a separate object to make it easier to work with
const specifications = reactive({
  engineType: '',
  transmission: '',
  fuelType: '',
  mileage: null as number | null,
  additionalInfo: ''
})

// Image upload refs
const featuredImageUpload = ref<InstanceType<typeof ImageUpload> | null>(null)
const galleryImageUpload = ref<InstanceType<typeof ImageUpload> | null>(null)
const featuredImage = ref<string | null>(null)
const galleryImages = ref<string[]>([])

// Form state
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

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

// Validate truck data
const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  // Basic validations
  if (!truckData.value.make) {
    newErrors.make = 'Make is required'
  }
  
  if (!truckData.value.model) {
    newErrors.model = 'Model is required'
  }
  
  if (!truckData.value.year) {
    newErrors.year = 'Year is required'
  } else if (truckData.value.year < 1900 || truckData.value.year > new Date().getFullYear() + 1) {
    newErrors.year = 'Please enter a valid year'
  }
  
  if (!truckData.value.capacity) {
    newErrors.capacity = 'Capacity is required'
  } else if (truckData.value.capacity <= 0) {
    newErrors.capacity = 'Capacity must be greater than 0'
  }
  
  if (!truckData.value.licensePlate) {
    newErrors.licensePlate = 'License plate is required'
  }
  
  // At least a featured image is required
  if (!featuredImage.value && galleryImages.value.length === 0) {
    newErrors.featuredImage = 'Please upload at least a featured image or gallery images'
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    // Scroll to the first error
    const firstError = document.querySelector('.text-red-500')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Prepare specifications object
    const specObject: Record<string, any> = {}
    
    if (specifications.engineType) specObject.engineType = specifications.engineType
    if (specifications.transmission) specObject.transmission = specifications.transmission
    if (specifications.fuelType) specObject.fuelType = specifications.fuelType
    if (specifications.mileage) specObject.mileage = specifications.mileage
    if (specifications.additionalInfo) specObject.additionalInfo = specifications.additionalInfo
    
    // Create data object to send
    const submitData = {
      ...truckData.value,
      specifications: specObject,
      featuredImage: featuredImage.value,
      galleryImages: galleryImages.value
    }
    
    // Send data to API
    const response = await $fetch('/api/trucks', {
      method: 'POST',
      body: submitData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    // Navigate to truck detail page
    router.push(`/dashboard/truck-provider/my-trucks/${response.truck.id}`)
  } catch (error: any) {
    console.error('Error creating truck:', error)
    
    // Handle API errors
    if (error.response && error.response._data) {
      alert(`Error: ${error.response._data.message || 'Failed to create truck'}`)
    } else {
      alert('Failed to create truck. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Navigation
const goBack = () => {
  router.back()
}
</script> 