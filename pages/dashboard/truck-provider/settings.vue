<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-5xl mx-auto px-8">
      <!-- Page Header -->
      <div class="mb-10">
        <h1 class="text-2xl font-semibold text-gray-800">Account Settings</h1>
        <p class="mt-1 text-sm text-gray-600">Manage your account preferences and company information.</p>
      </div>

      <!-- Settings Tabs -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button @click="activeTab = 'profile'" class="px-6 py-3 font-medium text-sm" :class="activeTab === 'profile' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'">
              Profile
            </button>
            <button @click="activeTab = 'company'" class="px-6 py-3 font-medium text-sm" :class="activeTab === 'company' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'">
              Company
            </button>
            <button @click="activeTab = 'notifications'" class="px-6 py-3 font-medium text-sm" :class="activeTab === 'notifications' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'">
              Notifications
            </button>
            <button @click="activeTab = 'security'" class="px-6 py-3 font-medium text-sm" :class="activeTab === 'security' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'">
              Security
            </button>
            <button @click="activeTab = 'payment'" class="px-6 py-3 font-medium text-sm" :class="activeTab === 'payment' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'">
              Payment
            </button>
          </nav>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <div v-if="loading" class="py-6 text-center">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-600">Loading profile information...</p>
          </div>
          <form v-else @submit.prevent="saveProfile" class="space-y-6">
            <div class="flex items-center">
              <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="Profile picture" class="w-full h-full object-cover" />
                <UserIcon v-else class="h-10 w-10 text-gray-400" />
              </div>
              <div class="ml-6">
                <div class="flex items-center">
                  <button type="button" class="bg-white px-3 py-1.5 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50" @click="avatarFileInput?.click()">
                    Change picture
                  </button>
                  <button type="button" class="ml-3 text-sm text-gray-500 hover:text-gray-700">
                    Remove
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">PNG, JPG or GIF up to 2MB</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">First name</label>
                <input type="text" id="firstName" v-model="profile.firstName" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                <input type="text" id="lastName" v-model="profile.lastName" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <input type="email" id="email" v-model="profile.email" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone number</label>
                <input type="tel" id="phoneNumber" v-model="profile.phoneNumber" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <div v-if="profileSaving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>{{ profileSaving ? 'Saving...' : 'Save changes' }}</span>
              </button>
            </div>
          </form>
          <input ref="avatarFileInput" type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
        </div>

        <!-- Company Tab -->
        <div v-if="activeTab === 'company'" class="p-6">
          <form @submit.prevent="saveCompany" class="space-y-6">
            <div>
              <label for="companyName" class="block text-sm font-medium text-gray-700">Company name</label>
              <input type="text" id="companyName" v-model="company.name" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Company description</label>
              <textarea id="description" v-model="company.description" rows="4" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" v-model="company.address" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="city" v-model="company.city" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
                <input type="text" id="state" v-model="company.state" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
              <div>
                <label for="zipCode" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                <input type="text" id="zipCode" v-model="company.zipCode" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <div v-if="companySaving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>{{ companySaving ? 'Saving...' : 'Save changes' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="p-6">
          <div class="space-y-6">
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">Email Notifications</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input id="emailNewLoad" type="checkbox" v-model="notificationSettings.emailNewLoad" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label for="emailNewLoad" class="ml-3 text-sm text-gray-700">New load notifications</label>
                </div>
                <div class="flex items-center">
                  <input id="emailUpdate" type="checkbox" v-model="notificationSettings.emailOrderUpdate" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label for="emailUpdate" class="ml-3 text-sm text-gray-700">Order status updates</label>
                </div>
                <div class="flex items-center">
                  <input id="emailPayment" type="checkbox" v-model="notificationSettings.emailPayment" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label for="emailPayment" class="ml-3 text-sm text-gray-700">Payment notifications</label>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900">SMS Notifications</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input id="smsNewLoad" type="checkbox" v-model="notificationSettings.smsNewLoad" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label for="smsNewLoad" class="ml-3 text-sm text-gray-700">New load notifications</label>
                </div>
                <div class="flex items-center">
                  <input id="smsUpdate" type="checkbox" v-model="notificationSettings.smsOrderUpdate" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <label for="smsUpdate" class="ml-3 text-sm text-gray-700">Order status updates</label>
                </div>
              </div>
            </div>

            <div>
              <button @click="saveNotifications" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <div v-if="notificationsSaving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>{{ notificationsSaving ? 'Saving...' : 'Save preferences' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="p-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Change Password</h3>
              <form @submit.prevent="changePassword" class="mt-4 space-y-4">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current password</label>
                  <input type="password" id="currentPassword" v-model="passwordForm.currentPassword" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">New password</label>
                  <input type="password" id="newPassword" v-model="passwordForm.newPassword" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm new password</label>
                  <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <div v-if="passwordSaving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>{{ passwordSaving ? 'Updating...' : 'Update password' }}</span>
                  </button>
                </div>
              </form>
            </div>

            <div class="pt-6 border-t border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              <div class="mt-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-700">Add an extra layer of security to your account.</p>
                    <p class="mt-1 text-sm text-gray-500">We'll send you a verification code by SMS each time you sign in.</p>
                  </div>
                  <div class="ml-4">
                    <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Payment Tab -->
        <div v-if="activeTab === 'payment'" class="p-6">
          <div class="space-y-8">
            <!-- Platform Fees Section -->
            <div class="pb-6 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Platform Fees</h3>
              <PlatformFeePayment 
                userType="truck-provider"
                :userId="userId"
                :feeId="selectedFeeId"
                :showPaymentForm="showDirectPaymentForm"
              />
            </div>
            
            <!-- Payment Methods Section -->
            <div>
              <h3 class="text-lg font-medium text-gray-900">Payment Information</h3>
              <p class="mt-1 text-sm text-gray-500">Update your payment methods for receiving payments from completed orders.</p>
              
              <form @submit.prevent="savePaymentInfo" class="mt-4 space-y-4">
                <div>
                  <label for="accountName" class="block text-sm font-medium text-gray-700">Account holder name</label>
                  <input type="text" id="accountName" v-model="paymentInfo.accountName" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label for="accountNumber" class="block text-sm font-medium text-gray-700">Account number</label>
                  <input type="text" id="accountNumber" v-model="paymentInfo.accountNumber" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <label for="routingNumber" class="block text-sm font-medium text-gray-700">Routing number</label>
                  <input type="text" id="routingNumber" v-model="paymentInfo.routingNumber" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                  <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <div v-if="paymentSaving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>{{ paymentSaving ? 'Saving...' : 'Save payment info' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { UserIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import PlatformFeePayment from '~/components/PlatformFeePayment.vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'truck-provider-dashboard',
  middleware: ['auth']
})

