<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-8">
            <div class="space-y-8">
                <!-- Page Header -->
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-semibold text-primary-700">Payment Analytics</h1>
                    <button 
                        @click="refreshData" 
                        class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center"
                        :disabled="isLoading"
                    >
                        <ArrowPathIcon v-if="!isLoading" class="mr-2 h-5 w-5" />
                        <span v-else class="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        {{ isLoading ? 'Loading...' : 'Refresh' }}
                    </button>
                </div>

                <!-- Payment Summary -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Total Platform Fees -->
                    <div class="bg-white rounded-lg shadow p-8 border border-primary-700/10">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-primary-700/10">
                                <BanknotesIcon class="h-7 w-7 text-primary-700" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Total Platform Fees</p>
                                <p class="text-2xl font-semibold text-primary-700 mt-1">${{
                                    totalPlatformFees.toFixed(2) }}</p>
                                <p class="text-xs text-gray-500 mt-1">2% of accepted load values</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Provider Earnings -->
                    <div class="bg-white rounded-lg shadow p-8 border border-primary-700/10">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-green-100">
                                <CurrencyDollarIcon class="h-7 w-7 text-green-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Total Provider Earnings</p>
                                <p class="text-2xl font-semibold text-primary-700 mt-1">${{
                                    totalProviderEarnings.toFixed(2) }}</p>
                                <p class="text-xs text-gray-500 mt-1">Load prices after platform fees</p>
                            </div>
                        </div>
                    </div>

                    <!-- Total Transactions -->
                    <div class="bg-white rounded-lg shadow p-8 border border-primary-700/10">
                        <div class="flex items-center">
                            <div class="p-4 rounded-full bg-blue-100">
                                <ClipboardDocumentListIcon class="h-7 w-7 text-blue-600" />
                            </div>
                            <div class="ml-5">
                                <p class="text-sm font-medium text-primary-700">Total Transaction Value</p>
                                <p class="text-2xl font-semibold text-primary-700 mt-1">${{ totalTransactions.toFixed(2) }}</p>
                                <p class="text-xs text-gray-500 mt-1">Total value of accepted loads</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="border-b border-primary-700/10 mt-8">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <button @click="handleTabChange('analytics')"
                            :class="[activeTab === 'analytics' ? 'border-primary-700 text-primary-700' : 'border-transparent text-primary-700/60 hover:text-primary-700/80 hover:border-primary-700/30', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                            Analytics
                        </button>
                        <button @click="handleTabChange('calculator')"
                            :class="[activeTab === 'calculator' ? 'border-primary-700 text-primary-700' : 'border-transparent text-primary-700/60 hover:text-primary-700/80 hover:border-primary-700/30', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                            Payment Calculator
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="mt-8">
                    <!-- Analytics Tab -->
                    <div v-if="activeTab === 'analytics'" class="space-y-8">
                        <!-- Monthly Revenue Chart -->
                        <div class="bg-white rounded-lg shadow border border-primary-700/10">
                            <div class="px-8 py-5 border-b border-primary-700/10">
                                <h2 class="text-lg font-medium text-primary-700">Monthly Revenue</h2>
                            </div>
                            <div class="p-8">
                                <div class="h-80">
                                    <!-- Show loading state when data is being fetched -->
                                    <div v-if="isLoading" class="h-full flex items-center justify-center">
                                        <div class="animate-pulse flex flex-col items-center">
                                            <div class="h-4 w-24 bg-gray-200 rounded"></div>
                                            <div class="mt-4 h-40 w-full bg-gray-100 rounded"></div>
                                            <div class="mt-4 flex space-x-2">
                                                <div class="h-3 w-12 bg-gray-200 rounded"></div>
                                                <div class="h-3 w-12 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Show chart when data is loaded -->
                                    <LineChart v-else :data="chartData" :options="chartOptions" />
                                </div>
                            </div>
                        </div>

                        <!-- Recent Transactions -->
                        <div class="bg-white rounded-lg shadow border border-primary-700/10">
                            <div class="px-8 py-5 border-b border-primary-700/10">
                                <h2 class="text-lg font-medium text-primary-700">Recent Transactions</h2>
                            </div>
                            <div class="divide-y divide-primary-700/10">
                                <div v-for="transaction in recentTransactions" :key="transaction.id"
                                    class="p-8">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <div class="h-12 w-12 rounded-full flex items-center justify-center"
                                                :class="transaction.type === 'EARNING' ? 'bg-green-100' : 'bg-primary-700/10'">
                                                <component
                                                    :is="transaction.type === 'EARNING' ? CurrencyDollarIcon : BanknotesIcon"
                                                    class="h-7 w-7"
                                                    :class="transaction.type === 'EARNING' ? 'text-green-600' : 'text-primary-700'" />
                                            </div>
                                        </div>
                                        <div class="ml-5 flex-1">
                                            <div class="flex items-center justify-between">
                                                <p class="text-sm font-medium text-primary-700">{{
                                                    transaction.description }}</p>
                                                <p class="text-sm font-semibold"
                                                    :class="transaction.type === 'EARNING' ? 'text-green-600' : 'text-primary-700'">
                                                    {{ transaction.type === 'EARNING' ? '+' : '-' }}${{
                                                        transaction.amount.toFixed(2) }}
                                                </p>
                                            </div>
                                            <div class="flex items-center justify-between mt-1">
                                                <p class="text-sm text-primary-700/60">
                                                    {{ transaction.user.name }} ({{ transaction.user.role }})
                                                </p>
                                                <p class="text-sm text-primary-700/60">
                                                    {{ formatDate(transaction.createdAt) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Calculator Tab -->
                    <div v-if="activeTab === 'calculator'"
                        class="bg-white rounded-lg shadow border border-primary-700/10">
                        <div class="px-8 py-5 border-b border-primary-700/10">
                            <h2 class="text-lg font-medium text-primary-700">Payment Calculator</h2>
                            <p class="mt-1 text-sm text-primary-700/60">Calculate platform fees and payments for loads
                            </p>
                        </div>
                        <div class="p-8">
                            <PaymentCalculator />
                        </div>
                    </div>
                </div>

                <!-- Payment History -->
                <div class="mt-8">
                    <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
                    <div class="bg-white rounded-lg shadow border border-primary-700/10">
                        <div class="px-8 py-5 border-b border-primary-700/10">
                            <h2 class="text-lg font-medium text-primary-700">Recent Payments</h2>
                        </div>
                        <div class="px-8 py-5 overflow-x-auto">
                            <!-- Loading state -->
                            <div v-if="isLoading" class="animate-pulse space-y-4">
                                <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
                                    <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
                                    <div class="flex-1">
                                        <div class="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                                        <div class="h-3 w-1/4 bg-gray-100 rounded"></div>
                                    </div>
                                    <div class="h-4 w-24 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            
                            <!-- Empty state -->
                            <div v-else-if="!recentPayments.length" class="py-8 text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <p class="mt-2 text-sm text-gray-500">No recent payments found</p>
                            </div>
                            
                            <!-- Data state -->
                            <table v-else class="min-w-full divide-y divide-primary-700/10">
                                <thead>
                                    <tr>
                                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary-700 sm:pl-0">Payment</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-primary-700">Load</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-primary-700">Amount</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-primary-700">Date</th>
                                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-primary-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-primary-700/10">
                                    <tr v-for="payment in recentPayments" :key="payment.id" class="hover:bg-primary-50 transition-colors">
                                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-700 sm:pl-0">{{ payment.id }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-500">{{ payment.load }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-500">${{ formatCurrency(payment.amount) }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-primary-500">{{ formatDate(payment.date) }}</td>
                                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                                            <span :class="getStatusClass(payment.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                                {{ payment.status }}
                                            </span>
                                        </td>
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
import {
    CurrencyDollarIcon,
    BanknotesIcon,
    ClipboardDocumentListIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
// import PaymentCalculator from '~/components/PaymentCalculator.vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend, 
    Filler
)

definePageMeta({
    layout: 'admin-dashboard',
    middleware: ['auth']
})

// Type definitions for transactions and payments
interface User {
    name: string;
    email: string;
    role: string;
}

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
    user: User;
    formattedDate: string;
}

interface Payment {
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    createdAt: string;
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    orderId: string;
    loadId?: string;
    truckId?: string;
}

interface ChartDataItem {
    month: string;
    year: number;
    platformFees: number;
    earnings: number;
    revenue: number;
    count: number;
}

// Type definitions for API responses
interface ApiAnalyticsResponse {
    totalPlatformFees?: number;
    totalEarnings?: number;
    totalTransactions?: number;
    recentTransactions?: Transaction[];
    monthlyRevenue?: ChartDataItem[];
}

interface ApiRecentPaymentsResponse {
    payments?: any[];
}

const activeTab = ref('analytics')
const totalPlatformFees = ref(0)
const totalProviderEarnings = ref(0)
const totalTransactions = ref(0)
const recentTransactions = ref<Transaction[]>([])
const recentPayments = ref<Payment[]>([])

// Chart data with proper types
const chartData = ref({
    labels: [] as string[],
    datasets: [
        {
            label: 'Revenue',
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            data: [] as number[],
            fill: true,
            tension: 0.4
        },
        {
            label: 'Platform Fees',
            borderColor: '#004599',
            backgroundColor: 'rgba(0, 69, 153, 0.1)',
            data: [] as number[],
            fill: true,
            tension: 0.4
        }
    ]
})

// Loading state
const isLoading = ref(true)

// Format date to readable format
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Chart options with better typing
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
                callback: function(value) {
                    return '$' + value.toLocaleString()
                }
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
}

// Helper functions
const formatCurrency = (value: number): string => {
    return parseFloat(value.toString()).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const getStatusClass = (status) => {
    const statusClasses = {
        'COMPLETED': 'bg-green-100 text-green-800',
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'PROCESSING': 'bg-blue-100 text-blue-800',
        'FAILED': 'bg-red-100 text-red-800'
    }
    
    return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

// Fetch analytics data
const fetchAnalytics = async () => {
    try {
        console.log('Fetching payment analytics...')
        isLoading.value = true
        
        // Use $fetch instead of useFetch for component that's already mounted
        const analyticsData = await $fetch('/api/admin/payments/analytics', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        
        console.log('Payment analytics response:', analyticsData)
        
        if (analyticsData) {
            // Handle the analytics data
            totalPlatformFees.value = analyticsData.totalPlatformFees || 0
            totalProviderEarnings.value = analyticsData.totalEarnings || 0
            totalTransactions.value = analyticsData.totalTransactions || 0
            
            // Handle recent transactions if available
            if (analyticsData.recentTransactions && Array.isArray(analyticsData.recentTransactions)) {
                recentTransactions.value = analyticsData.recentTransactions || []
            } else {
                console.warn('recentTransactions is not available or not an array')
                recentTransactions.value = []
            }

            // Update chart data with null checks
            if (analyticsData.monthlyRevenue && Array.isArray(analyticsData.monthlyRevenue) && analyticsData.monthlyRevenue.length > 0) {
                console.log('Updating chart data with monthly revenue:', analyticsData.monthlyRevenue)
                
                // Extract labels and datasets safely
                const labels = analyticsData.monthlyRevenue.map(item => item.month || '')
                const revenueData = analyticsData.monthlyRevenue.map(item => item.revenue || 0)
                const feesData = analyticsData.monthlyRevenue.map(item => item.platformFees || 0)
                
                // Create new object instead of mutating
                chartData.value = {
                    labels,
                    datasets: [
                        {
                            label: 'Revenue',
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            data: revenueData,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Platform Fees',
                            borderColor: '#004599',
                            backgroundColor: 'rgba(0, 69, 153, 0.1)',
                            data: feesData,
                            fill: true,
                            tension: 0.4
                        }
                    ]
                }
                console.log('Chart data updated successfully:', chartData.value)
            } else {
                console.warn('Monthly revenue data is not available:', analyticsData)
                // Reset chart data to empty arrays
                chartData.value = {
                    labels: ['No Data'],
                    datasets: [
                        {
                            label: 'Revenue',
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            data: [0],
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Platform Fees',
                            borderColor: '#004599',
                            backgroundColor: 'rgba(0, 69, 153, 0.1)',
                            data: [0],
                            fill: true,
                            tension: 0.4
                        }
                    ]
                }
            }
        }
    } catch (error) {
        console.error('Exception fetching analytics:', error)
        // Reset chart data on error
        chartData.value = {
            labels: ['Error'],
            datasets: [
                {
                    label: 'Revenue',
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    data: [0],
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Platform Fees',
                    borderColor: '#004599',
                    backgroundColor: 'rgba(0, 69, 153, 0.1)',
                    data: [0],
                    fill: true,
                    tension: 0.4
                }
            ]
        }
    } finally {
        isLoading.value = false
    }
}

// Fetch recent payments
const fetchRecentPayments = async () => {
    try {
        console.log('Fetching recent payments...')
        const { data, error } = await useFetch<ApiRecentPaymentsResponse>('/api/admin/payments/recent', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        
        if (error.value) {
            console.error('API error fetching recent payments:', error.value)
            return
        }
        
        console.log('Recent payments response:', data.value)
        
        if (data.value && data.value.payments && Array.isArray(data.value.payments)) {
            // Transform API data to match our Payment interface
            recentPayments.value = data.value.payments.map(payment => ({
                id: payment.id || '',
                type: payment.type || '',
                amount: payment.amount || 0,
                status: payment.status || '',
                description: payment.description || '',
                createdAt: payment.createdAt || '',
                userId: payment.userId || '',
                userName: payment.userName || payment.user?.firstName + ' ' + payment.user?.lastName || 'Unknown',
                userEmail: payment.userEmail || payment.user?.email || '',
                userRole: payment.userRole || payment.user?.role || '',
                orderId: payment.orderId || ''
            }));
        } else if (data.value && Array.isArray(data.value)) {
            // Transform API data to match our Payment interface
            recentPayments.value = data.value.map(payment => ({
                id: payment.id || '',
                type: payment.type || '',
                amount: payment.amount || 0,
                status: payment.status || '',
                description: payment.description || '',
                createdAt: payment.createdAt || '',
                userId: payment.userId || '',
                userName: payment.userName || payment.user?.firstName + ' ' + payment.user?.lastName || 'Unknown',
                userEmail: payment.userEmail || payment.user?.email || '',
                userRole: payment.userRole || payment.user?.role || '',
                orderId: payment.orderId || ''
            }));
        } else {
            console.warn('Recent payments is not an array:', data.value)
            recentPayments.value = []
        }
    } catch (error) {
        console.error('Exception fetching recent payments:', error)
    }
}

// Handle tab changes
const handleTabChange = (tab: string) => {
    // Clean up any chart instances before changing tabs
    try {
        const charts = document.querySelectorAll('canvas')
        charts.forEach(canvas => {
            try {
                const chartInstance = ChartJS.getChart(canvas)
                if (chartInstance) {
                    chartInstance.destroy()
                }
            } catch (error) {
                console.error('Error destroying chart:', error)
            }
        })
    } catch (error) {
        console.error('Error in handleTabChange:', error)
    }
    
    activeTab.value = tab
}

// Refresh all data
const refreshData = async () => {
    isLoading.value = true
    try {
        await Promise.all([
            fetchAnalytics(),
            fetchRecentPayments()
        ])
    } catch (error) {
        console.error('Error refreshing data:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchAnalytics()
    fetchRecentPayments()
})

// Clean up when component is unmounted
onUnmounted(() => {
    // Initialize chart data with empty arrays instead of null
    chartData.value = {
        labels: [],
        datasets: [
            {
                label: 'Revenue',
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                data: [],
                fill: true,
                tension: 0.4
            },
            {
                label: 'Platform Fees',
                borderColor: '#004599',
                backgroundColor: 'rgba(0, 69, 153, 0.1)',
                data: [],
                fill: true,
                tension: 0.4
            }
        ]
    }
    
    // Clean up any chart instances
    try {
        const charts = document.querySelectorAll('canvas')
        charts.forEach(canvas => {
            try {
                const chartInstance = ChartJS.getChart(canvas)
                if (chartInstance) {
                    chartInstance.destroy()
                }
            } catch (error) {
                console.error('Error destroying chart:', error)
            }
        })
    } catch (error) {
        console.error('Error in onUnmounted:', error)
    }
})
</script>