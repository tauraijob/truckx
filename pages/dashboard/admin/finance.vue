<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Finance</h1>
      <button 
        @click="fetchFinanceData" 
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        :disabled="isLoading"
      >
        <ArrowPathIcon v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
        {{ isLoading ? 'Loading...' : 'Refresh Data' }}
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <!-- Total Revenue -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4">
          <div v-if="isLoading" class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else>
            <h3 class="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(totalRevenue, 'REVENUE') }}</p>
          </div>
        </div>
      </div>

      <!-- Platform Fees -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4">
          <div v-if="isLoading" class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else>
            <h3 class="text-gray-500 text-sm font-medium mb-1">Platform Fees</h3>
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(platformFees, 'PLATFORM_FEE') }}</p>
          </div>
        </div>
      </div>

      <!-- Provider Earnings -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4">
          <div v-if="isLoading" class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else>
            <h3 class="text-gray-500 text-sm font-medium mb-1">Provider Earnings</h3>
            <p class="text-3xl font-bold text-red-600">{{ formatCurrency(providerEarnings, 'EARNING') }}</p>
          </div>
        </div>
      </div>

      <!-- Pending Payments -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4">
          <div v-if="isLoading" class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div v-else>
            <h3 class="text-gray-500 text-sm font-medium mb-1">Pending Payments</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ formatCurrency(pendingPayments, 'PENDING') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter controls -->
    <div class="bg-white shadow rounded-lg mb-6 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="w-full md:w-1/4">
          <label for="periodFilter" class="block text-sm font-medium text-gray-700">Time Period</label>
          <select
            id="periodFilter"
            v-model="periodFilter"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
        <div class="w-full md:w-1/4 flex items-end">
          <button
            @click="applyFilters"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <h2 class="text-xl font-bold mb-4">Recent Transactions</h2>
    
    <!-- Loading state -->
    <div v-if="isLoading" class="bg-white shadow rounded-lg overflow-hidden">
      <div class="animate-pulse">
        <div class="h-16 bg-gray-200 border-b"></div>
        <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 border-b flex">
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="w-1/4 p-4">
            <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions table -->
    <div v-else-if="transactions.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ transaction.id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatDate(transaction.date) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ transaction.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div :class="[
                'text-sm font-medium', 
                transaction.type === 'PLATFORM_FEE' ? 'text-green-600' : 'text-red-600'
              ]">
                {{ formatCurrency(transaction.amount, transaction.type) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                :class="getStatusClass(transaction.status)"
              >
                {{ transaction.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No transactions found -->
    <div v-else class="bg-white shadow rounded-lg p-6 text-center">
      <p class="text-gray-500">No transactions found for the selected period.</p>
    </div>

    <!-- Pagination controls -->
    <div class="mt-5 flex justify-between items-center" v-if="totalPages > 0">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ paginationText }}</span>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

// State
const isLoading = ref(true)
const totalRevenue = ref(0)
const platformFees = ref(0)
const providerEarnings = ref(0)
const pendingPayments = ref(0)
const transactions = ref([])
const currentPage = ref(1)
const totalItems = ref(0)
const totalPages = ref(0)
const itemsPerPage = ref(10)
const periodFilter = ref('30')

// Computed properties
const paginationText = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(start + itemsPerPage.value - 1, totalItems.value)
  return `${start}-${end} of ${totalItems.value}`
})

// Methods
const formatCurrency = (value, type) => {
  // Platform fees and earnings should be displayed as positive values (income)
  const displayValue = Math.abs(value)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  
  // For platform transactions, always show positive values with + sign
  if (type === 'PLATFORM_FEE') {
    return `+${formatter.format(displayValue)}`
  } 
  // For payments to providers, show negative values with - sign
  else if (type === 'EARNING') {
    return `-${formatter.format(displayValue)}`
  }
  // For other transactions, use standard formatting based on value sign
  else {
    return formatter.format(value)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const fetchFinanceData = async () => {
  isLoading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: itemsPerPage.value,
      period: periodFilter.value
    })

    // Fetch data from API
    const response = await fetch(`/api/admin/finance?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to fetch finance data')
    
    const data = await response.json()
    
    // Update summary statistics
    totalRevenue.value = data.summary?.totalRevenue || 0
    platformFees.value = data.summary?.platformFees || 0
    providerEarnings.value = data.summary?.providerEarnings || 0
    pendingPayments.value = data.summary?.pendingPayments || 0
    
    // Update transactions
    transactions.value = data.transactions || []
    totalItems.value = data.pagination?.totalItems || 0
    totalPages.value = data.pagination?.totalPages || 0
    
    console.log('Finance data loaded:', data)
  } catch (error) {
    console.error('Error fetching finance data:', error)
    // Fallback mock data for testing
    totalRevenue.value = 145250.75
    platformFees.value = 29050.15
    providerEarnings.value = 116200.60
    pendingPayments.value = 8750.25
    
    transactions.value = [
      {
        id: 'TX12345',
        date: new Date().toISOString(),
        description: 'Platform fee for order #ORD-9876',
        amount: 450.25,
        status: 'Completed'
      },
      {
        id: 'TX12344',
        date: new Date(Date.now() - 86400000).toISOString(),
        description: 'Provider payout for order #ORD-9876',
        amount: 1801.00,
        status: 'Completed'
      },
      {
        id: 'TX12343',
        date: new Date(Date.now() - 172800000).toISOString(),
        description: 'Platform fee for order #ORD-9875',
        amount: 320.50,
        status: 'Pending'
      },
      {
        id: 'TX12342',
        date: new Date(Date.now() - 259200000).toISOString(),
        description: 'Provider payout for order #ORD-9874',
        amount: 1282.00,
        status: 'Completed'
      },
      {
        id: 'TX12341',
        date: new Date(Date.now() - 345600000).toISOString(),
        description: 'Platform fee refund for order #ORD-9873',
        amount: -125.75,
        status: 'Completed'
      }
    ]
    
    totalItems.value = transactions.value.length
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchFinanceData()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchFinanceData()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchFinanceData()
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchFinanceData()
})
</script> 