<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-8">
            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Error: </strong>
                <span class="block sm:inline">{{ errorMessage }}</span>
                <button @click="errorMessage = ''" class="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <XMarkIcon class="h-5 w-5" />
                </button>
            </div>

            <div class="space-y-8">
                <!-- Page Header -->
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <button
                        class="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-md flex items-center transition-colors"
                        @click="refreshDashboard"
                    >
                        <div v-if="loadingStats || loadingOrders || loadingTrucks" class="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <ArrowPathIcon v-else class="h-5 w-5 mr-2" />
                        {{ loadingStats || loadingOrders || loadingTrucks ? 'Loading...' : 'Refresh' }}
                    </button>
                </div>

                <!-- Overview Cards -->
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Loads Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-blue-100">
                                <ClipboardDocumentListIcon class="h-7 w-7 text-blue-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">My Loads</p>
                                <p v-if="loadingStats" class="text-3xl font-semibold text-primary-700 mt-1">
                                    <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-3xl font-semibold text-primary-700 mt-1">{{ dashboardData.totalLoads }}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span v-if="loadingStats" class="text-sm text-green-600 font-medium">
                                    <span class="inline-block h-4 w-12 bg-gray-200 animate-pulse rounded"></span>
                                </span>
                                <span v-else class="text-sm text-green-600 font-medium">{{ dashboardData.activeLoads }} Active</span>
                            </div>
                            <NuxtLink to="/dashboard/load-provider/loads" class="text-sm text-primary-700 font-medium hover:text-primary-800">
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
                            <NuxtLink to="/dashboard/load-provider/orders" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                View all →
                            </NuxtLink>
                        </div>
                    </div>
                    
                    <!-- Payments Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-green-100">
                                <CurrencyDollarIcon class="h-7 w-7 text-green-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Delivery Payments</p>
                                <p class="text-3xl font-semibold text-primary-700 mt-1">${{ dashboardData.totalPayments.toFixed(2) }}</p>
                                <p class="text-xs text-gray-500 mt-1">Total amount for accepted & completed deliveries</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span class="text-sm text-green-600 font-medium">${{ dashboardData.monthlyPayments.toFixed(2) }} This Month</span>
                            </div>
                            <NuxtLink to="/dashboard/load-provider/payments" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                Details →
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Total Revenue Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-green-100">
                                <BanknotesIcon class="h-7 w-7 text-green-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Revenue</p>
                                <p v-if="loadingStats" class="text-3xl font-semibold text-primary-700 mt-1">
                                    <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-3xl font-semibold text-primary-700 mt-1">${{ formatCurrency(dashboardData.totalRevenue) }}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span v-if="loadingStats" class="text-sm text-green-600 font-medium">
                                    <span class="inline-block h-4 w-12 bg-gray-200 animate-pulse rounded"></span>
                                </span>
                                <span v-else class="text-sm text-green-600 font-medium">${{ formatCurrency(dashboardData.revenueThisMonth) }} this month</span>
                            </div>
                            <NuxtLink to="/dashboard/load-provider/finance" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                Details →
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Carriers Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-purple-100">
                                <TruckIcon class="h-7 w-7 text-purple-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Carriers</p>
                                <p v-if="loadingStats" class="text-3xl font-semibold text-primary-700 mt-1">
                                    <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-3xl font-semibold text-primary-700 mt-1">{{ dashboardData.totalCarriers }}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <div>
                                <span v-if="loadingStats" class="text-sm text-green-600 font-medium">
                                    <span class="inline-block h-4 w-12 bg-gray-200 animate-pulse rounded"></span>
                                </span>
                                <span v-else class="text-sm text-green-600 font-medium">{{ dashboardData.activeCarriers }} Working</span>
                            </div>
                            <NuxtLink to="/dashboard/load-provider/carriers" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                Manage →
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <NuxtLink 
                        to="/dashboard/load-provider/available-trucks" 
                        class="flex items-center justify-center gap-2 rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm hover:bg-primary-50"
                    >
                        <TruckIcon class="h-6 w-6 text-primary-600" />
                        <span class="text-lg font-medium text-primary-700">Find Available Trucks</span>
                    </NuxtLink>
                    
                    <NuxtLink 
                        to="/dashboard/load-provider/loads" 
                        class="flex items-center justify-center gap-2 rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm hover:bg-primary-50"
                    >
                        <PlusCircleIcon class="h-6 w-6 text-primary-600" />
                        <span class="text-lg font-medium text-primary-700">Add New Load</span>
                    </NuxtLink>
                </div>

                <!-- Platform Fees Section -->
                <div>
                    <UpcomingFeeCard 
                        userType="load-provider" 
                        :userId="userId" 
                    />
                </div>

                <!-- Recent Activity -->
                <div>
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
                    <div class="rounded-lg border border-primary-700/10 bg-white shadow-sm">
                        <div class="px-6 py-4 border-b border-primary-700/10">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-primary-700">Latest Orders</h3>
                                <div class="flex items-center space-x-2">
                                    <button 
                                        @click="refreshOrders" 
                                        class="inline-flex items-center text-sm text-primary-700 hover:text-primary-800"
                                        :disabled="loadingOrders"
                                    >
                                        <ArrowPathIcon class="h-4 w-4 mr-1" :class="{'animate-spin': loadingOrders}" />
                                        Refresh
                                    </button>
                                    <NuxtLink to="/dashboard/load-provider/orders" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                        View all →
                                    </NuxtLink>
                                </div>
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
                                    <!-- Loading state -->
                                    <template v-if="loadingOrders">
                                        <tr v-for="i in 3" :key="`loading-${i}`">
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                                                <div class="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-14 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                        </tr>
                                    </template>
                                    
                                    <!-- Actual data -->
                                    <template v-else>
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
                                            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                                                No orders found. <NuxtLink to="/dashboard/load-provider/available-trucks" class="text-primary-600 hover:underline">Request a truck</NuxtLink> to create your first order.
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Available Trucks -->
                <div>
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">Available Trucks</h2>
                    <div class="rounded-lg border border-primary-700/10 bg-white shadow-sm">
                        <div class="px-6 py-4 border-b border-primary-700/10">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-primary-700">Recommended Trucks</h3>
                                <div class="flex items-center space-x-2">
                                    <button 
                                        @click="refreshTrucks" 
                                        class="inline-flex items-center text-sm text-primary-700 hover:text-primary-800"
                                        :disabled="loadingTrucks"
                                    >
                                        <ArrowPathIcon class="h-4 w-4 mr-1" :class="{'animate-spin': loadingTrucks}" />
                                        Refresh
                                    </button>
                                    <NuxtLink to="/dashboard/load-provider/available-trucks" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                        Browse all →
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Truck</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type & Capacity</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Location</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Provider</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <!-- Loading state -->
                                    <template v-if="loadingTrucks">
                                        <tr v-for="i in 3" :key="`loading-truck-${i}`">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class="h-10 w-10 bg-gray-200 animate-pulse rounded-md"></div>
                                                    <div class="ml-4">
                                                        <div class="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                                                        <div class="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="h-4 w-20 bg-gray-200 animate-pulse rounded mb-1"></div>
                                                <div class="h-3 w-12 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                        </tr>
                                    </template>
                                    
                                    <!-- Actual data -->
                                    <template v-else>
                                        <tr v-for="truck in recommendedTrucks" :key="truck.id" class="hover:bg-gray-50">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0">
                                                        <div class="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                                                            <TruckIcon class="h-6 w-6 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-gray-900">{{ truck.make }} {{ truck.model }}</div>
                                                        <div class="text-sm text-gray-500">{{ truck.registrationNumber }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="text-sm text-gray-900">{{ formatTruckType(truck.type) }}</div>
                                                <div class="text-sm text-gray-500">{{ truck.capacityTons }} tons</div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="flex items-center text-sm text-gray-900">
                                                    <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                                                    <span>{{ truck.currentLocation }}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 text-sm text-gray-500">{{ truck.providerName }}</td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm">
                                                <NuxtLink 
                                                    :to="`/dashboard/load-provider/available-trucks?truckId=${truck.id}`" 
                                                    class="rounded bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                                                >
                                                    Request Truck
                                                </NuxtLink>
                                            </td>
                                        </tr>
                                        <tr v-if="recommendedTrucks.length === 0">
                                            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                                                No available trucks found at the moment. Check back later or <NuxtLink to="/dashboard/load-provider/available-trucks" class="text-primary-600 hover:underline">browse all trucks</NuxtLink>.
                                            </td>
                                        </tr>
                                    </template>
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
    ClipboardDocumentListIcon,
    ClipboardDocumentCheckIcon,
    CurrencyDollarIcon,
    TruckIcon,
    PlusCircleIcon,
    MapPinIcon,
    PlusIcon,
    ArrowPathIcon,
    XMarkIcon,
    BanknotesIcon
} from '@heroicons/vue/24/outline'
import UpcomingFeeCard from '~/components/UpcomingFeeCard.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
    layout: 'load-provider-dashboard',
    middleware: ['auth']
})

