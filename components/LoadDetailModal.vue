<template>
  <div>
    <div v-if="load" class="load-detail">
      <div class="border border-gray-200 rounded-lg p-4 mb-4">
        <div class="mb-4">
          <LoadImageGallery 
            :images="loadImages" 
            :alt="`Load ${load.id}`" 
          />
        </div>
        
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-sm text-gray-500 font-medium">Load ID</h4>
            <p class="text-gray-700">{{ load.id.substring(0, 8) }}...</p>
          </div>
          <span class="bg-blue-100 text-[#0070f3] text-xs px-2 py-1 rounded-full font-medium">
            {{ load.status }}
          </span>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-2 mb-3">
            <div class="h-6 w-6 rounded-full bg-[#0070f3] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">{{ load.origin }}</p>
              <p class="text-xs text-gray-500">Pickup: {{ formatDate(load.pickupDate) }}</p>
            </div>
          </div>
          
          <div class="ml-3 h-6 border-l-2 border-dashed border-[#0070f3]"></div>
          
          <div class="flex items-center space-x-2">
            <div class="h-6 w-6 rounded-full bg-[#0070f3] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700">{{ load.destination }}</p>
              <p class="text-xs text-gray-500" v-if="load.deliveryDate">Delivery: {{ formatDate(load.deliveryDate) }}</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 class="text-sm text-gray-500 font-medium">Weight</h4>
            <p class="text-gray-700">{{ load.weight }} {{ load.weightUnit }}</p>
          </div>
          <div>
            <h4 class="text-sm text-gray-500 font-medium">Volume</h4>
            <p class="text-gray-700">{{ load.volume || '-' }} {{ load.volumeUnit || '' }}</p>
          </div>
          <div>
            <h4 class="text-sm text-gray-500 font-medium">Distance</h4>
            <p class="text-gray-700">{{ load.distance || '-' }} {{ load.distance ? 'miles' : '' }}</p>
          </div>
          <div>
            <h4 class="text-sm text-gray-500 font-medium">Type</h4>
            <p class="text-gray-700">{{ load.type || '-' }}</p>
          </div>
        </div>

        <div class="mb-4">
          <h4 class="text-sm text-gray-500 font-medium">Description</h4>
          <p class="mt-1 text-gray-700">{{ load.description || 'No description available' }}</p>
        </div>

        <div class="mt-4" v-if="loadSpecifications && Object.keys(loadSpecifications).length > 0">
          <h4 class="text-sm text-gray-500 font-medium">Specifications</h4>
          <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-for="(value, key) in loadSpecifications" :key="key" class="text-gray-700">
              <span class="font-medium">{{ formatKey(key) }}:</span> {{ value === true ? 'Yes' : value === false ? 'No' : value }}
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <h4 class="text-sm text-gray-500 font-medium">Provider</h4>
          <p class="mt-1 text-gray-700">{{ load.providerName || 'Anonymous' }}</p>
        </div>

        <div class="mt-4">
          <h4 class="text-sm text-gray-500 font-medium mb-2">Payment</h4>
          <div class="bg-[#0070f3]/5 p-3 rounded-lg flex justify-between items-center">
            <span class="text-gray-700">Estimated payment</span>
            <span class="text-[#0070f3] font-bold text-xl">${{ formatPrice(load.price) }}</span>
          </div>
        </div>

        <div class="mt-6 text-center">
          <NuxtLink to="/auth/login?redirect=/dashboard/available-loads" 
            class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0050b3] transition-colors">
            Login to accept this load
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="py-8 text-center">
      <p class="text-gray-500">No load details available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  load: {
    type: Object,
    required: true
  }
});

const loadSpecifications = computed(() => {
  if (!props.load || !props.load.specifications) return {};
  
  // Filter out internal properties like _images
  const specs = { ...props.load.specifications };
  Object.keys(specs).forEach(key => {
    if (key.startsWith('_')) delete specs[key];
  });
  
  return specs;
});

// Compute load images from both sources
const loadImages = computed(() => {
  if (!props.load) return [];
  
  // Get images from the main images field if it exists
  const mainImages = props.load.images || [];
  
  // Also get images from specifications._images if it exists
  const specImages = props.load.specifications && props.load.specifications._images 
    ? props.load.specifications._images 
    : [];
  
  // Combine both sources, removing duplicates
  return [...new Set([...mainImages, ...specImages])];
});

function formatKey(key: string): string {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
}

function formatPrice(price: number) {
  if (!price && price !== 0) return 'N/A';
  return price.toLocaleString('en-US');
}
</script> 