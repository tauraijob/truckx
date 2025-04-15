<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-8">
            <div class="space-y-8">
                <!-- Error message display -->
                <div v-if="errorMessage" class="mb-6 rounded-md bg-red-50 p-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <ExclamationTriangleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
                            <div class="mt-2 text-sm text-red-700">
                                <p>You may need to log in again to access the dashboard.</p>
                            </div>
                            <div class="mt-4">
                                <div class="-mx-2 -my-1.5 flex">
                                    <NuxtLink to="/auth/login" class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100">
                                        Go to login
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Page Header -->
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-semibold text-[#004599]">Admin Dashboard</h1>
                    <button @click="fetchDashboardData" 
                        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                        :disabled="isLoading">
                        <ArrowPathIcon class="h-5 w-5 mr-2" :class="{ 'animate-spin': isLoading }" />
                        {{ isLoading ? 'Loading...' : 'Refresh Data' }}
                    </button>
                </div>

                <!-- Overview Cards -->
                <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Total Users Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-blue-100">
                                <UsersIcon class="h-7 w-7 text-blue-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Total Users</p>
                                <p v-if="isLoading" class="text-3xl font-semibold text-primary-700 mt-1">
                                    <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-3xl font-semibold text-primary-700 mt-1">{{ stats.totalUsers }}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <NuxtLink to="/dashboard/admin/users" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                View all users →
                            </NuxtLink>
                        </div>
                    </div>
                    
                    <!-- Active Loads Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-green-100">
                                <ClipboardDocumentListIcon class="h-7 w-7 text-green-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Active Loads</p>
                                <p v-if="isLoading" class="text-3xl font-semibold text-primary-700 mt-1">
                                    <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-3xl font-semibold text-primary-700 mt-1">{{ stats.activeLoads }}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <NuxtLink to="/dashboard/admin/loads" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                View all loads →
                            </NuxtLink>
                        </div>
                    </div>
                    
                    <!-- Available Trucks Card -->
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-purple-100">
                                <TruckIcon class="h-7 w-7 text-purple-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Available Trucks</p>
                                <p v-if="isLoading" class="text-3xl font-semibold text-primary-700 mt-1">
                                    <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-3xl font-semibold text-primary-700 mt-1">{{ stats.availableTrucks }}</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <NuxtLink to="/dashboard/admin/trucks" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                View all trucks →
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="mt-8">
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
                    <div class="rounded-lg border border-primary-700/10 bg-white shadow-sm">
                        <div class="px-6 py-4 border-b border-primary-700/10">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-primary-700">Latest Orders</h3>
                                <NuxtLink to="/dashboard/admin/orders" class="text-sm text-primary-700 font-medium hover:text-primary-800">
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
                                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200 bg-white">
                                    <!-- Loading state -->
                                    <template v-if="isLoading">
                                        <tr v-for="i in 3" :key="`loading-${i}`">
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4">
                                                <div class="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                                            </td>
                                        </tr>
                                    </template>
                                    
                                    <!-- Actual data -->
                                    <template v-else>
                                        <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">#{{ order.id.slice(0, 8) }}</td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{{ order.loadName }}</td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ order.truckName }}</td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm">
                                                <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                                                    :class="getStatusClass(order.status)">
                                                    {{ order.status }}
                                                </span>
                                            </td>
                                            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ formatDate(order.createdAt) }}</td>
                                        </tr>
                                        <tr v-if="recentOrders.length === 0">
                                            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No recent orders found</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- Platform Stats -->
                <div class="mt-8">
                    <h2 class="mb-4 text-xl font-semibold text-gray-900">Platform Stats</h2>
                    <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-medium text-primary-700">Payment Summary</h3>
                            <NuxtLink to="/dashboard/admin/payments" class="text-sm text-primary-700 font-medium hover:text-primary-800">
                                View details →
                            </NuxtLink>
                        </div>
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div class="rounded-lg border border-primary-700/10 bg-gray-50 p-4">
                                <p class="text-sm font-medium text-gray-500">Total Platform Fees</p>
                                <p v-if="isLoading" class="text-2xl font-bold text-primary-700 mt-2">
                                    <span class="inline-block h-6 w-16 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-2xl font-bold text-primary-700 mt-2">${{ stats.totalPlatformFees.toFixed(2) }}</p>
                            </div>
                            <div class="rounded-lg border border-primary-700/10 bg-gray-50 p-4">
                                <p class="text-sm font-medium text-gray-500">Provider Earnings</p>
                                <p v-if="isLoading" class="text-2xl font-bold text-primary-700 mt-2">
                                    <span class="inline-block h-6 w-16 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-2xl font-bold text-primary-700 mt-2">${{ stats.totalProviderEarnings.toFixed(2) }}</p>
                            </div>
                            <div class="rounded-lg border border-primary-700/10 bg-gray-50 p-4">
                                <p class="text-sm font-medium text-gray-500">Completed Orders</p>
                                <p v-if="isLoading" class="text-2xl font-bold text-primary-700 mt-2">
                                    <span class="inline-block h-6 w-16 bg-gray-200 animate-pulse rounded"></span>
                                </p>
                                <p v-else class="text-2xl font-bold text-primary-700 mt-2">{{ stats.completedOrders }}</p>
                            </div>
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
    UsersIcon,
    ClipboardDocumentListIcon,
    TruckIcon,
    UserPlusIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    CurrencyDollarIcon,
    DocumentTextIcon
} from '@heroicons/vue/24/outline'
import { OrderStatus } from '@prisma/client'

