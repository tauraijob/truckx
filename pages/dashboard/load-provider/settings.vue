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
                    <form @submit.prevent="saveProfile">
                        <div class="space-y-6">
                            <div class="flex items-center">
                                <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <img v-if="profileData.avatarUrl" :src="profileData.avatarUrl" alt="Profile picture" class="w-full h-full object-cover" />
                                    <UserIcon v-else class="h-10 w-10 text-gray-400" />
                                </div>
                                <div class="ml-6">
                                    <div class="flex items-center">
                                        <button type="button" class="bg-white px-3 py-1.5 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50">
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
                                    <input type="text" id="firstName" v-model="profileData.firstName" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="lastName" class="block text-sm font-medium text-gray-700">Last name</label>
                                    <input type="text" id="lastName" v-model="profileData.lastName" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                                    <input type="email" id="email" v-model="profileData.email" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone number</label>
                                    <input type="tel" id="phone" v-model="profileData.phone" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <div v-if="saving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                    <span>{{ saving ? 'Saving...' : 'Save changes' }}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Company Tab -->
                <div v-if="activeTab === 'company'" class="p-6">
                    <form @submit.prevent="saveCompany">
                        <div class="space-y-6">
                            <div>
                                <label for="companyName" class="block text-sm font-medium text-gray-700">Company name</label>
                                <input type="text" id="companyName" v-model="companyData.name" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                            </div>

                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700">Company description</label>
                                <textarea id="description" v-model="companyData.description" rows="4" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
                            </div>

                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                                    <input type="text" id="address" v-model="companyData.address" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" id="city" v-model="companyData.city" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
                                    <input type="text" id="state" v-model="companyData.state" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="zipCode" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                                    <input type="text" id="zipCode" v-model="companyData.zipCode" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <div v-if="saving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                    <span>{{ saving ? 'Saving...' : 'Save changes' }}</span>
                                </button>
                            </div>
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
                                    <input id="emailNew" type="checkbox" v-model="notificationSettings.emailNewOrder" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                    <label for="emailNew" class="ml-3 text-sm text-gray-700">New order notifications</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="emailUpdate" type="checkbox" v-model="notificationSettings.emailOrderUpdate" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                    <label for="emailUpdate" class="ml-3 text-sm text-gray-700">Order status updates</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="emailBid" type="checkbox" v-model="notificationSettings.emailNewBid" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                    <label for="emailBid" class="ml-3 text-sm text-gray-700">New truck availability</label>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-lg font-medium text-gray-900">SMS Notifications</h3>
                            <div class="space-y-2">
                                <div class="flex items-center">
                                    <input id="smsNew" type="checkbox" v-model="notificationSettings.smsNewOrder" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                    <label for="smsNew" class="ml-3 text-sm text-gray-700">New order notifications</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="smsUpdate" type="checkbox" v-model="notificationSettings.smsOrderUpdate" class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                    <label for="smsUpdate" class="ml-3 text-sm text-gray-700">Order status updates</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button @click="saveNotifications" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <div v-if="saving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                <span>{{ saving ? 'Saving...' : 'Save preferences' }}</span>
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
                                    <input type="password" id="currentPassword" v-model="passwordData.current" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="newPassword" class="block text-sm font-medium text-gray-700">New password</label>
                                    <input type="password" id="newPassword" v-model="passwordData.new" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm new password</label>
                                    <input type="password" id="confirmPassword" v-model="passwordData.confirm" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                                </div>
                                <div>
                                    <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        <div v-if="saving" class="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                        <span>{{ saving ? 'Updating...' : 'Update password' }}</span>
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
                                userType="load-provider"
                                :userId="userId"
                                :feeId="selectedFeeId"
                                :showPaymentForm="showDirectPaymentForm"
                            />
                        </div>
                        
                        <!-- Payment Methods Section -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">Payment Information</h3>
                            <p class="mt-1 text-sm text-gray-500">Update your payment methods for receiving refunds or withdrawals.</p>
                            
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
    layout: 'load-provider-dashboard',
    middleware: ['auth']
})

const { user, getToken } = useAuth()
const route = useRoute()
const userId = ref('')

// Tabs
const activeTab = ref('profile')
const selectedFeeId = ref(null)
const showDirectPaymentForm = ref(false)

// Form data
const profileData = ref({
    avatarUrl: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
})

const companyData = ref({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
})

const notificationSettings = ref({
    emailNewOrder: true,
    emailOrderUpdate: true,
    emailNewBid: false,
    smsNewOrder: false,
    smsOrderUpdate: false
})

const passwordData = ref({
    current: '',
    new: '',
    confirm: ''
})

