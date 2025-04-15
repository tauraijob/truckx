<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-lg font-medium text-primary-700 mb-4">Platform Fee Payment</h2>
    
    <!-- Balance and summary -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-500">Outstanding Platform Fees</p>
          <p class="text-2xl font-semibold text-primary-700">${{ outstandingFees.toFixed(2) }}</p>
        </div>
        <div>
          <span class="px-3 py-1 text-sm rounded-full" :class="statusClasses">
            {{ paymentStatus }}
          </span>
        </div>
      </div>
      <div class="mt-2 text-sm text-gray-500">
        <p v-if="lastPaymentDate">Last payment: {{ formatDate(lastPaymentDate) }}</p>
        <p v-else>No previous payments</p>
      </div>
      
      <!-- Add Pay Now button when form is not shown -->
      <div v-if="outstandingFees > 0 && !showForm" class="mt-4">
        <button 
          @click="showForm = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Pay Now
        </button>
      </div>
    </div>
    
    <!-- Payment Form -->
    <div v-if="outstandingFees > 0 && showForm">
      <div class="mb-4">
        <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="amount"
            v-model="paymentAmount"
            class="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
            :max="outstandingFees"
            step="0.01"
          />
        </div>
        <p v-if="paymentAmount > outstandingFees" class="mt-1 text-sm text-red-600">
          Amount cannot exceed outstanding balance
        </p>
      </div>
      
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label 
            v-for="method in paymentMethods" 
            :key="method.id" 
            class="relative flex border rounded-lg p-4 cursor-pointer"
            :class="selectedMethod === method.id ? 'border-primary-600 bg-primary-50' : 'border-gray-300'"
          >
            <input 
              type="radio" 
              :value="method.id" 
              v-model="selectedMethod"
              class="sr-only" 
            />
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-3">
                <component :is="method.icon" class="h-6 w-6" 
                  :class="method.iconClass" />
              </div>
              <div class="text-sm font-medium">{{ method.name }}</div>
            </div>
            <div class="absolute -top-1 -right-1" v-if="selectedMethod === method.id">
              <div class="bg-primary-600 rounded-full p-1">
                <CheckIcon class="h-3 w-3 text-white" />
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <!-- Method specific forms -->
      <!-- PayPal -->
      <div v-if="selectedMethod === 'paypal'" class="mb-6 p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
        <div class="flex justify-center">
          <div class="h-8 bg-[#003087] text-white px-3 py-1 rounded flex items-center">
            <span class="font-bold">Pay</span><span class="text-[#009cde] font-bold">Pal</span>
          </div>
        </div>
      </div>
      
      <!-- Paynow -->
      <div v-if="selectedMethod === 'paynow'" class="mb-6 p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-600 mb-4">Scan the QR code or use the merchant code below to make your payment.</p>
        <div class="flex flex-col items-center">
          <div class="h-32 w-32 bg-gray-200 flex items-center justify-center mb-2">
            <span class="text-gray-500 text-sm text-center">QR Code<br>Placeholder</span>
          </div>
          <p class="text-sm font-medium">Merchant Code: <span class="font-bold">12345</span></p>
        </div>
      </div>
      
      <!-- Cash In Hand -->
      <div v-if="selectedMethod === 'cash'" class="mb-6 p-4 border border-gray-200 rounded-lg">
        <p class="text-sm text-gray-600 mb-4">Please visit our office to make a cash payment. Our representative will provide a receipt.</p>
        <div class="text-sm">
          <p class="font-medium">Office Address:</p>
          <p>123 Transport Way</p>
          <p>Logistics Building, Suite 456</p>
          <p>Business Hours: Monday-Friday, 9AM-5PM</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button"
          class="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="resetForm"
        >
          Cancel
        </button>
        <button 
          type="button"
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          :disabled="!isFormValid || isProcessing"
          @click="processPayment"
        >
          <span v-if="isProcessing" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Make Payment</span>
        </button>
      </div>
    </div>
    
    <!-- No outstanding fees message -->
    <div v-else-if="!outstandingFees" class="py-4 text-center">
      <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">No Outstanding Fees</h3>
      <p class="mt-1 text-sm text-gray-500">You have no platform fees due at this time.</p>
    </div>
    
    <!-- Payment History -->
    <div class="mt-8">
      <h3 class="text-md font-medium text-primary-700 mb-4">Payment History</h3>
      <div class="overflow-hidden border border-gray-200 rounded-lg">
        <div v-if="paymentHistory.length === 0" class="p-4 text-center text-sm text-gray-500">
          No payment history available
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in paymentHistory" :key="payment.id">
              <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(payment.date) }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">${{ payment.amount.toFixed(2) }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ payment.method }}</td>
              <td class="px-4 py-3 text-sm">
                <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(payment.status)">
                  {{ payment.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  CheckIcon, 
  CreditCardIcon, 
  BanknotesIcon, 
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { useToast } from '~/composables/useToast'

const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value: string) => ['truck-provider', 'load-provider'].includes(value)
  },
  userId: {
    type: String,
    required: true
  },
  feeId: {
    type: String,
    default: null
  },
  showPaymentForm: {
    type: Boolean,
    default: false
  }
})

