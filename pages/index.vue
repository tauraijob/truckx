<template>
  <div>
    <!-- Hero Section with Sliding Images -->
    <div class="relative bg-gradient-to-br from-[#004080] to-[#001a33] overflow-hidden h-[500px]">
      <!-- Sliding Images Background -->
      <div class="absolute inset-0 z-0">
        <div class="relative h-full">
          <div v-for="(image, index) in slides" :key="index"
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }">
            <img :src="image.image" :alt="image.alt" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-[#004080]/85 to-[#001a33]/70"></div>
          </div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 h-full flex items-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="text-center pt-20">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              Connect Your Cargo<br />
              with Reliable<br />
              Transport
            </h1>
            <p class="text-xl text-gray-200 max-w-3xl mx-auto mb-12">
              Find the perfect truck for your load or connect with reliable carriers. 
              Streamline your logistics with our trusted platform.
            </p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center">
              <NuxtLink to="/auth/register?role=truck-provider"
                class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0060df] transition-colors">
                Register as Truck Provider
              </NuxtLink>
              <NuxtLink to="/auth/register?role=load-provider"
                class="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors">
                Register as Load Provider
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Trucks Section -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-[#0070f3] font-semibold tracking-wide uppercase">Available Trucks</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find the right truck for your load
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our selection of available trucks from verified providers.
          </p>
        </div>
        <div class="mt-12">
          <div v-if="isLoadingTrucks" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="bg-white overflow-hidden shadow-lg rounded-xl transition-all">
              <div class="animate-pulse">
                <div class="relative h-52 bg-gray-200"></div>
                <div class="p-6">
                  <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div class="mt-4 space-y-4">
                    <div class="flex items-center">
                      <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                      <div class="h-4 bg-gray-200 rounded w-2/5"></div>
                    </div>
                    <div class="flex items-center">
                      <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                      <div class="h-4 bg-gray-200 rounded w-3/5"></div>
                    </div>
                  </div>
                  <div class="mt-4 flex">
                    <div class="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="truckError" class="text-center py-8">
            <p class="text-red-500">{{ truckError }}</p>
            <button @click="fetchTrucks" class="mt-4 px-4 py-2 bg-[#0070f3] text-white rounded hover:bg-[#0050b3]">
              Try Again
            </button>
          </div>

          <div v-else-if="trucks.length === 0" class="text-center py-8">
            <p class="text-gray-500">No available trucks found at the moment.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="truck in trucks" :key="truck.id" class="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div class="relative h-52">
                <img :src="truck.imageUrl" :alt="truck.name" class="w-full h-full object-cover" />
                <div class="absolute top-4 right-4 bg-[#0070f3] text-white text-xs font-bold px-2 py-1 rounded-full">
                  Available Now
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900">{{ truck.name }}</h3>
                <div class="mt-2 flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>Capacity: {{ truck.capacity }} {{ truck.capacityUnit }}</span>
                </div>
                <div class="mt-2 flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Location: {{ truck.location }}</span>
                </div>
                <div class="mt-4">
                  <button 
                    class="inline-flex items-center text-[#0070f3] hover:text-[#0050b3] font-medium"
                    @click="openTruckModal(truck)"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 text-center">
            <NuxtLink to="/auth/login?redirect=/dashboard/available-trucks"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-[#0070f3] hover:bg-[#0050b3] transition-colors">
              View All Available Trucks
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Loads Section -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-[#0070f3] font-semibold tracking-wide uppercase">Available Loads</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find loads for your trucks
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our selection of available loads from verified providers.
          </p>
        </div>
        <div class="mt-12">
          <div v-if="isLoadingLoads" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all p-6">
              <div class="animate-pulse">
                <div class="flex justify-between">
                  <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div class="h-6 bg-blue-100 rounded-full w-20"></div>
                </div>
                <div class="mt-4 space-y-4">
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-2/5"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-3/5"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                  <div class="h-6 bg-blue-100 rounded w-20"></div>
                  <div class="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="loadError" class="text-center py-8">
            <p class="text-red-500">{{ loadError }}</p>
            <button @click="fetchLoads" class="mt-4 px-4 py-2 bg-[#0070f3] text-white rounded hover:bg-[#0050b3]">
              Try Again
            </button>
          </div>

          <div v-else-if="loads.length === 0" class="text-center py-8">
            <p class="text-gray-500">No available loads found at the moment.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="load in loads" :key="load.id" class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div class="relative h-52">
                <img :src="(load.images && load.images.length > 0) ? load.images[0] : '/images/load-placeholder.webp'" :alt="load.name" class="w-full h-full object-cover" />
                <div class="absolute top-4 right-4 bg-[#0070f3] text-white text-xs font-bold px-2 py-1 rounded-full">
                  Available
                </div>
              </div>
              <div class="p-6">
                <div class="flex justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">{{ load.name }}</h3>
                  <span class="bg-blue-100 text-[#0070f3] text-xs px-2 py-1 rounded-full font-medium flex items-center">
                    {{ load.status }}
                  </span>
                </div>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span>Weight: {{ load.weight }} {{ load.weightUnit }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Pickup: {{ formatDate(load.pickupDate) }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>From: {{ load.origin }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>To: {{ load.destination }}</span>
                  </div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                  <p class="text-[#0070f3] font-semibold text-lg">${{ formatPrice(load.price) }}</p>
                  <button 
                    class="inline-flex items-center text-[#0070f3] hover:text-[#0050b3] font-medium"
                    @click="openLoadModal(load)"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 text-center">
            <NuxtLink to="/auth/login?redirect=/dashboard/available-loads"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-[#0070f3] hover:bg-[#0050b3] transition-colors">
              View All Available Loads
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge Base / How To Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">How It Works</h2>
          <p class="mt-4 text-lg text-gray-600">Simple steps to get started with TruckX</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white mb-4">
              <span class="text-xl font-bold">1</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Create Your Account</h3>
            <p class="text-gray-600">
              Sign up as either a truck provider or load provider. Complete your profile with necessary details and documentation.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white mb-4">
              <span class="text-xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">List Your Resources</h3>
            <p class="text-gray-600">
              Truck providers can list their available vehicles, while load providers can post their cargo requirements.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white mb-4">
              <span class="text-xl font-bold">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Connect and Transport</h3>
            <p class="text-gray-600">
              Browse available matches, communicate with potential partners, and complete your transport needs efficiently.
            </p>
          </div>
        </div>

        <!-- Additional Resources -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- For Truck Providers -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">For Truck Providers</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="h-6 w-6 text-[#0070f3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Create detailed truck profiles with specifications and availability</span>
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-[#0070f3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Browse and bid on available loads</span>
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-[#0070f3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Manage your fleet and track deliveries</span>
              </li>
            </ul>
          </div>

          <!-- For Load Providers -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">For Load Providers</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="h-6 w-6 text-[#0070f3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Post your cargo requirements with detailed specifications</span>
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-[#0070f3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Compare and select from available truck providers</span>
              </li>
              <li class="flex items-start">
                <svg class="h-6 w-6 text-[#0070f3] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Track your shipments in real-time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Truck Detail Modal -->
    <Modal v-model="showTruckModal" title="Truck Details" :show-primary-button="false" secondary-button-text="Close">
      <TruckDetailModal :truck="selectedTruck" />
    </Modal>
    
    <!-- Load Detail Modal -->
    <Modal v-model="showLoadModal" title="Load Details" :show-primary-button="false" secondary-button-text="Close">
      <LoadDetailModal :load="selectedLoad" />
    </Modal>

    <!-- Quick Links -->
    <div>
      <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">Quick Links</h3>
      <ul class="mt-4 space-y-4">
        <li>
          <NuxtLink to="/auth/login" class="text-base text-gray-300 hover:text-white">
            Login
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/auth/register" class="text-base text-gray-300 hover:text-white">
            Register
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/dashboard" class="text-base text-gray-300 hover:text-white">
            Dashboard
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Modal from '~/components/Modal.vue'
import TruckDetailModal from '~/components/TruckDetailModal.vue'
import LoadDetailModal from '~/components/LoadDetailModal.vue'
import LoadImageGallery from '~/components/LoadImageGallery.vue'

// Slideshow data
const slides = [
  { image: '/images/truckx-slide.webp', alt: 'Truck on the highway' },
  { image: '/images/truckx-slide2.jpg', alt: 'Logistics warehouse' },
  { image: '/images/truckx-slide3.jpg', alt: 'Delivery truck' }
]

const currentSlide = ref(0)
let slideshowInterval: NodeJS.Timeout | null = null

// Auto-advance slideshow
const startSlideshow = () => {
  slideshowInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000) // Change slide every 5 seconds
}

// Clean up interval on component unmount
onMounted(() => {
  startSlideshow()
  fetchLoads()
  fetchTrucks()
})

onUnmounted(() => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval)
  }
})

// Load data management
const loads = ref<any[]>([])
const isLoadingLoads = ref(true)
const loadError = ref<string | null>(null)

const fetchLoads = async () => {
  isLoadingLoads.value = true
  loadError.value = null
  
  try {
    const response = await fetch('/api/public/loads?limit=3')
    
    if (!response.ok) {
      throw new Error('Failed to fetch loads')
    }
    
    const data = await response.json()
    loads.value = data.loads || []
  } catch (error) {
    console.error('Error fetching loads:', error)
    loadError.value = 'Unable to load data. Please try again later.'
    
    // Fallback to demo data if in development
    if (process.env.NODE_ENV === 'development') {
      loads.value = [
        {
          id: 'demo1',
          name: 'Electronics Shipment',
          status: 'Available',
          weight: 5,
          weightUnit: 'tons',
          pickupDate: '2023-02-15',
          origin: 'San Francisco, CA',
          destination: 'Seattle, WA',
          price: 2500
        },
        {
          id: 'demo2',
          name: 'Furniture Delivery',
          status: 'Available',
          weight: 3,
          weightUnit: 'tons',
          pickupDate: '2023-02-18',
          origin: 'Miami, FL',
          destination: 'Atlanta, GA',
          price: 1800
        },
        {
          id: 'demo3',
          name: 'Agricultural Products',
          status: 'Available',
          weight: 12,
          weightUnit: 'tons',
          pickupDate: '2023-02-22',
          origin: 'Dallas, TX',
          destination: 'Houston, TX',
          price: 3200
        }
      ]
    }
  } finally {
    isLoadingLoads.value = false
  }
}

// Truck data management
const trucks = ref<any[]>([])
const isLoadingTrucks = ref(true)
const truckError = ref<string | null>(null)

const fetchTrucks = async () => {
  isLoadingTrucks.value = true
  truckError.value = null
  
  try {
    const response = await fetch('/api/public/trucks?limit=3')
    
    if (!response.ok) {
      throw new Error('Failed to fetch trucks')
    }
    
    const data = await response.json()
    trucks.value = data.trucks || []
  } catch (error) {
    console.error('Error fetching trucks:', error)
    truckError.value = 'Unable to load truck data. Please try again later.'
    
    // Fallback to demo data
    trucks.value = [
      {
        id: 'demo1',
        name: 'Volvo VNL 760',
        make: 'Volvo',
        model: 'VNL 760',
        year: 2023,
        capacity: 40000,
        capacityUnit: 'lbs',
        location: 'Chicago, IL',
        imageUrl: 'https://placehold.co/600x400?text=Volvo+Truck'
      },
      {
        id: 'demo2',
        name: 'Peterbilt 389',
        make: 'Peterbilt',
        model: '389',
        year: 2022,
        capacity: 45000,
        capacityUnit: 'lbs',
        location: 'Dallas, TX',
        imageUrl: 'https://placehold.co/600x400?text=Peterbilt+Truck'
      },
      {
        id: 'demo3',
        name: 'Freightliner Cascadia',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2023,
        capacity: 42000,
        capacityUnit: 'lbs',
        location: 'Atlanta, GA',
        imageUrl: 'https://placehold.co/600x400?text=Freightliner+Truck'
      }
    ]
  } finally {
    isLoadingTrucks.value = false
  }
}

// Modal handling
const showTruckModal = ref(false)
const showLoadModal = ref(false)
const selectedTruck = ref(null)
const selectedLoad = ref(null)

function openTruckModal(truck: any) {
  selectedTruck.value = truck
  showTruckModal.value = true
}

function openLoadModal(load: any) {
  selectedLoad.value = load
  showLoadModal.value = true
}

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date)
}

const formatPrice = (price: number) => {
  if (!price && price !== 0) return 'N/A'
  return price.toLocaleString('en-US')
}
</script>