<template>
  <div class="py-6">
    <div class="max-w-full mx-auto px-4 sm:px-6 md:px-6">
      <h1 class="text-2xl font-semibold text-gray-900">Earnings</h1>
    </div>
    <div class="max-w-full mx-auto px-4 sm:px-6 md:px-6">
      <!-- Earnings Summary -->
      <div class="py-4">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-4 sm:px-4 border-b border-gray-200">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Earnings Summary</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Overview of your earnings with platform fee details.</p>
              </div>
              <div class="text-sm text-gray-500 flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                <InformationCircleIcon class="h-5 w-5 mr-1 text-gray-400" />
                <span>A 2% platform fee is applied to all earnings</span>
              </div>
            </div>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <!-- Gross Earnings (before fee) -->
              <div class="bg-blue-50 overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <ScaleIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Gross Earnings</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">${{ formatNumber(earningsSummary.grossEarnings || earningsSummary.totalEarnings * 1.0204) }}</div>
                        </dd>
                        <dd class="text-xs text-gray-500 mt-1">Before platform fee</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Platform Fees -->
              <div class="bg-primary-50 overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <ReceiptPercentIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Platform Fees</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">${{ formatNumber(earningsSummary.platformFees || earningsSummary.totalEarnings * 0.0204) }}</div>
                        </dd>
                        <dd class="text-xs text-gray-500 mt-1">2% of gross earnings</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Net Earnings (after fee) -->
              <div class="bg-green-50 overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <CurrencyDollarIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Net Earnings</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">${{ formatNumber(earningsSummary.totalEarnings) }}</div>
                        </dd>
                        <dd class="text-xs text-gray-500 mt-1">After 2% platform fee</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <!-- This Month -->
              <div class="bg-indigo-50 overflow-hidden shadow rounded-lg">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <CalendarIcon class="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">This Month</dt>
                        <dd class="flex items-baseline">
                          <div class="text-2xl font-semibold text-gray-900">${{ formatNumber(earningsSummary.thisMonth) }}</div>
                        </dd>
                        <dd class="text-xs text-gray-500 mt-1">After 2% platform fee</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="py-4">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-4 sm:px-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Transaction History</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Your recent transactions and payments.</p>
          </div>
          <div class="px-2 py-4 sm:px-2">
            <!-- Table with horizontal scrolling -->
            <div class="overflow-x-auto w-full">
              <div class="inline-block min-w-full">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross</th>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                        <th scope="col" class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="transaction in transactions" :key="transaction.id">
                        <td class="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{{ formatDate(transaction.date) }}</td>
                        <td class="px-2 py-3 text-xs text-gray-900 max-w-[150px] truncate">{{ transaction.description }}</td>
                        <td class="px-2 py-3 whitespace-nowrap text-xs text-gray-500">{{ transaction.orderId }}</td>
                        <td class="px-2 py-3 whitespace-nowrap text-xs text-gray-900">${{ formatNumber(transaction.grossAmount || transaction.amount * 1.0204) }}</td>
                        <td class="px-2 py-3 whitespace-nowrap text-xs text-red-600">-${{ formatNumber(transaction.platformFee || transaction.amount * 0.0204) }}</td>
                        <td class="px-2 py-3 whitespace-nowrap text-xs text-green-600 font-medium">${{ formatNumber(transaction.amount) }}</td>
                        <td class="px-2 py-3 whitespace-nowrap">
                          <span :class="getStatusClass(transaction.status)" class="px-1.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ transaction.status }}
                          </span>
                        </td>
                      </tr>
                      
                      <!-- Empty state if no transactions -->
                      <tr v-if="transactions.length === 0">
                        <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500">
                          <div class="flex flex-col items-center">
                            <ReceiptRefundIcon class="h-12 w-12 text-gray-300 mb-3" />
                            <p class="font-medium text-gray-900 mb-1">No transactions found</p>
                            <p class="max-w-md">Your completed deliveries and payments will appear here. All earnings have a 2% platform fee deducted automatically.</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="mt-4 flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button 
                  @click="previousPage" 
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage === totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ paginationInfo.start }}</span>
                    to
                    <span class="font-medium">{{ paginationInfo.end }}</span>
                    of
                    <span class="font-medium">{{ paginationInfo.total }}</span>
                    results
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button 
                      @click="previousPage" 
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Previous</span>
                      <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button 
                      v-for="page in displayedPages" 
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        page === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button 
                      @click="nextPage" 
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span class="sr-only">Next</span>
                      <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  ScaleIcon,
  ReceiptPercentIcon,
  ReceiptRefundIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'truck-provider-dashboard',
  middleware: ['auth']
})

// Earnings summary
const earningsSummary = ref({
  totalEarnings: 0,
  grossEarnings: 0,
  platformFees: 0,
  thisMonth: 0,
  nextPayment: 0
})

// Transaction history
const transactions = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const totalItems = ref(0)

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(start + itemsPerPage - 1, totalItems.value)
  return {
    start,
    end,
    total: totalItems.value
  }
})

const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2))
  let endPage = Math.min(totalPages.value, startPage + maxDisplayed - 1)
  
  if (endPage - startPage + 1 < maxDisplayed) {
    startPage = Math.max(1, endPage - maxDisplayed + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Load data
onMounted(async () => {
  try {
    // Fetch earnings summary
    const { data } = await useFetch('/api/truck-provider/earnings/summary', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (data.value && data.value.summary) {
      earningsSummary.value = data.value.summary
    }
    
    // Fetch transactions
    await fetchTransactions()
  } catch (error) {
    console.error('Error loading earnings data:', error)
  }
})

// Fetch transactions
async function fetchTransactions() {
  try {
    const { data } = await useFetch('/api/truck-provider/transactions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      query: {
        page: currentPage.value,
        limit: itemsPerPage
      }
    })
    
    if (data.value) {
      transactions.value = data.value.transactions || []
      totalItems.value = data.value.total || 0
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
  }
}

// Pagination functions
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchTransactions()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchTransactions()
  }
}

function goToPage(page: number) {
  currentPage.value = page
  fetchTransactions()
}

// Utility functions
function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script> 