const paymentInfo = ref({
    accountName: '',
    accountNumber: '',
    routingNumber: ''
})

// UI state
const saving = ref(false)
const paymentSaving = ref(false)

// Load user data and check for URL parameters
onMounted(() => {
    loadUserData()
    
    // Set userId from the user object for the platform fee payment component
    if (user.value) {
        userId.value = user.value.id
    }
    
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

// Load user data
async function loadUserData() {
    try {
        // Set data from user object if available
        if (user.value) {
            // Set profile data
            profileData.value = {
                avatarUrl: user.value.avatarUrl || '',
                firstName: user.value.firstName || 'John',
                lastName: user.value.lastName || 'Doe',
                email: user.value.email || 'john.doe@example.com',
                phone: user.value.phone || '(123) 456-7890'
            }
            
            companyData.value = {
                name: user.value.company?.name || '',
                description: user.value.company?.description || '',
                address: user.value.company?.address || '',
                city: user.value.company?.city || '',
                state: user.value.company?.state || '',
                zipCode: user.value.company?.zipCode || ''
            }
            
            notificationSettings.value = user.value.notificationSettings || {
                emailNewOrder: true,
                emailOrderUpdate: true,
                emailNewBid: false,
                smsNewOrder: false,
                smsOrderUpdate: false
            }
        } else {
            // Mock data if no user available
            setTimeout(() => {
                profileData.value = {
                    avatarUrl: '',
                    firstName: 'Taurai Job',
                    lastName: 'Munodawafa',
                    email: 'taujob@outlook.com',
                    phone: '+263778456168'
                }
                
                companyData.value = {
                    name: 'TM Logistics',
                    description: 'Specialized in shipping agricultural products across the country.',
                    address: '123 Farm Road',
                    city: 'Harare',
                    state: 'HRE',
                    zipCode: '00263'
                }
            }, 500)
        }
            
        // Actual API implementation would be:
        // const token = localStorage.getItem('token')
        // const { data, error } = await useFetch('/api/load-provider/profile', {
        //     headers: {
        //         'Authorization': `Bearer ${token}`
        //     }
        // })
        // if (data.value) {
        //     profileData.value = {
        //         avatarUrl: data.value.avatarUrl || '',
        //         firstName: data.value.firstName || '',
        //         lastName: data.value.lastName || '',
        //         email: data.value.email || '',
        //         phone: data.value.phone || ''
        //     }
        //     
        //     companyData.value = {
        //         name: data.value.company?.name || '',
        //         description: data.value.company?.description || '',
        //         address: data.value.company?.address || '',
        //         city: data.value.company?.city || '',
        //         state: data.value.company?.state || '',
        //         zipCode: data.value.company?.zipCode || ''
        //     }
        //     
        //     notificationSettings.value = data.value.notificationSettings || {
        //         emailNewOrder: true,
        //         emailOrderUpdate: true,
        //         emailNewBid: false,
        //         smsNewOrder: false,
        //         smsOrderUpdate: false
        //     }
        // }
    } catch (error) {
        console.error('Error loading user data:', error)
    }
}

// Save handlers
function saveProfile() {
    saving.value = true
    
    // Mock API call
    setTimeout(() => {
        saving.value = false
        alert('Profile updated successfully!')
    }, 1000)
    
    // Actual API implementation would be:
    // const token = localStorage.getItem('token')
    // const { data, error } = await useFetch('/api/load-provider/profile', {
    //     method: 'PUT',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     },
    //     body: profileData.value
    // })
    // saving.value = false
    // if (error.value) {
    //     alert(`Error: ${error.value.message}`)
    // } else {
    //     alert('Profile updated successfully!')
    // }
}

function saveCompany() {
    saving.value = true
    
    // Mock API call
    setTimeout(() => {
        saving.value = false
        alert('Company information updated successfully!')
    }, 1000)
}

function saveNotifications() {
    saving.value = true
    
    // Mock API call
    setTimeout(() => {
        saving.value = false
        alert('Notification preferences updated successfully!')
    }, 1000)
}

function changePassword() {
    saving.value = true
    
    // Validate passwords match
    if (passwordData.value.new !== passwordData.value.confirm) {
        alert('New passwords do not match!')
        saving.value = false
        return
    }
    
    // Mock API call
    setTimeout(() => {
        saving.value = false
        alert('Password updated successfully!')
        passwordData.value = {
            current: '',
            new: '',
            confirm: ''
        }
    }, 1000)
}

function savePaymentInfo() {
    paymentSaving.value = true
    
    // Mock API call
    setTimeout(() => {
        paymentSaving.value = false
        alert('Payment information updated successfully!')
    }, 1000)
}
</script> 