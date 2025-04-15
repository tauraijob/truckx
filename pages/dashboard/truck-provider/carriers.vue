<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-8">
            <!-- Page Header -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold text-gray-800">My Carriers</h1>
                <button
                    class="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-md flex items-center transition-colors"
                    @click="refreshCarriers"
                >
                    <div v-if="loading" class="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <ArrowPathIcon v-else class="h-5 w-5 mr-2" />
                    {{ loading ? 'Loading...' : 'Refresh' }}
                </button>
            </div>

            <!-- Carriers List -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div v-if="loading" class="py-10 text-center">
                    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                    <p class="mt-2 text-sm text-gray-600">Loading carriers...</p>
                </div>
                <div v-else-if="carriers.length === 0" class="py-10 text-center">
                    <TruckIcon class="h-12 w-12 mx-auto text-gray-400" />
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No carriers</h3>
                    <p class="mt-1 text-sm text-gray-500">You haven't worked with any carriers yet.</p>
                </div>
                <div v-else>
                    <div class="border-b border-gray-200 pb-5 mb-5">
                        <h3 class="text-lg font-medium leading-6 text-gray-900">Your Carriers</h3>
                    </div>
                    <ul role="list" class="divide-y divide-gray-200">
                        <li v-for="carrier in carriers" :key="carrier.id" class="py-4 flex">
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserIcon class="h-6 w-6 text-blue-600" />
                            </div>
                            <div class="ml-4">
                                <div class="flex items-center">
                                    <h4 class="text-sm font-medium text-gray-900">{{ carrier.name }}</h4>
                                    <span class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500">{{ carrier.loadsCount }} loads · {{ carrier.completedOrders }} completed orders</p>
                            </div>
                            <div class="ml-auto">
                                <button class="text-sm text-primary-600 hover:text-primary-700">View details</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TruckIcon, UserIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'truck-provider-dashboard',
    middleware: ['auth']
})

interface Carrier {
    id: string;
    name: string;
    loadsCount: number;
    completedOrders: number;
}

const carriers = ref<Carrier[]>([])
const loading = ref(true)

// Fetch carriers data
async function fetchCarriers() {
    loading.value = true
    
    try {
        // Mock data for now - will be replaced with actual API call
        setTimeout(() => {
            carriers.value = [
                {
                    id: '1',
                    name: 'Acme Shipping',
                    loadsCount: 5,
                    completedOrders: 12
                },
                {
                    id: '2',
                    name: 'Express Logistics',
                    loadsCount: 3,
                    completedOrders: 8
                }
            ]
            loading.value = false
        }, 1000)
        
        // Actual API implementation would be:
        // const token = localStorage.getItem('token')
        // const { data, error } = await useFetch('/api/truck-provider/carriers', {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // })
        // if (data.value) carriers.value = data.value
    } catch (error) {
        console.error('Error fetching carriers:', error)
    } finally {
        // loading.value = false
    }
}

function refreshCarriers() {
    fetchCarriers()
}

onMounted(() => {
    fetchCarriers()
})
</script> 