const { user } = useAuth()
const userId = ref('')

// Dashboard data
const dashboardData = ref({
    totalLoads: 0,
    activeLoads: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalPayments: 0,
    monthlyPayments: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    totalCarriers: 0,
    activeCarriers: 0
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

// Recommended trucks
interface Truck {
    id: string;
    make: string;
    model: string;
    registrationNumber: string;
    type: string;
    capacityTons: number;
    year: number;
    currentLocation: string;
    providerName: string;
    providerEmail: string;
    providerId: string;
}

const recommendedTrucks = ref<Truck[]>([])

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

// Format truck type
function formatTruckType(type: string): string {
    switch (type) {
        case 'FLATBED':
            return 'Flatbed'
        case 'REFRIGERATED':
            return 'Refrigerated'
        case 'DRY_VAN':
            return 'Dry Van'
        case 'STEP_DECK':
            return 'Step Deck'
        case 'TANKER':
            return 'Tanker'
        default:
            return type
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

// Format currency
function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return '0.00';
    }
    return parseFloat(value.toString()).toLocaleString('en-US', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    })
}

// Fetch dashboard data
const loadingStats = ref(true)
const loadingOrders = ref(true)
const loadingTrucks = ref(true)
const errorMessage = ref('')

// Refresh dashboard
function refreshDashboard() {
    loadingStats.value = true
    loadingOrders.value = true
    loadingTrucks.value = true
    errorMessage.value = ''

    fetchDashboardData()
}

// Refresh functions
function refreshOrders() {
    loadingOrders.value = true
    fetchOrders()
}

function refreshTrucks() {
    loadingTrucks.value = true
    fetchTrucks()
}

// Fetch recent orders
async function fetchOrders() {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            errorMessage.value = 'Authentication token not found. Please login again.'
            return
        }
        
        const { data: latestOrders, error: ordersError } = await useFetch('/api/load-provider/dashboard/orders/recent', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            retry: 1
        })
        
        if (ordersError.value) {
            console.error('Error fetching recent orders:', ordersError.value)
        } else if (latestOrders.value) {
            console.log('Recent orders data:', latestOrders.value)
            recentOrders.value = latestOrders.value
        }
    } catch (error) {
        console.error('Error fetching orders:', error)
    } finally {
        loadingOrders.value = false
    }
}

