<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 shadow-sm fixed h-full">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <NuxtLink to="/dashboard/truck-provider" class="text-2xl font-bold text-primary-700">
          TruckX Truck
        </NuxtLink>
      </div>
      
      <!-- Sidebar Navigation -->
      <nav class="mt-8 px-4">
        <div class="space-y-1">
          <NuxtLink
            to="/dashboard/truck-provider"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md" 
            :class="[$route.path === '/dashboard/truck-provider' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']"
          >
            <RectangleGroupIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/truck-provider' ? 'text-white' : 'text-primary-700']" />
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/dashboard/truck-provider/trucks"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.includes('/dashboard/truck-provider/trucks') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']"
          >
            <TruckIcon class="mr-3 h-6 w-6" :class="[$route.path.includes('/dashboard/truck-provider/trucks') ? 'text-white' : 'text-primary-700']" />
            My Trucks
          </NuxtLink>

          <NuxtLink
            to="/dashboard/truck-provider/available-loads"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.includes('/dashboard/truck-provider/available-loads') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']"
          >
            <ClipboardDocumentListIcon class="mr-3 h-6 w-6" :class="[$route.path.includes('/dashboard/truck-provider/available-loads') ? 'text-white' : 'text-primary-700']" />
            Available Loads
          </NuxtLink>

          <NuxtLink
            to="/dashboard/truck-provider/orders"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.includes('/dashboard/truck-provider/orders') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']"
          >
            <ClipboardDocumentCheckIcon class="mr-3 h-6 w-6" :class="[$route.path.includes('/dashboard/truck-provider/orders') ? 'text-white' : 'text-primary-700']" />
            My Orders
          </NuxtLink>

          <NuxtLink
            to="/dashboard/truck-provider/earnings"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.includes('/dashboard/truck-provider/earnings') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']"
          >
            <CurrencyDollarIcon class="mr-3 h-6 w-6" :class="[$route.path.includes('/dashboard/truck-provider/earnings') ? 'text-white' : 'text-primary-700']" />
            Earnings
          </NuxtLink>

          <NuxtLink
            to="/dashboard/truck-provider/settings"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.includes('/dashboard/truck-provider/settings') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']"
          >
            <Cog6ToothIcon class="mr-3 h-6 w-6" :class="[$route.path.includes('/dashboard/truck-provider/settings') ? 'text-white' : 'text-primary-700']" />
            Settings
          </NuxtLink>
        </div>
        
        <!-- User Section -->
        <div class="mt-10 pt-6 border-t border-gray-200">
          <div class="flex items-center px-3 py-2">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-primary-700/10 flex items-center justify-center">
                <span class="text-primary-700 font-medium">{{ user ? user.firstName[0] + user.lastName[0] : 'TP' }}</span>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ user ? `${user.firstName} ${user.lastName}` : 'Truck Provider' }}</p>
              <p class="text-xs text-gray-500">Truck Provider</p>
            </div>
          </div>
          <button 
            @click="logout" 
            class="mt-2 w-full flex items-center px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-700/10 rounded-md"
          >
            <ArrowRightOnRectangleIcon class="mr-3 h-5 w-5 text-primary-700" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
    
    <!-- Main Content -->
    <div class="flex-1 ml-64">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-6">
        <h1 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
      </header>
      
      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { Chart } from 'chart.js'
import {
  RectangleGroupIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// Get user from auth
const { user, logout: authLogout } = useAuth()

// Computed for page title
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard/truck-provider') return 'Dashboard'
  if (path.includes('/dashboard/truck-provider/trucks')) return 'My Trucks'
  if (path.includes('/dashboard/truck-provider/available-loads')) return 'Available Loads'
  if (path.includes('/dashboard/truck-provider/orders')) return 'My Orders'
  if (path.includes('/dashboard/truck-provider/earnings')) return 'Earnings'
  if (path.includes('/dashboard/truck-provider/settings')) return 'Settings'
  return 'Truck Provider Dashboard'
})

// Logout method
async function logout() {
  // Clean up any chart instances before logout
  try {
    const charts = document.querySelectorAll('canvas')
    charts.forEach(canvas => {
      const chartInstance = Chart.getChart(canvas)
      if (chartInstance) {
        chartInstance.destroy()
      }
    })
  } catch (error) {
    console.error('Error cleaning up charts:', error)
  }
  
  await authLogout()
  router.push('/auth/login')
}

// Add navigation guard to clean up charts when navigating
const handleNavigation = (to) => {
  try {
    // Clean up any chart instances before navigation
    const charts = document.querySelectorAll('canvas')
    charts.forEach(canvas => {
      try {
        const chartInstance = Chart.getChart(canvas)
        if (chartInstance) {
          chartInstance.destroy()
        }
      } catch (error) {
        console.error('Error destroying chart:', error)
      }
    })
  } catch (error) {
    console.error('Error in handleNavigation:', error)
  }
}

// Watch for route changes
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    // Use nextTick to ensure DOM is updated before cleaning up
    nextTick(() => {
      handleNavigation(newPath)
    })
  }
})
</script> 