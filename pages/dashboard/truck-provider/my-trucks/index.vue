<template>
    <div>
        <!-- Truck list -->
        <div v-if="trucks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="truck in trucks" :key="truck.id" class="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
            <!-- Truck Image -->
            <div class="relative h-48 bg-gray-100">
              <img 
                :src="truck.images && truck.images.length > 0 ? truck.images[0] : '/images/truckx-slide.webp'" 
                :alt="`${truck.make} ${truck.model}`" 
                class="w-full h-full object-cover"
              />
              <div class="absolute top-4 right-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full" 
                  :class="truck.isAvailable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ truck.isAvailable ? 'Available' : 'Not Available' }}
                </span>
              </div>
            </div>
            
            <!-- Truck Info -->
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ truck.name || `${truck.make} ${truck.model}` }}</h3>
              
              <div class="mt-4 space-y-2">
                <div class="flex items-center text-sm text-gray-500">
                  <span class="font-medium mr-2">License:</span> {{ truck.licensePlate }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="font-medium mr-2">Type:</span> {{ truck.type || 'Standard' }}
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="font-medium mr-2">Capacity:</span> {{ truck.capacity }} tons
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="font-medium mr-2">Year:</span> {{ truck.year }}
                </div>
              </div>
              
              <div class="mt-6 flex justify-end">
                <NuxtLink :to="`/dashboard/truck-provider/my-trucks/${truck.id}`" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0060df] focus:outline-none">
                  View Details
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No trucks message -->
        <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
            <div class="flex flex-col items-center justify-center">
                <!-- <img src="" alt="No trucks found" class="w-48 h-48 mb-4" /> -->
                <h3 class="text-lg font-medium text-gray-900 mb-2">No trucks added yet</h3>
                <p class="text-gray-500 mb-6">Add your first truck to start managing your fleet</p>
                <NuxtLink to="/dashboard/truck-provider/my-trucks/add" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0060df] focus:outline-none">
                    Add Your First Truck
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
    layout: 'truck-provider-dashboard',
    middleware: ['auth']
})

// Define truck interface
interface Truck {
    id: string;
    make: string;
    model: string;
    year: number;
    capacity: number;
    licensePlate: string;
    images: string[];
    specifications: any;
    isAvailable: boolean;
    type?: string;
    name?: string;
}

// Set up reactive state
const trucks = ref<Truck[]>([])
const loading = ref(true)

// Fetch trucks data
onMounted(async () => {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token')
        console.log('Token available:', !!token)
        
        // Fetch trucks from API
        const { data, error } = await useFetch('/api/trucks', {
            query: {
                providerId: 'current' // This tells the API to fetch trucks for the current user
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        if (error.value) {
            console.error('Error fetching trucks:', error.value)
            return
        }
        
        console.log('API response:', data.value)
        
        if (data.value?.trucks) {
            // Transform truck data to match our interface
            trucks.value = data.value.trucks.map((truck: any) => ({
                id: truck.id,
                make: truck.make,
                model: truck.model,
                year: truck.year,
                capacity: truck.capacity,
                licensePlate: truck.licensePlate,
                images: truck.images || [],
                specifications: truck.specifications || {},
                isAvailable: truck.isAvailable || false,
                type: truck.specifications?.type,
                name: truck.name
            }))
            
            console.log(`Loaded ${trucks.value.length} trucks`)
        }
    } catch (err) {
        console.error('Failed to load trucks:', err)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
/* Add custom styles here if needed */
</style> 