// Fetch recommended trucks
async function fetchTrucks() {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            errorMessage.value = 'Authentication token not found. Please login again.'
            return
        }
        
        const { data: truckRecommendations, error: trucksError } = await useFetch('/api/load-provider/dashboard/trucks/recommended', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            retry: 1
        })
        
        if (trucksError.value) {
            console.error('Error fetching truck recommendations:', trucksError.value)
        } else if (truckRecommendations.value) {
            console.log('Recommended trucks data:', truckRecommendations.value)
            recommendedTrucks.value = truckRecommendations.value
        }
    } catch (error) {
        console.error('Error fetching trucks:', error)
    } finally {
        loadingTrucks.value = false
    }
}

// Fetch dashboard data
async function fetchDashboardData() {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            errorMessage.value = 'Authentication token not found. Please login again.'
            return
        }
        
        // Fetch dashboard statistics
        const { data: dashboardStats, error: statsError } = await useFetch('/api/load-provider/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            retry: 1
        })
        
        if (statsError.value) {
            console.error('Error fetching dashboard stats:', statsError.value)
            errorMessage.value = `Error loading dashboard data: ${statsError.value.message || 'Unknown error'}`
        } else if (dashboardStats.value) {
            // Ensure all properties have default values if missing from the API response
            dashboardData.value = {
                totalLoads: dashboardStats.value.totalLoads || 0,
                activeLoads: dashboardStats.value.activeLoads || 0,
                activeOrders: dashboardStats.value.activeOrders || 0,
                pendingOrders: dashboardStats.value.pendingOrders || 0,
                totalPayments: dashboardStats.value.totalPayments || 0,
                monthlyPayments: dashboardStats.value.monthlyPayments || 0,
                totalRevenue: dashboardStats.value.totalRevenue || 0,
                revenueThisMonth: dashboardStats.value.revenueThisMonth || 0,
                totalCarriers: dashboardStats.value.totalCarriers || 0,
                activeCarriers: dashboardStats.value.activeCarriers || 0
            }
        }
        loadingStats.value = false
        
        // Fetch recent orders and trucks
        fetchOrders()
        fetchTrucks()
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        errorMessage.value = `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
        loadingStats.value = false
    }
}

// Initialization
onMounted(() => {
    // Set userId if user is available
    if (user.value && user.value.id) {
        userId.value = user.value.id
        console.log('Load provider userId set:', userId.value)
    } else {
        console.warn('User data not available for UpcomingFeeCard')
        // Set a mock userId for development
        userId.value = 'mock-user-id'
    }
    
    fetchDashboardData()
})
</script>