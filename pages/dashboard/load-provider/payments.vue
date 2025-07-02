<template>
    <div class="min-h-screen px-6 py-8">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Payments</h1>
            <button 
                @click="fetchPaymentData" 
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
                <div class="flex flex-col items-center justify-center text-center">
                    <h2 class="text-lg font-semibold mb-2">Total Amount</h2>
                    <p class="text-2xl font-bold text-gray-800">
                        <span v-if="isLoading" class="inline-block w-24 h-8 bg-gray-200 animate-pulse rounded"></span>
                        <span v-else>${{ formatCurrency(totalPaymentAmount) }}</span>
                    </p>
                    <p class="text-sm text-gray-500">All Delivery Payments</p>
                </div>

                <div class="mt-4 flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-600">
                        {{ formatCurrency(financeData?.thisMonthTotal || 0) }} This Month
                    </p>
                    <button @click="scrollToDetails" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                        Details →
                    </button>
                </div>
            </div>
        </div>

        <!-- Payment Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <!-- Provider Payments Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">To Truck Providers</p>
                    <div class="flex flex-col items-center justify-center text-center">
                        <h2 class="text-lg font-semibold mb-2">Provider Payments</h2>
                        <p class="text-2xl font-bold text-gray-800">
                            <span v-if="isLoading" class="inline-block w-24 h-8 bg-gray-200 animate-pulse rounded"></span>
                            <span v-else>${{ formatCurrency(totalTruckProviderAmount) }}</span>
                        </p>
                        <p class="text-sm text-gray-500">Amount paid to truck providers</p>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ Math.round((totalTruckProviderAmount / (totalPaymentAmount || 1)) * 100) }}% of total
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
                    <div class="flex flex-col items-center justify-center text-center">
                        <h2 class="text-lg font-semibold mb-2">Platform Fees</h2>
                        <p class="text-2xl font-bold text-gray-800">
                            <span v-if="isLoading" class="inline-block w-24 h-8 bg-gray-200 animate-pulse rounded"></span>
                            <span v-else>${{ formatCurrency(totalPlatformFeeAmount) }}</span>
                        </p>
                        <p class="text-sm text-gray-500">2% transaction fee</p>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ Math.round((totalPlatformFeeAmount / (totalPaymentAmount || 1)) * 100) }}% of total
                    </div>
                </div>
            </div>
            
            <!-- Accepted Orders Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Accepted Orders</p>
                    <p class="mt-1 text-2xl font-semibold text-yellow-600">{{ pendingPayments?.length || 0 }}</p>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ formatCurrency(pendingPayments?.reduce((total, p) => total + (p?.amount || 0), 0) || 0) }} in value
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment History -->
        <div ref="paymentHistoryRef" class="bg-white rounded-lg shadow mb-6">
            <div class="border-b border-gray-200 px-6 py-4">
                <h2 class="text-lg font-medium text-gray-900">Payment History</h2>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="p-6 space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse flex space-x-4">
                    <div class="flex-1 space-y-2 py-1">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div class="h-12 bg-gray-200 rounded-md w-24"></div>
                </div>
            </div>

            <!-- No Payments State -->
            <div v-else-if="transactions.length === 0" class="p-8 text-center">
                <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-base font-medium text-gray-900">No payments found</h3>
                <p class="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                    Payments will appear here when you've completed transactions for your loads. 
                    Payments include both money paid to truck providers and platform fees.
                </p>
                
                <div class="mt-6">
                    <h4 class="text-sm font-medium text-gray-900">Why am I not seeing any payments?</h4>
                    <ul class="mt-2 text-sm text-gray-500 list-disc pl-5 text-left max-w-md mx-auto">
                        <li>You haven't created any loads yet</li>
                        <li>Your loads haven't been accepted by any truck providers</li>
                        <li>No payments have been processed for your loads</li>
                    </ul>
                </div>
            </div>

            <!-- Payment List -->
            <div v-else>
                <ul role="list" class="divide-y divide-gray-200">
                    <li v-for="transaction in transactions" :key="transaction.id" class="px-6 py-4">
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
                                    <p v-if="transaction.orderDetails">{{ transaction.orderDetails.loadName }}</p>
                                    <p v-else>Order #{{ transaction.orderId.substring(0, 8) }}</p>
                                    <span class="mx-1">•</span>
                                    <p>{{ formatDate(transaction.createdAt) }}</p>
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
            </div>
        </div>

        <!-- Pending Payments & Calculator Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Pending Payments Section -->
            <div class="bg-white rounded-lg shadow">
                <div class="border-b border-gray-200 px-6 py-4">
                    <h2 class="text-lg font-medium text-gray-900">Accepted Loads</h2>
                    <p class="mt-1 text-sm text-gray-500">Orders that have been accepted and are awaiting payment</p>
                </div>
                <div v-if="isLoading" class="p-6 animate-pulse space-y-4">
                    <div v-for="i in 2" :key="i" class="flex space-x-4">
                        <div class="flex-1 space-y-2 py-1">
                            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div class="h-10 bg-gray-200 rounded-md w-20"></div>
                    </div>
                </div>
                <div v-else-if="pendingPayments.length === 0" class="p-6 text-center">
                    <p class="text-sm text-gray-500">No accepted loads awaiting payment at this time.</p>
                </div>
                <div v-else class="divide-y divide-gray-200">
                    <div v-for="payment in pendingPayments" :key="payment.id" class="px-6 py-4 flex justify-between items-center">
                        <div>
                            <p class="text-sm font-medium text-gray-900">{{ payment.loadTitle }}</p>
                            <p class="text-xs text-gray-500">Truck: {{ payment.truckInfo }}</p>
                        </div>
                        <p class="text-sm font-medium text-gray-900">{{ formatCurrency(payment.amount) }}</p>
                    </div>
                </div>
            </div>

            <!-- Payment Calculator Section -->
            <div class="bg-white rounded-lg shadow">
                <div class="border-b border-gray-200 px-6 py-4">
                    <h2 class="text-lg font-medium text-gray-900">Payment Calculator</h2>
                </div>
                <div class="p-6">
                    <p class="text-sm text-gray-500 mb-4">
                        Calculate the total cost including platform fees for a load.
                    </p>
                    <div class="space-y-4">
                        <div>
                            <label for="loadPrice" class="block text-sm font-medium text-gray-700">Load Price ($)</label>
                            <input 
                                type="number" 
                                id="loadPrice" 
                                v-model="calculatorPrice" 
                                min="0" 
                                step="0.01"
                                class="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                            />
                        </div>
                        <div class="pt-4 border-t border-gray-200">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Platform Fee (2%):</span>
                                <span class="font-medium text-gray-900">{{ formatCurrency(calculatedFee) }}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-2">
                                <span class="text-gray-500">To Truck Provider:</span>
                                <span class="font-medium text-gray-900">{{ formatCurrency(calculatedProvider) }}</span>
                            </div>
                            <div class="flex justify-between text-sm font-medium mt-4 pt-4 border-t border-gray-200">
                                <span>Total Cost:</span>
                                <span>{{ formatCurrency(calculatorPrice) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Calculator -->
        <div class="bg-white shadow rounded-lg p-6 mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Payment Calculator</h2>
            <div class="mb-4">
                <label for="load-amount" class="block text-sm font-medium text-gray-700">Load Amount ($)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input 
                        type="number"
                        id="load-amount"
                        v-model="calculatorPrice"
                        class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="1000.00"
                        min="0"
                        step="1"
                    />
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mt-4">
                <div class="rounded-md bg-gray-50 p-4">
                    <p class="text-sm font-medium text-gray-500">Load Amount</p>
                    <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(calculatorPrice) }}</p>
                </div>
                <div class="rounded-md bg-gray-50 p-4">
                    <p class="text-sm font-medium text-gray-500">Platform Fee (2%)</p>
                    <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(calculatedFee) }}</p>
                </div>
                <div class="rounded-md bg-green-50 p-4">
                    <p class="text-sm font-medium text-green-700">You Receive</p>
                    <p class="text-lg font-semibold text-green-900">{{ formatCurrency(calculatedProvider) }}</p>
                </div>
            </div>
            
            <p class="text-sm text-gray-500 mt-4">
                This calculator helps you estimate your earnings after the platform fee. For each load, a 2% platform fee is applied, and the rest goes directly to you.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowPathIcon, CreditCardIcon } from '@heroicons/vue/24/outline'
