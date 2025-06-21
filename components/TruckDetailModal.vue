<template>
  <div>
    <div v-if="truck" class="truck-detail">
      <!-- Truck Image Gallery -->
      <TruckImageGallery 
        :images="truck.images || []" 
        :alt="`${truck.make} ${truck.model}`"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-6">
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
          <p class="text-gray-700">{{ truck.capacity || '-' }} {{ truck.capacityUnit || 'tons' }}</p>
        </div>
        <div>
          <h4 class="text-sm text-gray-500 font-medium">Type</h4>
          <p class="text-gray-700">{{ formatTruckType(truck.type) || 'Standard' }}</p>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm text-gray-500 font-medium">Current Location</h4>
        <p class="text-gray-700">{{ truck.currentLocation || 'Location not specified' }}</p>
      </div>

      <div class="mt-4" v-if="truck.specifications">
        <h4 class="text-sm text-gray-500 font-medium">Specifications</h4>
        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div v-if="truck.specifications.engineType" class="text-gray-700">
            <span class="font-medium">Engine Type:</span> {{ truck.specifications.engineType }}
          </div>
          <div v-if="truck.specifications.transmission" class="text-gray-700">
            <span class="font-medium">Transmission:</span> {{ truck.specifications.transmission }}
          </div>
          <div v-if="truck.specifications.axles" class="text-gray-700">
            <span class="font-medium">Axles:</span> {{ truck.specifications.axles }}
          </div>
          <div v-if="truck.specifications.wheelbase" class="text-gray-700">
            <span class="font-medium">Wheelbase:</span> {{ truck.specifications.wheelbase }}
          </div>
        </div>
      </div>

      <div class="mt-4" v-if="truck.description">
        <h4 class="text-sm text-gray-500 font-medium">Description</h4>
        <p class="mt-1 text-gray-700">{{ truck.description }}</p>
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
import TruckImageGallery from './TruckImageGallery.vue'

const props = defineProps({
  truck: {
    type: Object,
    required: true
  }
});

// Format truck type for display
function formatTruckType(type: string): string {
  if (!type) return 'Standard';
  
  switch (type.toUpperCase()) {
    case 'FLATBED':
      return 'Flatbed';
    case 'REFRIGERATED':
      return 'Refrigerated';
    case 'DRY_VAN':
      return 'Dry Van';
    case 'STEP_DECK':
      return 'Step Deck';
    case 'TANKER':
      return 'Tanker';
    default:
      return type;
  }
}
</script> 