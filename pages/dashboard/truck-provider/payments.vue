<template>
    <div class="min-h-screen px-6 py-8">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-800">Payments</h1>
            <button 
                @click="fetchPayments" 
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
                <h2 class="text-lg font-medium text-gray-700">Delivery Earnings</h2>
                <div class="flex flex-col items-center justify-center text-center">
                    <h2 class="text-lg font-semibold mb-2">Total Earnings</h2>
                    <p class="text-2xl font-bold text-gray-800">
                        <span v-if="isLoading" class="inline-block w-24 h-8 bg-gray-200 animate-pulse rounded"></span>
                        <span v-else>${{ formatCurrency(paymentSummary.totalEarnings) }}</span>
                    </p>
                    <p class="text-sm text-gray-500">After 2% platform fee</p>
                </div>

                <div class="mt-4 flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-600">
                        {{ formatCurrency(paymentSummary.totalPaymentAmount || 0) }} Total Payment Amount
                    </p>
                    <button @click="activeTab = 'history'" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                        View History →
                    </button>
                </div>
            </div>
        </div>

        <!-- Payment Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <!-- Gross Earnings Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Before Platform Fee</p>
                    <div class="flex flex-col items-center justify-center text-center">
                        <h2 class="text-lg font-semibold mb-2">Gross Earnings</h2>
                        <p class="text-2xl font-bold text-gray-800">
                            <span v-if="isLoading" class="inline-block w-24 h-8 bg-gray-200 animate-pulse rounded"></span>
                            <span v-else>${{ formatCurrency(paymentSummary.totalPaymentAmount || 0) }}</span>
                        </p>
                        <p class="text-sm text-gray-500">Total delivery payments</p>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        100% of load payments
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
                            <span v-else>${{ formatCurrency(paymentSummary.totalPlatformFees) }}</span>
                        </p>
                        <p class="text-sm text-gray-500">2% transaction fee</p>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ Math.round((paymentSummary.totalPlatformFees / (paymentSummary.totalPaymentAmount || 1)) * 100) }}% of total
                    </div>
                </div>
            </div>
            
            <!-- Completed Loads Card -->
            <div class="bg-white rounded-lg shadow p-6">
                <div v-if="isLoading" class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div v-else>
                    <p class="text-sm font-medium text-gray-500">Completed Loads</p>
                    <p class="mt-1 text-2xl font-semibold text-blue-600">{{ paymentSummary.totalPayments }}</p>
                    <div class="mt-2 text-xs text-gray-500">
                        {{ formatCurrency(paymentSummary.totalPaymentAmount || 0) }} in total value
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button @click="activeTab = 'history'"
                    :class="[activeTab === 'history' ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                    Payment History
                </button>
                <button @click="activeTab = 'calculator'"
                    :class="[activeTab === 'calculator' ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm']">
                    Payment Calculator
                </button>
            </nav>
        </div>

        <!-- Payment History -->
        <div v-if="activeTab === 'history'" class="bg-white rounded-lg shadow mb-6">
            <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900">Payment History</h2>
                <div class="text-sm text-gray-500 flex items-center">
                    <InformationCircleIcon class="h-5 w-5 mr-1 text-gray-400" />
                    <span>A 2% platform fee is applied to all payments</span>
                </div>
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
            <div v-else-if="payments.length === 0" class="p-8 text-center">
                <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-base font-medium text-gray-900">No payments found</h3>
                <p class="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                    Payments will appear here when you've completed deliveries. 
                    All earnings have a 2% platform fee deducted automatically.
                </p>
                
                <div class="mt-6">
                    <h4 class="text-sm font-medium text-gray-900">Why am I not seeing any payments?</h4>
                    <ul class="mt-2 text-sm text-gray-500 list-disc pl-5 text-left max-w-md mx-auto">
                        <li>You haven't accepted any delivery jobs yet</li>
                        <li>Your accepted deliveries are still in progress</li>
                        <li>No payments have been processed for your completed deliveries</li>
                    </ul>
                </div>
            </div>

            <!-- Payment List -->
            <div v-else>
                <ul role="list" class="divide-y divide-gray-200">
                    <li v-for="payment in payments" :key="payment.id" class="px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col">
                                <div class="flex items-center">
                                    <p class="text-sm font-medium text-gray-900">{{ payment.description }}</p>
                                    <span 
                                        class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                    >
                                        Completed
                                    </span>
                                </div>
                                <div class="flex items-center text-sm text-gray-500">
                                    <p>{{ payment.order.load.title }}</p>
                                    <span class="mx-1">•</span>
                                    <p>{{ formatDate(payment.createdAt) }}</p>
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    <span>Original amount: ${{ formatCurrency(payment.order.load.price) }}</span>
                                    <span class="mx-1">•</span>
                                    <span>Platform fee: ${{ formatCurrency(payment.order.load.price * 0.02) }}</span>
                                </div>
                            </div>
                            <div>
                                <span class="text-sm font-medium text-green-600">
                                    ${{ formatCurrency(payment.amount) }}
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Payment Calculator Tab -->
        <div v-if="activeTab === 'calculator'" class="bg-white rounded-lg shadow mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Payment Calculator</h2>
            </div>
            <div class="p-6">
                <PaymentCalculator />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    CurrencyDollarIcon,
    BanknotesIcon,
    ClipboardDocumentListIcon,
    InformationCircleIcon,
    DocumentIcon,
    CreditCardIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'
// import PaymentCalculator from '~/components/PaymentCalculator.vue'
import { formatCurrency } from '~/utils/formatters'

definePageMeta({
    layout: 'truck-provider-dashboard',
    middleware: ['auth', 'truck-provider']
})

const activeTab = ref('history')
const payments = ref([])
const paymentSummary = ref({
    totalEarnings: 0,
    totalPlatformFees: 0,
    totalPayments: 0,
    totalPaymentAmount: 0
})
const isLoading = ref(false)

// Format date to readable format
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// Fetch payments data
const fetchPayments = async () => {
    isLoading.value = true
    try {
        const { data } = await useFetch('/api/payments')
        if (data.value) {
            payments.value = data.value.payments
            paymentSummary.value = data.value.summary
        }
    } catch (error) {
        console.error('Error fetching payments:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchPayments()
})
</script>