import { getStatusClass, formatCurrency, formatDate } from '~/utils/formatters'
import { useToast } from '~/composables/useToast'

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
    status: string
    createdAt: string
    type?: string
    orderDetails?: {
        loadName: string
        truckName: string
        providerName: string
    }
}

interface PendingPayment {
    id: string
    loadTitle: string
    truckInfo: string
    amount: number
}

interface FinanceData {
    currentBalance: number
    totalPaid: number
    pendingAmount: number
    platformFees: number
    providerPayments: number
    thisMonthTotal: number
}

// State
const transactions = ref<Transaction[]>([])
const pendingPayments = ref<PendingPayment[]>([])
const financeData = ref<FinanceData>({
    currentBalance: 0,
    totalPaid: 0,
    pendingAmount: 0,
    platformFees: 0,
    providerPayments: 0,
    thisMonthTotal: 0
})
const isLoading = ref(true)
const calculatorPrice = ref(1000)

// Ref for scrolling to payment history
const paymentHistoryRef = ref<HTMLElement | null>(null)

// Scroll to payment history
const scrollToDetails = () => {
    if (paymentHistoryRef.value) {
        paymentHistoryRef.value.scrollIntoView({ behavior: 'smooth' })
    }
}

// Computed
const calculatedFee = computed(() => {
    return calculatorPrice.value * 0.02
})

