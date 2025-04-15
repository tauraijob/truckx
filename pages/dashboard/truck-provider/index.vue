<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-8">
            <div class="space-y-8">
                <!-- Page Header -->
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <button
                        class="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-md flex items-center transition-colors">
                        <PlusIcon class="h-5 w-5 mr-2" />
                        Add New Truck
                    </button>
                </div>

                <!-- Overview Cards -->
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Trucks Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-blue-100">
                                <TruckIcon class="h-7 w-7 text-blue-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">My Trucks</p>
                                <p class="text-3xl font-semibold text-primary-700 mt-1">{{ dashboardData.totalTrucks }}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span class="text-sm text-green-600 font-medium">{{ dashboardData.availableTrucks }} Available</span>
                            </div>
                            <NuxtLink to="/dashboard/truck-provider/trucks" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                Manage →
                            </NuxtLink>
                        </div>
                    </div>
                    
                    <!-- Orders Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-purple-100">
                                <ClipboardDocumentCheckIcon class="h-7 w-7 text-purple-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Active Orders</p>
                                <p class="text-3xl font-semibold text-primary-700 mt-1">{{ dashboardData.activeOrders }}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span class="text-sm text-blue-600 font-medium">{{ dashboardData.pendingOrders }} Pending</span>
                            </div>
                            <NuxtLink to="/dashboard/truck-provider/orders" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                View all →
                            </NuxtLink>
                        </div>
                    </div>
                    
                    <!-- Earnings Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-green-100">
                                <CurrencyDollarIcon class="h-7 w-7 text-green-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Total Earnings</p>
                                <p class="text-3xl font-semibold text-primary-700 mt-1">${{ dashboardData.totalEarnings.toFixed(2) }}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span class="text-sm text-green-600 font-medium">${{ dashboardData.monthlyEarnings.toFixed(2) }} This Month</span>
                            </div>
                            <NuxtLink to="/dashboard/truck-provider/earnings" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                Details →
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Platform Fees Section -->
                <div>
                    <UpcomingFeeCard 
                        userType="truck-provider" 
                        :userId="userId" 
                    />
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <NuxtLink 
                        to="/dashboard/truck-provider/available-loads" 
                        class="flex items-center justify-center gap-2 rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm hover:bg-primary-50"
                    >
                        <ClipboardDocumentListIcon class="h-6 w-6 text-primary-600" />
                        <span class="text-lg font-medium text-primary-700">Find Available Loads</span>
                    </NuxtLink>
                    
                    <NuxtLink 
                        to="/dashboard/truck-provider/trucks" 
                        class="flex items-center justify-center gap-2 rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm hover:bg-primary-50"
                    >
                        <PlusCircleIcon class="h-6 w-6 text-primary-600" />
                        <span class="text-lg font-medium text-primary-700">Add New Truck</span>
                    </NuxtLink>
                </div>

                <!-- Recent Activity -->
                <div>
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
                    <div class="rounded-lg border border-primary-700/10 bg-white shadow-sm">
                        <div class="px-6 py-4 border-b border-primary-700/10">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-primary-700">Latest Orders</h3>
                                <NuxtLink to="/dashboard/truck-provider/orders" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                    View all →
                                </NuxtLink>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Truck</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
                                        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">#{{ order.id.slice(0, 8) }}</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div class="text-sm font-medium text-gray-900">{{ order.loadName }}</div>
                                            <div class="text-xs text-gray-500">{{ formatDate(order.pickupDate) }}</div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.truckName }}</td>
                                        <td class="whitespace-nowrap px-6 py-4 text-sm">
                                            <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                                                :class="getStatusClass(order.status)">
                                                {{ formatStatus(order.status) }}
                                            </span>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ order.price.toFixed(2) }}</td>
                                    </tr>
                                    <tr v-if="recentOrders.length === 0">
                                        <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No recent orders found</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Available Loads -->
                <div>
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">Available Loads</h2>
                    <div class="rounded-lg border border-primary-700/10 bg-white shadow-sm">
                        <div class="px-6 py-4 border-b border-primary-700/10">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-primary-700">Recommended Loads</h3>
                                <NuxtLink to="/dashboard/truck-provider/available-loads" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                    Browse all →
                                </NuxtLink>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pick-up Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <tr v-for="load in recommendedLoads" :key="load.id" class="hover:bg-gray-50">
                                        <td class="px-6 py-4">
                                            <div class="text-sm font-medium text-gray-900">{{ load.title }}</div>
                                            <div class="text-xs text-gray-500">{{ load.description.substring(0, 30) }}...</div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="text-sm text-gray-900">
                                                <div class="flex items-center">
                                                    <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                                                    <span>{{ load.origin }}</span>
                                                </div>
                                                <div class="flex items-center mt-1">
                                                    <ArrowLongRightIcon class="h-4 w-4 text-gray-400 mx-1" />
                                                </div>
                                                <div class="flex items-center mt-1">
                                                    <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                                                    <span>{{ load.destination }}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(load.pickupDate) }}</td>
                                        <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ load.price.toFixed(2) }}</td>
                                        <td class="whitespace-nowrap px-6 py-4 text-sm">
                                            <NuxtLink 
                                                :to="`/dashboard/truck-provider/available-loads?loadId=${load.id}`" 
                                                class="rounded bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                                            >
                                                Place Bid
                                            </NuxtLink>
                                        </td>
                                    </tr>
                                    <tr v-if="recommendedLoads.length === 0">
                                        <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No loads currently available</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    TruckIcon,
    ClipboardDocumentCheckIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    PlusCircleIcon,
    MapPinIcon,
    ArrowLongRightIcon,
    PlusIcon
} from '@heroicons/vue/24/outline'
import UpcomingFeeCard from '~/components/UpcomingFeeCard.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'truck-provider-dashboard',
    middleware: ['auth']
})