const { user, getToken } = useAuth()
const route = useRoute()
const userId = ref('')

const activeTab = ref('profile')
const loading = ref(true)
const profileSaving = ref(false)
const companySaving = ref(false)
const notificationsSaving = ref(false)
const passwordSaving = ref(false)
const paymentSaving = ref(false)
const selectedFeeId = ref(null)
const showDirectPaymentForm = ref(false)

// Profile information
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  avatarUrl: ''
})

// Company information
const company = ref({
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
})

// Notification settings
const notificationSettings = ref({
  emailNewLoad: true,
  emailOrderUpdate: true,
  emailPayment: true,
  smsNewLoad: false,
  smsOrderUpdate: false
})

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Payment information
const paymentInfo = ref({
  bankName: '',
  accountNumber: '',
  routingNumber: '',
  accountType: 'checking',
  paymentFrequency: 'biweekly'
})

// Add a ref for the file input
const avatarFileInput = ref<HTMLInputElement | null>(null)

// Handle profile image change
async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) throw new Error('Failed to upload image')
      const data = await response.json()
      profile.value.avatarUrl = data.url // /api/uploads/filename.ext
    } catch (e) {
      alert('Failed to upload profile image.')
    }
  }
}

// Fetch user data
async function fetchData() {
  loading.value = true
  
  try {
    // Set profile data from the auth store
    if (user.value) {
      profile.value = {
        firstName: user.value.firstName || '',
        lastName: user.value.lastName || '',
        email: user.value.email || '',
        phoneNumber: user.value.phoneNumber || '',
        avatarUrl: user.value.avatarUrl || ''
      }
      
      // Set userId for the platform fee payment component
      userId.value = user.value.id || ''
    }
    
    // Fetch payment info from API
    const token = getToken()
    if (token) {
      try {
        const { data } = await useFetch('/api/truck-provider/payment-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (data.value) {
          paymentInfo.value = {
            bankName: data.value.bankName || '',
            accountNumber: data.value.accountNumber || '',
            routingNumber: data.value.routingNumber || '',
            accountType: data.value.accountType || 'checking',
            paymentFrequency: data.value.paymentFrequency || 'biweekly'
          }
        }
      } catch (error) {
        console.error('Error fetching payment info:', error)
        // If payment info doesn't exist yet, we'll create it later
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    loading.value = false
  }
}

// Save profile information
async function saveProfile() {
  profileSaving.value = true
  
  try {
    const token = getToken()
    const result = await $fetch('/api/truck-provider/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: profile.value
    })
    
    if (result) {
      // Update local user data
      if (user.value) {
        user.value.firstName = profile.value.firstName
        user.value.lastName = profile.value.lastName
        user.value.phoneNumber = profile.value.phoneNumber
        user.value.avatarUrl = profile.value.avatarUrl
      }
      
      alert('Profile updated successfully')
    }
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Error updating profile. Please try again.')
  } finally {
    profileSaving.value = false
  }
}

// Save company information
async function saveCompany() {
  companySaving.value = true
  
  try {
    const token = getToken()
    const result = await $fetch('/api/truck-provider/company', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: company.value
    })
    
    if (result) {
      // Update local company data
      if (user.value) {
        user.value.company = {
          name: company.value.name,
          description: company.value.description,
          address: company.value.address,
          city: company.value.city,
          state: company.value.state,
          zipCode: company.value.zipCode
        }
      }
      
      alert('Company information updated successfully')
    }
  } catch (error) {
    console.error('Error saving company info:', error)
    alert('Error updating company information. Please try again.')
  } finally {
    companySaving.value = false
  }
}

