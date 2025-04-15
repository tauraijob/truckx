<template>
  <div>
    <div v-if="truck" class="truck-detail">
      <div class="relative h-60 mb-4 rounded-lg overflow-hidden">
        <img :src="truck.imageUrl" :alt="truck.name" class="w-full h-full object-cover" />
        <div class="absolute top-4 right-4 bg-[#0070f3] text-white text-xs font-bold px-2 py-1 rounded-full">
          Available Now
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 class="text-sm text-gray-500 font-medium">Make & Model</h4>
          <p class="text-gray-700">{{ truck.make || '-' }} {{ truck.model || '-' }}</p>
        </div>
        <div>
          <h4 class="text-sm text-gray-500 font-medium">Year</h4>
          <p class="text-gray-700">{{ truck.year || '-' }}</p>
        </div>
        <div>
          <h4 class="text-sm text-gray-500 font-medium">Capacity</h4>
          <p class="text-gray-700">{{ truck.capacity || '-' }} {{ truck.capacityUnit || '-' }}</p>
        </div>
        <div>
          <h4 class="text-sm text-gray-500 font-medium">License Plate</h4>
          <p class="text-gray-700">{{ truck.licensePlate || 'XXXXX' }}</p>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm text-gray-500 font-medium">Current Location</h4>
        <div class="flex items-center mt-1 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ truck.location || 'Not specified' }}</span>
        </div>
      </div>

      <div class="mt-4" v-if="truck.specifications">
        <h4 class="text-sm text-gray-500 font-medium">Specifications</h4>
        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-for="(value, key) in truckSpecifications" :key="key" class="text-gray-700">
            <span class="font-medium">{{ formatKey(key) }}:</span> {{ value }}
          </div>
        </div>
      </div>

      <div class="mt-4" v-if="truck.description">
        <h4 class="text-sm text-gray-500 font-medium">Description</h4>
        <p class="mt-1 text-gray-700">{{ truck.description || 'No description available' }}</p>
      </div>
      
      <div class="mt-4">
        <h4 class="text-sm text-gray-500 font-medium">Provider</h4>
        <p class="mt-1 text-gray-700">{{ truck.providerName || 'Anonymous' }}</p>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/auth/login?redirect=/dashboard/available-trucks" 
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0050b3] transition-colors">
          Login to book this truck
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="py-8 text-center">
      <p class="text-gray-500">No truck details available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  truck: {
    type: Object,
    required: true
  }
});

const truckSpecifications = computed(() => {
  if (!props.truck || !props.truck.specifications) return {};
  
  // Filter out internal properties like _images
  const specs = { ...props.truck.specifications };
  Object.keys(specs).forEach(key => {
    if (key.startsWith('_')) delete specs[key];
  });
  
  return specs;
});

function formatKey(key: string): string {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}
</script> 