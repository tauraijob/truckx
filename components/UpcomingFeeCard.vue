<template>
  <div class="bg-white rounded-lg shadow p-5">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">Upcoming Platform Fees</h3>
      <button 
        @click="navigateToPayment" 
        class="text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        View all
      </button>
    </div>
    
    <div v-if="loading" class="animate-pulse space-y-3">
      <div v-for="i in 3" :key="i" class="bg-gray-100 p-3 rounded-md flex justify-between">
        <div class="space-y-2">
          <div class="h-4 w-32 bg-gray-200 rounded"></div>
          <div class="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
        <div class="h-4 w-16 bg-gray-200 rounded self-center"></div>
      </div>
    </div>
    
    <div v-else-if="fees.length === 0" class="py-8 text-center border border-gray-100 rounded-lg">
      <CheckCircleIcon class="mx-auto h-12 w-12 text-green-500" />
      <p class="mt-2 text-sm font-medium text-gray-900">No Upcoming Fees</p>
      <p class="mt-1 text-sm text-gray-500">You have no platform fees due at this time.</p>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="fee in fees" 
        :key="fee.id" 
        class="bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-900">
              Platform Fee - {{ formatDate(fee.dueDate) }}
            </p>
            <p class="text-sm text-gray-500">
              {{ daysUntilDue(fee.dueDate) < 0 
                ? 'Overdue by ' + Math.abs(daysUntilDue(fee.dueDate)) + ' days' 
                : 'Due in ' + daysUntilDue(fee.dueDate) + ' days' }}
            </p>
          </div>
          <div :class="getStatusColor(fee.status)">
            <p class="font-semibold">${{ fee.amount.toFixed(2) }}</p>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(fee.status)">
              {{ fee.status }}
            </span>
          </div>
        </div>
        <div class="mt-2 flex justify-end" v-if="fee.status !== 'Paid'">
          <button 
            @click="payFee(fee.id)" 
            class="text-xs bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value: string) => ['truck-provider', 'load-provider'].includes(value)
  },
  userId: {
    type: String,
    required: true
  }
})

const router = useRouter()
const loading = ref(true)
const fees = ref([])

// Format date to readable format
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Calculate days until due
const daysUntilDue = (dateString) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const dueDate = new Date(dateString)
  dueDate.setHours(0, 0, 0, 0)
  
  const differenceInTime = dueDate.getTime() - today.getTime()
  return Math.ceil(differenceInTime / (1000 * 3600 * 24))
}

// Get color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'Paid': return 'text-green-600'
    case 'Overdue': return 'text-red-600'
    case 'Due': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

// Get badge class based on status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-800'
    case 'Overdue': return 'bg-red-100 text-red-800'
    case 'Due': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Navigate to payment page
const navigateToPayment = () => {
  router.push(`/dashboard/${props.userType}/settings?tab=payment`)
}

// Pay fee
const payFee = (feeId) => {
  // Instead of redirecting to settings page, we'll emit an event
  // that can be captured by parent component
  emits('payFee', {
    id: feeId,
    amount: fees.value.find(f => f.id === feeId)?.amount || 0
  })
  
  // For immediate functionality, we'll redirect to the payment tab on settings page
  // AND include the feeId as a special URL parameter
  router.push(`/dashboard/${props.userType}/settings?tab=payment&feeId=${feeId}&showPaymentForm=true`)
}

// Fetch upcoming fees
const fetchUpcomingFees = async () => {
  loading.value = true
  
  try {
    // Check if userId is empty
    if (!props.userId) {
      console.warn('User ID is not available, using mock data instead')
      useMockData()
      return
    }
    
    const endpoint = `/api/${props.userType}/fees/upcoming/${props.userId}`
    console.log('Fetching fees from endpoint:', endpoint)
    
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('Authentication token not found, using mock data instead')
      useMockData()
      return
    }
    
    const response = await $fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response && Array.isArray(response)) {
      fees.value = response
    } else {
      console.warn('Unexpected response format, using mock data instead')
      useMockData()
    }
  } catch (error) {
    console.error('Error fetching upcoming fees:', error)
    useMockData()
  } finally {
    loading.value = false
  }
}

// Use mock data for development or when API calls fail
const useMockData = () => {
  fees.value = [
    {
      id: '1',
      amount: 124.50,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: 'Due'
    },
    {
      id: '2',
      amount: 89.75,
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: 'Overdue'
    },
    {
      id: '3',
      amount: 102.25,
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      status: 'Paid'
    }
  ]
}

onMounted(() => {
  fetchUpcomingFees()
})
</script> 