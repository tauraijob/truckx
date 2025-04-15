<template>
    <div class="min-h-screen px-6 py-8">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Finances</h1>
            <button 
                @click="fetchFinanceData" 
                class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                :disabled="isLoading"
            >
                <ArrowPathIcon v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
                <ArrowPathIcon v-else class="h-4 w-4 mr-2" />
                {{ isLoading ? 'Loading...' : 'Refresh' }}
            </button>
        </div>

        <!-- Delivery Payments Section -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div v-if="isLoading" class="animate-pulse space-y-4">
                <div class="h-8 bg-gray-200 rounded w-1/4"></div>
                <div class="h-10 bg-gray-200 rounded w-1/3"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div v-else>
                <h2 class="text-lg font-medium text-gray-700">Delivery Payments</h2>
                <p class="mt-2 text-3xl font-bold text-gray-900">
                    {{ formatCurrency(financeData.totalPaid) }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                    Total amount for accepted & completed deliveries
                </p>

                <div class="mt-4 flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-600">
                        {{ formatCurrency(thisMonthPayments) }} This Month
                    </p>
                    <NuxtLink to="/dashboard/load-provider/payments" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                        Details →
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
            <!-- Balance Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Current Balance</p>
                    <p class="mt-1 text-2xl font-semibold text-gray-900">{{ formatCurrency(financeData.currentBalance) }}</p>
                </div>
            </div>

            <!-- Paid Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Total Spent</p>
                    <p class="mt-1 text-2xl font-semibold text-green-600">{{ formatCurrency(financeData.totalPaid) }}</p>
                </div>
            </div>
            
            <!-- Pending Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Pending Payments</p>
                    <p class="mt-1 text-2xl font-semibold text-yellow-600">{{ formatCurrency(financeData.pendingAmount) }}</p>
                </div>
            </div>

            <!-- Provider Payments Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">To Truck Providers</p>
                    <p class="mt-1 text-2xl font-semibold text-blue-600">{{ formatCurrency(financeData.providerPayments) }}</p>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ Math.round((financeData.providerPayments / (financeData.totalPaid || 1)) * 100) }}% of total
                    </div>
                </div>
            </div>

            <!-- Platform Fees Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Platform Fees</p>
                    <p class="mt-1 text-2xl font-semibold text-gray-900">{{ formatCurrency(financeData.platformFees) }}</p>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ Math.round((financeData.platformFees / (financeData.totalPaid || 1)) * 100) }}% of total
                    </div>
                </div>
            </div>
        </div>

        <!-- Transaction History -->
        <div class="bg-white rounded-lg shadow mb-6">
            <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">Transaction History</h2>
                <div class="flex space-x-2">
                    <select 
                        v-model="filter" 
                        class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Transactions</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="p-6 space-y-4">
                <div v-for="i in 5" :key="i" class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-2 py-1">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div class="h-12 bg-gray-200 rounded-md w-24"></div>
                </div>
            </div>

            <!-- No Transactions State -->
            <div v-else-if="transactions.length === 0" class="p-6 text-center">
                <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-base font-medium text-gray-900">No transactions found</h3>
                <p class="mt-1 text-sm text-gray-500">
                    Your transaction history will appear here once you have some activity.
                </p>
            </div>

            <!-- Transaction List -->
            <ul v-else role="list" class="divide-y divide-gray-200">
                <li v-for="transaction in filteredTransactions" :key="transaction.id" class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <div class="flex items-center">
                                <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                                <span 
                                    :class="getStatusClass(transaction.status)"
                                    class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                                >
                                    {{ transaction.status }}
                                </span>
                            </div>
                            <div class="flex items-center text-sm text-gray-500">
                                <p>Order #{{ transaction.orderId.substring(0, 8) }}</p>
                                <span class="mx-1">•</span>
                                <p>{{ formatDate(transaction.date) }}</p>
                            </div>
                        </div>
                        <div>
                            <span :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                                {{ formatCurrency(transaction.amount) }}
                            </span>
                        </div>
                    </div>
                </li>
            </ul>

            <!-- Pagination -->
            <div class="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    Showing <span class="font-medium">{{ transactions.length ? 1 : 0 }}</span> to 
                    <span class="font-medium">{{ transactions.length }}</span> of 
                    <span class="font-medium">{{ transactions.length }}</span> results
                </div>
                <div class="flex space-x-2">
                    <button 
                        disabled
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Previous
                    </button>
                    <button 
                        disabled
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Payment Methods -->
        <div class="bg-white rounded-lg shadow">
            <div class="border-b border-gray-200 px-6 py-4">
                <h2 class="text-lg font-medium text-gray-900">Payment Methods</h2>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <BanknotesIcon class="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-sm font-medium text-gray-900">Bank Account</h3>
                            <p class="text-sm text-gray-500">
                                {{ financeData.bankInfo ? `****${financeData.bankInfo.accountLast4}` : 'No bank account set up' }}
                            </p>
                        </div>
                    </div>
                    <button class="text-sm font-medium text-primary-600 hover:text-primary-500">
                        {{ financeData.bankInfo ? 'Update' : 'Add' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowPathIcon, CurrencyDollarIcon, BanknotesIcon } from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'load-provider-dashboard',
    middleware: ['auth']
})

