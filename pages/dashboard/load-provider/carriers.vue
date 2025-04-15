<template>
    <div class="min-h-screen px-6 py-8">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">My Carriers</h1>
            <button 
                @click="fetchCarriers" 
                class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                :disabled="isLoading"
            >
                <ArrowPathIcon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
                <ArrowPathIcon v-else class="h-4 w-4 mr-2" />
                {{ isLoading ? 'Loading...' : 'Refresh' }}
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow p-6 space-y-6">
            <div v-for="i in 3" :key="i" class="animate-pulse flex space-x-4">
                <div class="rounded-full bg-gray-200 h-12 w-12"></div>
                <div class="flex-1 space-y-3 py-1">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="space-y-2">
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- No carriers message -->
        <div v-else-if="carriers.length === 0" class="bg-white rounded-lg shadow p-6 text-center">
            <TruckIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-base font-medium text-gray-900">No carriers found</h3>
            <p class="mt-1 text-sm text-gray-500">
                You don't have any active carriers yet. Carriers will appear here once they work with your loads.
            </p>
        </div>

        <!-- Carriers List -->
        <div v-else class="bg-white rounded-lg shadow divide-y divide-gray-200">
            <div v-for="carrier in carriers" :key="carrier.id" class="p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span class="text-primary-700 font-medium text-sm">
                                    {{ carrier.firstName.charAt(0) }}{{ carrier.lastName.charAt(0) }}
                                </span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h2 class="text-lg font-medium text-gray-900">{{ carrier.firstName }} {{ carrier.lastName }}</h2>
                            <div class="flex flex-wrap items-center mt-1">
                                <div class="text-sm text-gray-500">{{ carrier.email }}</div>
                                <span class="mx-2 text-gray-300">•</span>
                                <div class="text-sm text-gray-500">
                                    <span class="font-medium">{{ carrier.truckCount }}</span> trucks
                                </div>
                                <span class="mx-2 text-gray-300">•</span>
                                <div class="text-sm text-gray-500">
                                    <span class="font-medium">{{ carrier.completedOrders }}</span> completed orders
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span 
                            :class="carrier.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                            class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                            {{ carrier.isActive ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowPathIcon, TruckIcon } from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'load-provider-dashboard',
    middleware: ['auth']
})

// Types
interface Carrier {
    id: string
    firstName: string
    lastName: string
    email: string
    isActive: boolean
    truckCount: number
    completedOrders: number
}

// State
const carriers = ref<Carrier[]>([])
const isLoading = ref(true)

// Fetch carriers data
const fetchCarriers = async () => {
    isLoading.value = true
    
    try {
        // In a real app, this would be an API call to fetch your carriers
        // For now, using mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock data
        carriers.value = [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                isActive: true,
                truckCount: 3,
                completedOrders: 12
            },
            {
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                isActive: true,
                truckCount: 2,
                completedOrders: 8
            }
        ]
    } catch (error) {
        console.error('Error fetching carriers:', error)
    } finally {
        isLoading.value = false
    }
}

// Fetch data on component mount
onMounted(() => {
    fetchCarriers()
})
</script> 