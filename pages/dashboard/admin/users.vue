<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <button class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
        Add New User
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>You may need to log in again to access the data.</p>
          </div>
          <div class="mt-4">
            <div class="-mx-2 -my-1.5 flex">
              <NuxtLink to="/auth/login" class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100">
                Go to login
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      <p class="mt-2 text-sm text-gray-600">Loading users...</p>
    </div>

    <!-- User Filters -->
    <div v-if="!loading && !error" class="mb-6 flex items-center gap-4">
      <div class="flex-1">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name or email..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <select
          v-model="filterRole"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="TRUCK_PROVIDER">Truck Provider</option>
          <option value="LOAD_PROVIDER">Load Provider</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div v-if="!loading && !error" class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-primary-700 font-medium">{{ getUserInitials(user) }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-sm text-gray-500">Joined {{ formatDate(user.createdAt) }}</div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getRoleBadgeClass(user.role)">
                {{ formatRole(user.role) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button class="rounded bg-white p-1 text-gray-400 hover:text-blue-600">
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button class="rounded bg-white p-1 text-gray-400 hover:text-red-600">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
              No users found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ users.length }} users
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Pagination settings
const itemsPerPage = 10
const currentPage = ref(1)
const searchQuery = ref('')
const filterRole = ref('')

// User data
const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')

// Filter users based on search and role filter
const filteredUsers = computed(() => {
  let result = users.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.firstName.toLowerCase().includes(query) || 
      user.lastName.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }

  // Filter by role
  if (filterRole.value) {
    result = result.filter(user => user.role === filterRole.value)
  }

  // Return paginated result
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages
const totalPages = ref(1)

// Display range for pagination
const displayedRange = computed(() => {
  const filteredCount = users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = !filterRole.value || user.role === filterRole.value
    
    return matchesSearch && matchesRole
  }).length
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, filteredCount)
  const end = Math.min(start + filteredUsers.value.length - 1, filteredCount)
  
  return `${start}-${end}`
})

// Pagination methods
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get user initials
function getUserInitials(user: User): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
}

// Format role for display
function formatRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Admin'
    case 'TRUCK_PROVIDER':
      return 'Truck Provider'
    case 'LOAD_PROVIDER':
      return 'Load Provider'
    default:
      return role
  }
}

// Get role badge styling
function getRoleBadgeClass(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800'
    case 'TRUCK_PROVIDER':
      return 'bg-blue-100 text-blue-800'
    case 'LOAD_PROVIDER':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Fetch users
async function fetchUsers() {
  loading.value = true;
  error.value = '';
  
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    console.log('Using token for users API:', token ? 'Token available' : 'No token');
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.toString()
    });
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }
    
    if (filterRole.value) {
      params.append('role', filterRole.value);
    }
    
    const url = `/api/admin/users?${params.toString()}`;
    console.log('Fetching from URL:', url);
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make direct fetch call
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      error.value = errorData.message || `Failed to load users (${response.status})`;
      return;
    }
    
    const data = await response.json();
    console.log('Received users data:', data);
    
    if (data && data.users) {
      users.value = data.users;
      
      // Update total pages based on API response
      if (data.pagination) {
        totalPages.value = data.pagination.totalPages;
      }
    }
  } catch (err: any) {
    console.error('Error fetching users:', err);
    error.value = err.message || 'An error occurred while loading users';
  } finally {
    loading.value = false;
  }
}

// Initial fetch
onMounted(() => {
  fetchUsers();
});

// Watch for changes in filters and pagination
watch([searchQuery, filterRole, currentPage], () => {
  // Reset to first page when filters change
  if ((searchQuery.value || filterRole.value) && currentPage.value !== 1) {
    currentPage.value = 1;
    return; // The watch will trigger again with the updated page
  }
  
  fetchUsers();
});
</script> 