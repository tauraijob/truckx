<template>
  <div class="load-image-gallery">
    <!-- Main image display -->
    <div class="relative overflow-hidden rounded-lg h-64 bg-gray-100">
      <img 
        v-if="displayedImage" 
        :src="displayedImage" 
        :alt="alt" 
        class="w-full h-full object-cover"
      />
      
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <CubeIcon class="h-12 w-12 text-gray-400 mx-auto" />
          <p class="mt-2 text-sm text-gray-500">No images available</p>
        </div>
      </div>
      
      <!-- Navigation buttons -->
      <div v-if="safeImages.length > 1" class="absolute inset-0 flex items-center justify-between">
        <button 
          @click="prevImage" 
          class="p-1 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100 ml-2 focus:outline-none"
        >
          <ChevronLeftIcon class="h-6 w-6" />
        </button>
        
        <button 
          @click="nextImage" 
          class="p-1 rounded-full bg-white bg-opacity-75 text-gray-800 hover:bg-opacity-100 mr-2 focus:outline-none"
        >
          <ChevronRightIcon class="h-6 w-6" />
        </button>
      </div>
      
      <!-- Image counter badge -->
      <div v-if="safeImages.length > 0" class="absolute bottom-2 right-2">
        <span class="px-2 py-1 text-xs font-medium rounded-full bg-black bg-opacity-60 text-white">
          {{ currentIndex + 1 }} / {{ safeImages.length }}
        </span>
      </div>
    </div>
    
    <!-- Thumbnails -->
    <div v-if="safeImages.length > 1" class="mt-2 flex space-x-2 overflow-x-auto pb-2">
      <button 
        v-for="(image, index) in safeImages" 
        :key="index"
        @click="currentIndex = index"
        class="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden"
        :class="{ 'ring-2 ring-primary-500': currentIndex === index }"
      >
        <img :src="image" :alt="`${alt} thumbnail ${index + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, CubeIcon } from '@heroicons/vue/24/outline'

interface Props {
  images: string[];
  alt: string;
}

const props = defineProps<Props>()

// Make sure images is never undefined
const safeImages = computed(() => props.images || [])

const currentIndex = ref(0)

// Reset current index when images change
watch(() => safeImages.value, (newImages) => {
  if (newImages.length > 0) {
    currentIndex.value = 0
  }
}, { deep: true })

const displayedImage = computed(() => {
  if (safeImages.value.length === 0) return null
  return safeImages.value[currentIndex.value]
})

function nextImage() {
  if (safeImages.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % safeImages.value.length
}

function prevImage() {
  if (safeImages.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + safeImages.value.length) % safeImages.value.length
}

// Set initial image on mount
onMounted(() => {
  if (safeImages.value.length > 0) {
    currentIndex.value = 0
  }
})
</script>

<style scoped>
.load-image-gallery:deep(button:focus) {
  outline: none;
}
</style> 