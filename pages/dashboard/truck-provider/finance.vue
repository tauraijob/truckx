<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-8">
            <!-- Page Header -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-semibold text-gray-800">Financial Overview</h1>
                <button
                    class="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-md flex items-center transition-colors"
                    @click="refreshFinanceData"
                >
                    <div v-if="loading" class="mr-2 h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <ArrowPathIcon v-else class="h-5 w-5 mr-2" />
                    {{ loading ? 'Loading...' : 'Refresh' }}
                </button>
            </div>

            <!-- Finance Summary -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <!-- Total Earnings Card -->
                <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                    <div class="flex items-center">
                        <div class="p-4 rounded-full bg-green-100">
                            <BanknotesIcon class="h-7 w-7 text-green-600" />
                        </div>
                        <div class="ml-5">
                            <p class="text-sm font-medium text-primary-700">Total Earnings</p>
                            <p v-if="loading" class="text-3xl font-semibold text-primary-700 mt-1">
                                <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                            </p>
                            <p v-else class="text-3xl font-semibold text-primary-700 mt-1">${{ formatCurrency(financeSummary.totalEarnings) }}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center">
                        <span v-if="loading" class="text-sm text-green-600 font-medium">
                            <span class="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded"></span>
                        </span>
                        <span v-else class="text-sm text-green-600 font-medium">${{ formatCurrency(financeSummary.earningsThisMonth) }} this month</span>
                    </div>
                </div>
                
                <!-- Received Payments Card -->
                <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                    <div class="flex items-center">
                        <div class="p-4 rounded-full bg-blue-100">
                            <CreditCardIcon class="h-7 w-7 text-blue-600" />
                        </div>
                        <div class="ml-5">
                            <p class="text-sm font-medium text-primary-700">Payments Received</p>
                            <p v-if="loading" class="text-3xl font-semibold text-primary-700 mt-1">
                                <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                            </p>
                            <p v-else class="text-3xl font-semibold text-primary-700 mt-1">${{ formatCurrency(financeSummary.paymentsReceived) }}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center">
                        <span v-if="loading" class="text-sm text-blue-600 font-medium">
                            <span class="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded"></span>
                        </span>
                        <span v-else class="text-sm text-blue-600 font-medium">{{ financeSummary.completedOrders }} completed orders</span>
                    </div>
                </div>
                
                <!-- Pending Card -->
                <div class="rounded-lg border border-primary-700/10 bg-white p-6 shadow-sm">
                    <div class="flex items-center">
                        <div class="p-4 rounded-full bg-yellow-100">
                            <ClockIcon class="h-7 w-7 text-yellow-600" />
                        </div>
                        <div class="ml-5">
                            <p class="text-sm font-medium text-primary-700">Pending Earnings</p>
                            <p v-if="loading" class="text-3xl font-semibold text-primary-700 mt-1">
                                <span class="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                            </p>
                            <p v-else class="text-3xl font-semibold text-primary-700 mt-1">${{ formatCurrency(financeSummary.pendingEarnings) }}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center">
                        <span v-if="loading" class="text-sm text-yellow-600 font-medium">
                            <span class="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded"></span>
                        </span>
                        <span v-else class="text-sm text-yellow-600 font-medium">{{ financeSummary.pendingOrders }} pending orders</span>
                    </div>
                </div>
            </div>

            <!-- Transactions List -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-6 py-4 border-b border-primary-700/10">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-medium text-primary-700">Recent Transactions</h2>
                        <div class="flex items-center space-x-2">
                            <select v-model="timeFilter" class="text-sm border-gray-300 rounded-md">
                                <option value="all">All time</option>
                                <option value="month">Last 30 days</option>
                                <option value="week">Last 7 days</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div v-if="loading" class="py-10 text-center">
                    <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
                    <p class="mt-2 text-sm text-gray-600">Loading transactions...</p>
                </div>
                <div v-else-if="transactions.length === 0" class="py-10 text-center">
                    <ReceiptRefundIcon class="h-12 w-12 mx-auto text-gray-400" />
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No transactions</h3>
                    <p class="mt-1 text-sm text-gray-500">No financial transactions found for the selected period.</p>
                </div>
                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Order ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(transaction.date) }}</td>
                                <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.orderId }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.type }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="transaction.type === 'EARNING' ? 'text-green-600' : 'text-gray-900'">
                                    {{ transaction.type === 'EARNING' ? '+' : '' }}${{ transaction.amount.toFixed(2) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" :class="getStatusClass(transaction.status)">
                                        {{ transaction.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
    BanknotesIcon, 
    CreditCardIcon,
    ClockIcon, 
    ArrowPathIcon,
    ReceiptRefundIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'truck-provider-dashboard',
    middleware: ['auth']
})

// Finance summary
interface FinanceSummary {
    totalEarnings: number;
    earningsThisMonth: number;
    paymentsReceived: number;
    pendingEarnings: number;
    completedOrders: number;
    pendingOrders: number;
}

// Transaction interface
interface Transaction {
    id: string;
    date: Date;
    description: string;
    orderId: string;
    type: 'EARNING' | 'FEE' | 'REFUND';
    amount: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

const financeSummary = ref<FinanceSummary>({
    totalEarnings: 0,
    earningsThisMonth: 0,
    paymentsReceived: 0,
    pendingEarnings: 0,
    completedOrders: 0,
    pendingOrders: 0
})

const transactions = ref<Transaction[]>([])
const loading = ref(true)
const timeFilter = ref('month')

// Format date
function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// Format currency
function formatCurrency(value: number): string {
    if (value === null || value === undefined) {
        return '0.00';
    }
    return parseFloat(value.toString()).toLocaleString('en-US', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    })
}

// Get status styling class
function getStatusClass(status: string): string {
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

// Fetch finance data
async function fetchFinanceData() {
    loading.value = true
    
    try {
        // Mock data for now - will be replaced with actual API call
        setTimeout(() => {
            financeSummary.value = {
                totalEarnings: 28950.00,
                earningsThisMonth: 5325.00,
                paymentsReceived: 22125.00,
                pendingEarnings: 6825.00,
                completedOrders: 18,
                pendingOrders: 5
            }
            
            transactions.value = [
                {
                    id: '1',
                    date: new Date('2025-04-05'),
                    description: 'Earnings for order #A1234',
                    orderId: 'A1234',
                    type: 'EARNING',
                    amount: 2150.00,
                    status: 'COMPLETED'
                },
                {
                    id: '2',
                    date: new Date('2025-04-03'),
                    description: 'Platform fee for order #A1234',
                    orderId: 'A1234',
                    type: 'FEE',
                    amount: 215.00,
                    status: 'COMPLETED'
                },
                {
                    id: '3',
                    date: new Date('2025-04-01'),
                    description: 'Earnings for order #A1235',
                    orderId: 'A1235',
                    type: 'EARNING',
                    amount: 1875.00,
                    status: 'PENDING'
                }
            ]
            
            loading.value = false
        }, 1000)
        
        // Actual API implementation would be:
        // const token = localStorage.getItem('token')
        // const { data, error } = await useFetch('/api/truck-provider/finance/summary', {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // })
        // if (data.value) financeSummary.value = data.value
        //
        // const { data: transactionsData, error: transactionsError } = await useFetch('/api/truck-provider/finance/transactions', {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     },
        //     query: {
        //         timeFilter: timeFilter.value
        //     }
        // })
        // if (transactionsData.value) transactions.value = transactionsData.value
    } catch (error) {
        console.error('Error fetching finance data:', error)
    } finally {
        // loading.value = false
    }
}

function refreshFinanceData() {
    fetchFinanceData()
}

onMounted(() => {
    fetchFinanceData()
})
</script> 