const { user } = useAuth()
const userId = ref('')

// Dashboard data
const dashboardData = ref({
    totalTrucks: 0,
    availableTrucks: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
})

// Recent orders
interface Order {
    id: string;
    loadName: string;
    loadId: string;
    truckName: string;
    truckId: string;
    pickupDate: string;
    deliveryDate: string;
    status: string;
    price: number;
}

const recentOrders = ref<Order[]>([])

// Recommended loads
interface Load {
    id: string;
    title: string;
    description: string;
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    price: number;
}

const recommendedLoads = ref<Load[]>([])

// Format date
function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// Format status
function formatStatus(status: string): string {
    switch (status) {
        case 'PENDING':
            return 'Pending'
        case 'ACCEPTED':
            return 'Accepted'
        case 'IN_TRANSIT':
            return 'In Transit'
        case 'DELIVERED':
            return 'Delivered'
        case 'CANCELLED':
            return 'Cancelled'
        default:
            return status
    }
}

// Get status styling class
function getStatusClass(status: string): string {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800'
        case 'ACCEPTED':
            return 'bg-blue-100 text-blue-800'
        case 'IN_TRANSIT':
            return 'bg-purple-100 text-purple-800'
        case 'DELIVERED':
            return 'bg-green-100 text-green-800'
        case 'CANCELLED':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

// Fetch data on component mount
onMounted(async () => {
    // Set userId if user is available
    if (user.value && user.value.id) {
        userId.value = user.value.id
        console.log('Truck provider userId set:', userId.value)
    } else {
        console.warn('User data not available for UpcomingFeeCard')
        // Set a mock userId for development
        userId.value = 'mock-user-id'
    }
    
    await fetchDashboardData()
    await fetchRecentOrders()
    await fetchRecommendedLoads()
})

// Fetch dashboard data
async function fetchDashboardData() {
    try {
        // Fetch dashboard statistics
        const { data: dashboardStats, error: statsError } = await useFetch('/api/truck-provider/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        
        if (statsError.value) {
            console.error('Error fetching dashboard stats:', statsError.value)
        } else if (dashboardStats.value) {
            console.log('Dashboard stats received:', dashboardStats.value)
            dashboardData.value = dashboardStats.value
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    }
}

// Fetch recent orders
async function fetchRecentOrders() {
    try {
        const { data: latestOrders, error: ordersError } = await useFetch('/api/truck-provider/dashboard/orders/recent', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        
        if (ordersError.value) {
            console.error('Error fetching recent orders:', ordersError.value)
        } else if (latestOrders.value) {
            console.log('Recent orders received:', latestOrders.value)
            recentOrders.value = latestOrders.value
        }
    } catch (error) {
        console.error('Error fetching recent orders:', error)
    }
}

// Fetch recommended loads
async function fetchRecommendedLoads() {
    try {
        const { data: loadRecommendations, error: loadsError } = await useFetch('/api/truck-provider/dashboard/loads/recommended', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        
        if (loadsError.value) {
            console.error('Error fetching recommended loads:', loadsError.value)
        } else if (loadRecommendations.value) {
            console.log('Recommended loads received:', loadRecommendations.value)
            recommendedLoads.value = loadRecommendations.value
        }
    } catch (error) {
        console.error('Error fetching recommended loads:', error)
    }
}
</script>

<style scoped>
/* Add your styles here */
</style>