definePageMeta({
    layout: 'admin-dashboard',
    middleware: ['auth']
})

// Dashboard stats
const stats = ref({
    totalUsers: 0,
    activeLoads: 0,
    availableTrucks: 0,
    totalPlatformFees: 0,
    totalProviderEarnings: 0,
    completedOrders: 0
})

// Loading state
const isLoading = ref(false)

// Recent orders
interface OrderItem {
    id: string;
    loadName: string;
    truckName: string;
    status: OrderStatus;
    createdAt: Date;
}

const recentOrders = ref<OrderItem[]>([])

// After the OrderItem interface, add these interfaces
interface TestDataCounts {
    totalUsers: number;
    activeLoads: number;
    availableTrucks: number;
    completedOrders: number;
}

interface TestData {
    counts?: TestDataCounts;
    samples?: any;
    error?: string;
    stack?: string;
    seedingPerformed?: boolean;
    debug?: any;
}

// Format date
function formatDate(dateString: string | Date): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
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

// Add error message state
const errorMessage = ref('')

// Fetch dashboard data
onMounted(async () => {
    fetchDashboardData()
})

// Function to fetch dashboard data
async function fetchDashboardData() {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token')
        console.log('Dashboard using token:', token ? 'Token available' : 'No token')

        console.log('Fetching dashboard data from /api/admin/dashboard/stats');
        
        // Prepare headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        
        // Make direct fetch call
        const response = await fetch('/api/admin/dashboard/stats', {
            method: 'GET',
            headers
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Dashboard API Error:', response.status, errorData)
            errorMessage.value = errorData.message || `Failed to load dashboard data (${response.status})`
            
            // Set default values on error
            stats.value = {
                totalUsers: 0,
                activeLoads: 0,
                availableTrucks: 0,
                completedOrders: 0,
                totalPlatformFees: 0,
                totalProviderEarnings: 0
            };
            recentOrders.value = [];
            return;
        }
        
        const data = await response.json()
        console.log('Dashboard data received:', data);
        
        // Update dashboard statistics
        stats.value = {
            totalUsers: data.counts.totalUsers,
            activeLoads: data.counts.activeLoads,
            availableTrucks: data.counts.availableTrucks,
            completedOrders: data.counts.completedOrders,
            totalPlatformFees: data.counts.totalPlatformFees,
            totalProviderEarnings: data.counts.totalProviderEarnings
        };
        
        // Update recent orders
        recentOrders.value = data.samples.orders.map((order: any) => ({
            ...order,
            loadName: order.loadName || 'Unknown Load',
            truckName: order.truckName || 'Unknown Truck',
            createdAt: new Date(order.createdAt || new Date())
        }));
    } catch (error) {
        console.error('Error in fetchDashboardData:', error);
        errorMessage.value = 'An unexpected error occurred while loading dashboard data';
    } finally {
        isLoading.value = false;
    }
}
</script>