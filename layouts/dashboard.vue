<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 w-64 bg-navy-800 text-white transition-transform duration-300 transform md:translate-x-0"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <div class="flex items-center justify-between h-16 px-4 bg-navy-900">
        <div class="flex items-center">
          <img class="h-8 w-auto" src="/images/logo.png" alt="TruckX" />
          <span class="ml-2 text-xl font-bold">TruckX</span>
        </div>
        <button @click="sidebarOpen = false" class="md:hidden text-white">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav class="mt-5 px-2 space-y-1">
        <!-- Common Navigation -->
        <NuxtLink to="/dashboard" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
          :class="[$route.path === '/dashboard' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
          <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NuxtLink>

        <!-- Truck Provider Navigation -->
        <template v-if="isTruckProvider">
          <NuxtLink to="/dashboard/my-trucks" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/my-trucks' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            My Trucks
          </NuxtLink>
          <NuxtLink to="/dashboard/available-loads"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/available-loads' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Available Loads
          </NuxtLink>
          <NuxtLink to="/dashboard/my-loads" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/my-loads' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Loads
          </NuxtLink>
          <NuxtLink to="/dashboard/earnings" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/earnings' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Earnings
          </NuxtLink>
        </template>

        <!-- Load Provider Navigation -->
        <template v-if="isLoadProvider">
          <NuxtLink to="/dashboard/my-loads" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/my-loads' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Loads
          </NuxtLink>
          <NuxtLink to="/dashboard/available-trucks"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/available-trucks' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Available Trucks
          </NuxtLink>
          <NuxtLink to="/dashboard/track-loads"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/track-loads' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Track Loads
          </NuxtLink>
          <NuxtLink to="/dashboard/payments" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/payments' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Payments
          </NuxtLink>
        </template>

        <!-- Admin Navigation -->
        <template v-if="isAdmin">
          <NuxtLink to="/dashboard/users" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/users' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </NuxtLink>
          <NuxtLink to="/dashboard/orders" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/orders' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Orders
          </NuxtLink>
          <NuxtLink to="/dashboard/payments" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/payments' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Payments
          </NuxtLink>
          <NuxtLink to="/dashboard/analytics" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/analytics' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </NuxtLink>
          <NuxtLink to="/dashboard/reports" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="[$route.path === '/dashboard/reports' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
            <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </NuxtLink>
        </template>

        <!-- Common Navigation for all roles -->
        <NuxtLink to="/dashboard/profile" class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
          :class="[$route.path === '/dashboard/profile' ? 'bg-navy-700 text-white' : 'text-navy-100 hover:bg-navy-700 hover:text-white']">
          <svg class="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </NuxtLink>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="md:pl-64 flex flex-col flex-1">
      <!-- Top Navigation -->
      <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <button @click="sidebarOpen = !sidebarOpen" type="button"
          class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden">
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <h1 class="text-2xl font-semibold text-navy-900 my-auto">
              {{ pageTitle }}
            </h1>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button @click="profileDropdownOpen = !profileDropdownOpen" type="button"
                  class="max-w-xs bg-navy-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center text-white">
                    {{ userInitials }}
                  </div>
                </button>
              </div>
              <div v-if="profileDropdownOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <NuxtLink to="/dashboard/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</NuxtLink>
                <button @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                  tabindex="-1" id="user-menu-item-2">Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { user, logout, isTruckProvider, isLoadProvider, isAdmin } = useAuth()

const sidebarOpen = ref(false)
const profileDropdownOpen = ref(false)

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// Get page title based on current route
const pageTitle = computed(() => {
  const path = router.currentRoute.value.path
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/my-trucks': 'My Trucks',
    '/dashboard/available-loads': 'Available Loads',
    '/dashboard/my-loads': 'My Loads',
    '/dashboard/earnings': 'Earnings',
    '/dashboard/available-trucks': 'Available Trucks',
    '/dashboard/track-loads': 'Track Loads',
    '/dashboard/payments': 'Payments',
    '/dashboard/users': 'Users',
    '/dashboard/orders': 'Orders',
    '/dashboard/analytics': 'Analytics',
    '/dashboard/reports': 'Reports',
    '/dashboard/profile': 'Profile'
  }
  return titles[path] || 'Dashboard'
})

// Handle logout
const handleLogout = () => {
  logout()
  router.push('/auth/login')
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('#user-menu-button')) {
    profileDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>