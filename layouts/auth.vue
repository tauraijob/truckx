<template>
    <div class="min-h-screen bg-navy-50">
        <!-- Auth Header -->
        <header class="bg-white border-b border-navy-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <NuxtLink :to="getDashboardPath" class="text-2xl font-bold text-primary-700">
                            TruckX
                        </NuxtLink>
                    </div>

                    <!-- Navigation -->
                    <nav class="hidden md:flex space-x-8">
                        <NuxtLink :to="getDashboardPath"
                            class="text-primary-700 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium">
                            Dashboard
                        </NuxtLink>
                        <NuxtLink :to="getDashboardPath + '/loads'"
                            class="text-primary-700 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium">
                            Loads
                        </NuxtLink>
                        <NuxtLink :to="getDashboardPath + '/trucks'"
                            class="text-primary-700 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium">
                            Trucks
                        </NuxtLink>
                        <NuxtLink :to="getDashboardPath + '/payments'"
                            class="text-primary-700 hover:text-primary-800 px-3 py-2 rounded-md text-sm font-medium">
                            Payments
                        </NuxtLink>
                    </nav>

                    <!-- User Profile Dropdown -->
                    <div class="relative">
                        <button @click="isProfileOpen = !isProfileOpen"
                            class="flex items-center gap-2 focus:outline-none">
                            <div
                                class="h-10 w-10 rounded-full bg-primary-700/10 flex items-center justify-center ring-2 ring-primary-700/20">
                                <UserCircleIcon class="h-6 w-6 text-primary-700" />
                            </div>
                            <span class="text-primary-700 font-medium hidden md:block">{{ user?.name || 'User' }}</span>
                            <ChevronDownIcon class="h-5 w-5 text-primary-700/60" />
                        </button>

                        <!-- Dropdown Menu -->
                        <div v-if="isProfileOpen"
                            class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-primary-700/20 py-1 z-10">
                            <div class="px-4 py-3 border-b border-primary-700/20">
                                <div class="flex items-center gap-3">
                                    <div class="bg-primary-700/10 p-2 rounded-full">
                                        <UserCircleIcon class="h-6 w-6 text-primary-700" />
                                    </div>
                                    <div>
                                        <p class="text-primary-700 font-medium">{{ user?.name || 'User' }}</p>
                                        <p class="text-primary-700/60 text-sm">{{ user?.email || 'user@example.com' }}</p>
                                    </div>
                                </div>
                            </div>
                            <a :href="`${getDashboardPath}/profile`"
                                class="flex items-center px-4 py-2.5 text-primary-700 hover:bg-primary-700/5 hover:text-primary-800 transition-colors">
                                <UserIcon class="h-5 w-5 mr-3 text-primary-700/60" />
                                My Profile
                            </a>
                            <a href="#"
                                class="flex items-center px-4 py-2.5 text-primary-700 hover:bg-primary-700/5 hover:text-primary-800 transition-colors">
                                <Cog6ToothIcon class="h-5 w-5 mr-3 text-primary-700/60" />
                                Account Settings
                            </a>
                            <a href="#"
                                class="flex items-center px-4 py-2.5 text-primary-700 hover:bg-primary-700/5 hover:text-primary-800 transition-colors">
                                <BellIcon class="h-5 w-5 mr-3 text-primary-700/60" />
                                Notifications
                            </a>
                            <div class="border-t border-primary-700/20 my-1"></div>
                            <button @click="handleLogout"
                                class="w-full flex items-center px-4 py-2.5 text-primary-700 hover:bg-primary-700/5 hover:text-primary-800 transition-colors">
                                <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3 text-primary-700/60" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <main class="py-6">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import {
    UserCircleIcon,
    ChevronDownIcon,
    UserIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    BellIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const { user, logout } = useAuth()
const isProfileOpen = ref(false)

// Get the dashboard path based on user role
const getDashboardPath = computed(() => {
    if (!user.value) return '/dashboard'
    
    switch (user.value.role) {
        case 'ADMIN':
            return '/dashboard/admin'
        case 'TRUCK_PROVIDER':
            return '/dashboard/truck-provider'
        case 'LOAD_PROVIDER':
            return '/dashboard/load-provider'
        default:
            return '/dashboard'
    }
})

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        isProfileOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
    logout()
    router.push('/auth/login')
}
</script>