// Types
interface Transaction {
    id: string
    orderId: string
    description: string
    amount: number
    status: 'COMPLETED' | 'PENDING' | 'FAILED'
    date: string
}

interface FinanceData {
    currentBalance: number
    totalPaid: number
    pendingAmount: number
    platformFees: number
    bankInfo: {
        accountLast4: string
    } | null
    providerPayments: number
    thisMonthTotal: number
}

// State
const transactions = ref<Transaction[]>([])
const financeData = ref<FinanceData>({
    currentBalance: 0,
    totalPaid: 0,
    pendingAmount: 0,
    platformFees: 0,
    bankInfo: null,
    providerPayments: 0,
    thisMonthTotal: 0
})
const isLoading = ref(true)
const filter = ref('all')

// Computed
const filteredTransactions = computed(() => {
    if (filter.value === 'all') return transactions.value
    return transactions.value.filter(t => t.status.toLowerCase() === filter.value)
})

const thisMonthPayments = computed(() => {
    return financeData.value.thisMonthTotal || 0
})

// Methods
const fetchFinanceData = async () => {
    isLoading.value = true
    
    try {
        // Get token from localStorage
        const token = localStorage.getItem('token')
        console.log('Fetching finance data with token:', token ? 'Available' : 'Not available')
        
        // Make API call to get financial data from accepted loads
        const response = await $fetch('/api/load-provider/finances', {
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        })
        
        console.log('Finance data response:', response)
        
        if (response) {
            financeData.value = {
                currentBalance: response.currentBalance || 0,
                totalPaid: response.totalPaid || 0,
                pendingAmount: response.pendingAmount || 0,
                platformFees: response.platformFees || 0,
                bankInfo: response.bankInfo || null,
                providerPayments: response.providerPayments || 0,
                thisMonthTotal: response.thisMonthTotal || 0
            }
            
            // Map transactions data
            if (response.transactions && Array.isArray(response.transactions)) {
                transactions.value = response.transactions.map((t: any) => ({
                    id: t.id,
                    orderId: t.orderId || '',
                    description: t.description || '',
                    amount: t.amount || 0,
                    status: t.status || 'PENDING',
                    date: t.createdAt || new Date().toISOString()
                }))
            }
            
            console.log('Processed finance data:', {
                financeData: financeData.value,
                transactionsCount: transactions.value.length
            })
        }
    } catch (error) {
        console.error('Error fetching finance data:', error)
        
        // Fallback to empty data on error
        financeData.value = {
            currentBalance: 0,
            totalPaid: 0,
            pendingAmount: 0,
            platformFees: 0,
            bankInfo: null,
            providerPayments: 0,
            thisMonthTotal: 0
        }
        
        transactions.value = []
    } finally {
        isLoading.value = false
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'bg-green-100 text-green-800'
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800'
        case 'FAILED':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

// Fetch data on component mount
onMounted(() => {
    fetchFinanceData()
})
</script> 