// State
const outstandingFees = ref(0)
const paymentAmount = ref(0)
const selectedMethod = ref('paypal')
const isProcessing = ref(false)
const lastPaymentDate = ref<string | null>(null)
const paymentHistory = ref<any[]>([])
const paymentStatus = ref('Due')
const showForm = ref(false)
const { showToast } = useToast()

// Computed
const statusClasses = computed(() => {
  const classes = {
    'Due': 'bg-yellow-100 text-yellow-800',
    'Overdue': 'bg-red-100 text-red-800',
    'Paid': 'bg-green-100 text-green-800',
    'Partially Paid': 'bg-blue-100 text-blue-800'
  }
  return classes[paymentStatus.value] || 'bg-gray-100 text-gray-800'
})

const isFormValid = computed(() => {
  return paymentAmount.value > 0 && 
         paymentAmount.value <= outstandingFees.value &&
         selectedMethod.value !== ''
})

// Payment Methods
const paymentMethods = [
  { 
    id: 'paypal', 
    name: 'PayPal', 
    icon: 'img', 
    iconClass: '' 
  },
  { 
    id: 'paynow', 
    name: 'Paynow', 
    icon: CreditCardIcon, 
    iconClass: 'text-blue-500'
  },
  { 
    id: 'cash', 
    name: 'Cash In Hand', 
    icon: BanknotesIcon, 
    iconClass: 'text-green-500'
  }
]

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'failed': 'bg-red-100 text-red-800'
  }
  
  return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const resetForm = () => {
  paymentAmount.value = 0
  selectedMethod.value = 'paypal'
}

const fetchOutstandingFees = async () => {
  try {
    // If feeId is provided, fetch that specific fee info
    if (props.feeId && props.feeId !== 'current') {
      const endpoint = `/api/${props.userType}/fees/upcoming/${props.userId}`
      const response = await $fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response && Array.isArray(response)) {
        const selectedFee = response.find(fee => fee.id === props.feeId)
        if (selectedFee) {
          outstandingFees.value = selectedFee.amount
          paymentStatus.value = selectedFee.status
          // Auto-set the payment amount to the fee amount
          paymentAmount.value = selectedFee.amount
          // Show the payment form immediately if requested
          if (props.showPaymentForm) {
            showForm.value = true
          }
          return
        }
      }
    }
    
    // Otherwise fetch all outstanding fees
    const endpoint = `/api/${props.userType}/fees/${props.userId}`
    const response = await $fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response) {
      outstandingFees.value = response.outstandingAmount || 0
      paymentStatus.value = response.status || 'Due'
      lastPaymentDate.value = response.lastPaymentDate || null
      
      // Show the payment form immediately if requested
      if (props.showPaymentForm) {
        showForm.value = true
        paymentAmount.value = outstandingFees.value
      }
    }
  } catch (error) {
    console.error('Error fetching outstanding fees:', error)
    showToast('Failed to load fee information', 'error')
  }
}

const fetchPaymentHistory = async () => {
  try {
    const endpoint = `/api/${props.userType}/fees/history/${props.userId}`
    const response = await $fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response && Array.isArray(response)) {
      paymentHistory.value = response
    } else {
      paymentHistory.value = []
    }
  } catch (error) {
    console.error('Error fetching payment history:', error)
    paymentHistory.value = []
  }
}

const processPayment = async () => {
  if (!isFormValid.value) return
  
  isProcessing.value = true
  
  try {
    const paymentData = {
      userId: props.userId,
      userType: props.userType,
      amount: paymentAmount.value,
      method: selectedMethod.value
    }
    
    const response = await $fetch('/api/payments/platform-fees', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: paymentData
    })
    
    if (response && response.success) {
      showToast('Payment processed successfully', 'success')
      
      // Refresh data
      await fetchOutstandingFees()
      await fetchPaymentHistory()
      resetForm()
    } else {
      throw new Error(response?.message || 'Payment failed')
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    showToast('Payment failed. Please try again later.', 'error')
  } finally {
    isProcessing.value = false
  }
}

// Initialize
onMounted(async () => {
  await fetchOutstandingFees()
  await fetchPaymentHistory()
})
</script> 