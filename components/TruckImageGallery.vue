<template>
  <div class="truck-image-gallery">
    <!-- Main image display -->
    <div class="relative h-48 md:h-64 lg:h-80 xl:h-96 w-full mb-2 rounded-lg overflow-hidden bg-gray-100">
      <img v-if="images && images.length > 0" 
        :src="images[currentImageIndex]" 
        :alt="alt || 'Truck image'" 
        class="w-full h-full object-cover max-w-full max-h-[60vw]" />
      
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Navigation buttons (only if more than one image) -->
      <template v-if="images && images.length > 1">
        <button @click="prevImage" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 focus:outline-none hover:bg-black/70">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="nextImage" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 focus:outline-none hover:bg-black/70">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>
    </div>
    
    <!-- Thumbnails (only if more than one image) -->
    <div v-if="images && images.length > 1" class="flex space-x-2 overflow-x-auto">
      <button 
        v-for="(image, index) in images" 
        :key="index"
        @click="currentImageIndex = index"
        class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden focus:outline-none"
        :class="{'ring-2 ring-[#0070f3]': currentImageIndex === index}">
        <img :src="image" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => []
  },
  alt: {
    type: String,
    default: 'Truck image'
  }
})

const currentImageIndex = ref(0)

// Reset the index when images change
watch(() => props.images, () => {
  currentImageIndex.value = 0
})

// Navigation methods
const nextImage = () => {
  if (!props.images || props.images.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
}

const prevImage = () => {
  if (!props.images || props.images.length <= 1) return
  currentImageIndex.value = (currentImageIndex.value - 1 + props.images.length) % props.images.length
}
</script> 