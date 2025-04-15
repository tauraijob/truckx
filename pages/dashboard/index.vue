<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-semibold text-[#004599]">Dashboard</h1>
            <p class="text-sm text-[#004599]/60 mt-1">
              Welcome back, {{ fullName }}!
            </p>
          </div>
        </div>

        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Active Orders -->
          <div class="bg-white rounded-lg shadow p-8 border border-[#004599]/10">
            <div class="flex items-center">
              <div class="p-4 rounded-full bg-[#004599]/10">
                <ClipboardIcon class="h-7 w-7 text-[#004599]" />
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-[#004599]">Active Orders</p>
                <p class="text-2xl font-semibold text-[#004599] mt-1">{{ activeOrders }}</p>
              </div>
            </div>
          </div>

          <!-- Total Earnings -->
          <div class="bg-white rounded-lg shadow p-8 border border-[#004599]/10">
            <div class="flex items-center">
              <div class="p-4 rounded-full bg-green-100">
                <CurrencyDollarIcon class="h-7 w-7 text-green-600" />
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-[#004599]">Total Earnings</p>
                <p class="text-2xl font-semibold text-[#004599] mt-1">${{ totalEarnings }}</p>
              </div>
            </div>
          </div>

          <!-- Available Items -->
          <div class="bg-white rounded-lg shadow p-8 border border-[#004599]/10">
            <div class="flex items-center">
              <div class="p-4 rounded-full bg-blue-100">
                <TruckIcon class="h-7 w-7 text-blue-600" />
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-[#004599]">
                  {{ userRole === 'TRUCK_PROVIDER' ? 'Available Loads' : 'Available Trucks' }}
                </p>
                <p class="text-2xl font-semibold text-[#004599] mt-1">{{ availableItems }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow border border-[#004599]/10 mt-8">
          <div class="px-8 py-5 border-b border-[#004599]/10">
            <h2 class="text-lg font-medium text-[#004599]">Recent Activity</h2>
          </div>
          <div class="divide-y divide-[#004599]/10">
            <div v-for="activity in recentActivity" :key="activity.id" class="p-8">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-12 w-12 rounded-full bg-[#004599]/10 flex items-center justify-center">
                    <UserCircleIcon class="h-7 w-7 text-[#004599]" />
                  </div>
                </div>
                <div class="ml-5">
                  <p class="text-sm font-medium text-[#004599]">{{ activity.title }}</p>
                  <p class="text-sm text-[#004599]/60 mt-1">{{ activity.description }}</p>
                </div>
                <div class="ml-auto flex items-center">
                  <span class="px-3 py-1 text-xs font-medium rounded-full" :class="{
                    'bg-green-100 text-green-800': activity.status === 'completed',
                    'bg-yellow-100 text-yellow-800': activity.status === 'in_progress',
                    'bg-gray-100 text-gray-800': activity.status === 'pending'
                  }">
                    {{ activity.status }}
                  </span>
                  <p class="text-sm text-[#004599]/60 ml-4">{{ activity.date }}</p>
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
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import {
  TruckIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const userRole = computed(() => authStore.userRole)
const fullName = computed(() => authStore.fullName)

// Mock data - replace with actual data from your backend
const activeOrders = ref(5)
const totalEarnings = ref('12,345.67')
const availableItems = ref(15)

const recentActivity = ref([
  {
    id: 1,
    title: 'New load request',
    description: 'Load #1234 from New York to Los Angeles',
    status: 'pending',
    date: '2 hours ago'
  },
  {
    id: 2,
    title: 'Load delivered',
    description: 'Load #1233 successfully delivered',
    status: 'completed',
    date: '5 hours ago'
  },
  {
    id: 3,
    title: 'Truck assigned',
    description: 'Truck #567 assigned to Load #1234',
    status: 'in_progress',
    date: '1 day ago'
  }
])
</script>