// Save notification preferences
async function saveNotifications() {
  notificationsSaving.value = true
  
  try {
    const token = getToken()
    const result = await $fetch('/api/truck-provider/notification-settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: notificationSettings.value
    })
    
    if (result) {
      alert('Notification preferences updated successfully')
    }
  } catch (error) {
    console.error('Error saving notification preferences:', error)
    alert('Error updating notification preferences. Please try again.')
  } finally {
    notificationsSaving.value = false
  }
}

// Change password
async function changePassword() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    alert('All password fields are required')
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New password and confirmation do not match')
    return
  }
  
  passwordSaving.value = true
  
  try {
    const token = getToken()
    const result = await $fetch('/api/truck-provider/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    })
    
    if (result) {
      alert('Password changed successfully')
      
      // Clear the form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  } catch (error) {
    console.error('Error changing password:', error)
    alert('Error changing password. Please check your current password and try again.')
  } finally {
    passwordSaving.value = false
  }
}

// Save payment information
async function savePaymentInfo() {
  paymentSaving.value = true
  
  try {
    const token = getToken()
    const result = await $fetch('/api/truck-provider/payment-info', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: paymentInfo.value
    })
    
    if (result) {
      alert('Payment information updated successfully')
    }
  } catch (error) {
    console.error('Error saving payment info:', error)
    alert('Error updating payment information. Please try again.')
  } finally {
    paymentSaving.value = false
  }
}

onMounted(() => {
  fetchData()
  
  // Check URL params for tab selection and fee ID
  const tabParam = route.query.tab as string
  if (tabParam) {
    activeTab.value = tabParam
  }
  
  const feeIdParam = route.query.feeId as string
  if (feeIdParam) {
    selectedFeeId.value = feeIdParam
  }
  
  const showPaymentForm = route.query.showPaymentForm as string
  if (showPaymentForm === 'true') {
    showDirectPaymentForm.value = true
  }
})
</script>

<style scoped>
.settings-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 1.5rem;
}

.settings-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.settings-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.settings-description {
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab:hover {
  color: #4f46e5;
}

.tab.active {
  color: #4f46e5;
  border-bottom: 2px solid #4f46e5;
}

.tab-content {
  padding: 1.5rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20rem;
}

.form-row {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px #4f46e5;
}

.textarea {
  min-height: 6rem;
}

.form-hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.error-message {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #dc2626;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.checkbox {
  height: 1rem;
  width: 1rem;
  color: #4f46e5;
}

.checkbox-label {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.avatar-upload {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.avatar {
  height: 4rem;
  width: 4rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-icon {
  height: 2rem;
  width: 2rem;
  color: #9ca3af;
}

.avatar-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.avatar-actions {
  margin-left: 1rem;
}

.avatar-button {
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-button:hover {
  background-color: #f9fafb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-primary:disabled {
  background-color: #818cf8;
  cursor: not-allowed;
}

.label-required::after {
  content: ' *';
  color: #dc2626;
}

.payment-note {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.payment-note-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.payment-note-icon {
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.5rem;
  color: #4f46e5;
}

select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  transition: border-color 0.15s ease-in-out;
}

select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px #4f46e5;
}

@media (min-width: 640px) {
  .form-row {
    display: flex;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
  
  .form-col {
    flex: 1;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style> 