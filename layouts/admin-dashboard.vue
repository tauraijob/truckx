<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 shadow-sm fixed h-full">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <NuxtLink to="/dashboard/admin" class="text-2xl font-bold text-primary-700">
          TruckX Admin
        </NuxtLink>
      </div>
      
      <!-- Sidebar Navigation -->
      <nav class="mt-8 px-4">
        <div class="space-y-1">
          <NuxtLink to="/dashboard/admin" class="flex items-center px-3 py-2 text-sm font-medium rounded-md" 
            :class="[$route.path === '/dashboard/admin' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <HomeIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin' ? 'text-white' : 'text-primary-700']" />
            Dashboard
          </NuxtLink>
          
          <NuxtLink to="/dashboard/admin/users" class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.startsWith('/dashboard/admin/users') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <UsersIcon class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/dashboard/admin/users') ? 'text-white' : 'text-primary-700']" />
            Users
          </NuxtLink>
          
          <NuxtLink to="/dashboard/admin/loads" class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.startsWith('/dashboard/admin/loads') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <ClipboardDocumentListIcon class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/dashboard/admin/loads') ? 'text-white' : 'text-primary-700']" />
            Loads
          </NuxtLink>
          
          <NuxtLink to="/dashboard/admin/trucks" class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.startsWith('/dashboard/admin/trucks') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <TruckIcon class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/dashboard/admin/trucks') ? 'text-white' : 'text-primary-700']" />
            Trucks
          </NuxtLink>
          
          <NuxtLink to="/dashboard/admin/orders" class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.startsWith('/dashboard/admin/orders') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <ClipboardDocumentCheckIcon class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/dashboard/admin/orders') ? 'text-white' : 'text-primary-700']" />
            Orders
          </NuxtLink>
          
          <NuxtLink to="/dashboard/admin/payments" class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.startsWith('/dashboard/admin/payments') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <CurrencyDollarIcon class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/dashboard/admin/payments') ? 'text-white' : 'text-primary-700']" />
            Payments
          </NuxtLink>
          
          <NuxtLink to="/dashboard/admin/settings" class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path.startsWith('/dashboard/admin/settings') ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <Cog6ToothIcon class="mr-3 h-6 w-6" :class="[$route.path.startsWith('/dashboard/admin/settings') ? 'text-white' : 'text-primary-700']" />
            Settings
          </NuxtLink>
        </div>
        
        <!-- User Section -->
        <div class="mt-10 pt-6 border-t border-gray-200">
          <div class="flex items-center px-3 py-2">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-primary-700/10 flex items-center justify-center">
                <UserCircleIcon class="h-6 w-6 text-primary-700" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ user?.firstName }} {{ user?.lastName }}</p>
              <p class="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button @click="handleLogout" class="mt-2 w-full flex items-center px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-700/10 rounded-md">
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

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { computed, watch, nextTick } from 'vue'
import { Chart } from 'chart.js'
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

// Get page title from route path
const pageTitle = computed(() => {
  const path = route.path
  
  if (path === '/dashboard/admin') return 'Dashboard'
  
  // Extract the last part of the path and capitalize
  const pathParts = path.split('/')
  const lastPart = pathParts[pathParts.length - 1]
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
})

const handleLogout = () => {
  // Clean up any chart instances before logout
  const charts = document.querySelectorAll('canvas')
  charts.forEach(canvas => {
    const chartInstance = Chart.getChart(canvas)
    if (chartInstance) {
      chartInstance.destroy()
    }
  })
  
  logout()
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