const calculatedProvider = computed(() => {
    return calculatorPrice.value - calculatedFee.value
})

// Calculate total payment amount including accepted orders
const totalPaymentAmount = computed(() => {
    const completedAmount = financeData.value?.totalPaid || 0
    const pendingAmount = pendingPayments.value?.reduce((total, p) => total + (p?.amount || 0), 0) || 0
    return completedAmount + pendingAmount
})

// Calculate total amount paid to truck providers including accepted orders
const totalTruckProviderAmount = computed(() => {
    const completedProviderAmount = financeData.value?.providerPayments || 0
    const pendingProviderAmount = pendingPayments.value?.reduce((total, p) => {
        // Providers get 98% of the load price (2% goes to platform fee)
        return total + ((p?.amount || 0) * 0.98)
    }, 0) || 0
    return completedProviderAmount + pendingProviderAmount
})

// Calculate total platform fees including accepted orders
const totalPlatformFeeAmount = computed(() => {
    const completedFees = financeData.value?.platformFees || 0
    const pendingFees = pendingPayments.value?.reduce((total, p) => {
        // Platform fee is 2% of the load price
        return total + ((p?.amount || 0) * 0.02)
    }, 0) || 0
    return completedFees + pendingFees
})

// Methods
const fetchPaymentData = async () => {
    isLoading.value = true
    const toast = useToast()
    try {
        const token = localStorage.getItem('token')
        const { data, error } = await useFetch('/api/load-provider/payments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (error.value) throw error.value
        const apiData = data.value
        // Set financial data
        financeData.value = {
            currentBalance: 0, // Not provided by API
            totalPaid: apiData?.summary?.totalSpent || 0,
            pendingAmount: 0, // Not provided by API
            platformFees: apiData?.summary?.platformFees || 0,
            providerPayments: apiData?.summary?.providerPayments || 0,
            thisMonthTotal: 0 // Not provided by API
        }
        // Process transactions
        if (apiData?.payments && Array.isArray(apiData.payments)) {
            transactions.value = apiData.payments.map((p: any) => ({
                id: p.id,
                orderId: p.order?.id || '',
                description: p.description || (p.type === 'PLATFORM_FEE' ? 'Platform Fee' : 'Provider Payment'),
                amount: p.amount,
                status: p.type === 'PLATFORM_FEE' ? 'FEE' : 'COMPLETED',
                createdAt: p.createdAt,
                type: p.type,
                orderDetails: {
                    loadName: p.order?.load?.title || '',
                    truckName: p.order?.truck?.name || '',
                    providerName: ''
                }
            }))
        } else {
            transactions.value = []
        }
        // No direct pendingPayments in this API, so clear it
        pendingPayments.value = []
        toast.success('Payment data loaded successfully')
    } catch (error) {
        console.error('Error fetching payment data:', error)
        toast.error('Failed to load payment data')
        financeData.value = {
            currentBalance: 0,
            totalPaid: 0,
            pendingAmount: 0,
            platformFees: 0,
            providerPayments: 0,
            thisMonthTotal: 0
        }
        transactions.value = []
        pendingPayments.value = []
    } finally {
        isLoading.value = false
    }
}

// Fetch data on component mount
onMounted(() => {
    fetchPaymentData()
})
</script>