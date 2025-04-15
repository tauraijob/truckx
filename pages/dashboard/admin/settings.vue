<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Platform Administration</h1>
        <p class="mt-1 text-sm text-gray-600">Configure system settings and manage platform operations.</p>
      </div>

      <!-- Settings Container -->
      <div class="bg-white shadow rounded-lg">
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Settings tabs">
            <button 
              @click="activeTab = 'platform'" 
              class="py-4 px-1 border-b-2 font-medium text-sm" 
              :class="activeTab === 'platform' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Platform Settings
            </button>
            <button 
              @click="activeTab = 'users'" 
              class="py-4 px-1 border-b-2 font-medium text-sm" 
              :class="activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              User Management
            </button>
            <button 
              @click="activeTab = 'security'" 
              class="py-4 px-1 border-b-2 font-medium text-sm" 
              :class="activeTab === 'security' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Security
            </button>
            <button 
              @click="activeTab = 'integrations'" 
              class="py-4 px-1 border-b-2 font-medium text-sm" 
              :class="activeTab === 'integrations' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Integrations
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="py-10 text-center">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-600">Loading settings...</p>
          </div>

          <!-- Platform Settings Tab -->
          <div v-else-if="activeTab === 'platform'" class="space-y-8">
            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">General Configuration</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-5">
                  <div class="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-6">
                    <div>
                      <label for="platformName" class="form-label">Platform Name</label>
                      <input 
                        type="text" 
                        id="platformName" 
                        v-model="settings.general.platformName" 
                        class="form-input"
                      />
                    </div>
                    <div>
                      <label for="supportEmail" class="form-label">Support Email</label>
                      <input 
                        type="email" 
                        id="supportEmail" 
                        v-model="settings.general.supportEmail" 
                        class="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">Commission Settings</h3>
                <p class="text-sm text-gray-500 mt-1">Configure commission rates for the platform. These settings apply to all transactions.</p>
              </div>
              <div class="settings-card-body">
                <div class="space-y-5">
                  <div class="form-group">
                    <label for="platformFee" class="form-label">Platform Fee (%)</label>
                    <div class="input-group max-w-xs">
                      <input 
                        type="number" 
                        id="platformFee" 
                        v-model="settings.commission.platformFee" 
                        min="0" 
                        max="100" 
                        class="form-input rounded-r-none"
                      />
                      <span class="input-group-text">%</span>
                    </div>
                    <p class="form-hint">Global platform commission applied to all transactions</p>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Provider Commission Rates</label>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div class="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div class="flex justify-between items-center mb-3">
                          <h4 class="text-sm font-medium text-gray-900">Truck Provider Rate</h4>
                          <span class="text-xs font-medium text-gray-500">{{ 100 - settings.commission.truckProviderFee }}%</span>
                        </div>
                        <div>
                          <label for="truckProviderFee" class="text-xs text-gray-500 mb-1 block">Platform Fee</label>
                          <input 
                            type="range" 
                            id="truckProviderFee" 
                            v-model="settings.commission.truckProviderFee" 
                            min="0" 
                            max="50" 
                            step="1"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div class="flex justify-between mt-1">
                            <span class="text-xs text-gray-500">{{ settings.commission.truckProviderFee }}%</span>
                            <span class="text-xs text-gray-500">to platform</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div class="flex justify-between items-center mb-3">
                          <h4 class="text-sm font-medium text-gray-900">Load Provider Rate</h4>
                          <span class="text-xs font-medium text-gray-500">{{ 100 - settings.commission.loadProviderFee }}%</span>
                        </div>
                        <div>
                          <label for="loadProviderFee" class="text-xs text-gray-500 mb-1 block">Platform Fee</label>
                          <input 
                            type="range" 
                            id="loadProviderFee" 
                            v-model="settings.commission.loadProviderFee" 
                            min="0" 
                            max="50" 
                            step="1"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div class="flex justify-between mt-1">
                            <span class="text-xs text-gray-500">{{ settings.commission.loadProviderFee }}%</span>
                            <span class="text-xs text-gray-500">to platform</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <div class="checkbox-wrapper">
                      <div class="flex h-5 items-center">
                        <input 
                          id="autoApply" 
                          type="checkbox" 
                          v-model="settings.commission.autoApply" 
                          class="checkbox-input"
                        />
                      </div>
                      <div class="checkbox-label">
                        <label for="autoApply" class="font-medium text-gray-700">Auto-Apply Commission</label>
                        <p class="form-hint">Automatically apply commission fees to all new transactions</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                      <div class="text-sm text-blue-700">
                        <p>Changes to commission rates will apply to all <strong>new</strong> transactions. Existing transactions will maintain their original rates.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Commission Preview Section -->
                  <div class="mt-6 border-t border-gray-200 pt-6">
                    <h4 class="text-sm font-medium text-gray-900 mb-4">Commission Preview (Sample $1000 Transaction)</h4>
                    
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <!-- Truck Provider Preview -->
                      <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 class="text-xs font-medium text-gray-700 uppercase mb-2">Truck Provider Transaction</h5>
                        <div class="space-y-2">
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Transaction Amount</span>
                            <span class="text-sm font-medium">${{ truckCommission.total }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Platform Fee ({{ truckCommission.feePercentage }}%)</span>
                            <span class="text-sm font-medium text-red-600">-${{ truckCommission.platformAmount }}</span>
                          </div>
                          <div class="pt-2 border-t border-gray-100">
                            <div class="flex justify-between">
                              <span class="text-sm font-medium text-gray-700">Provider Receives</span>
                              <span class="text-sm font-medium text-green-600">${{ truckCommission.providerAmount }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Load Provider Preview -->
                      <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 class="text-xs font-medium text-gray-700 uppercase mb-2">Load Provider Transaction</h5>
                        <div class="space-y-2">
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Transaction Amount</span>
                            <span class="text-sm font-medium">${{ loadCommission.total }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Platform Fee ({{ loadCommission.feePercentage }}%)</span>
                            <span class="text-sm font-medium text-red-600">-${{ loadCommission.platformAmount }}</span>
                          </div>
                          <div class="pt-2 border-t border-gray-100">
                            <div class="flex justify-between">
                              <span class="text-sm font-medium text-gray-700">Provider Receives</span>
                              <span class="text-sm font-medium text-green-600">${{ loadCommission.providerAmount }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">System Status</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="maintenanceMode" 
                        type="checkbox" 
                        v-model="settings.system.maintenanceMode" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="maintenanceMode" class="font-medium text-gray-700">Maintenance Mode</label>
                      <p class="form-hint">When enabled, only administrators can access the platform.</p>
                    </div>
                  </div>
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="debugMode" 
                        type="checkbox" 
                        v-model="settings.system.debugMode" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="debugMode" class="font-medium text-gray-700">Debug Mode</label>
                      <p class="form-hint">Enable detailed error reporting and logging.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div v-if="saveStatus === 'success'" class="message message-success mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <div v-if="saveStatus === 'error'" class="message message-error mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <button 
                @click="savePlatformSettings" 
                class="btn btn-primary"
                :disabled="isSaving"
              >
                <div v-if="isSaving" class="spinner"></div>
                <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </div>

          <!-- User Management Tab -->
          <div v-else-if="activeTab === 'users'" class="space-y-8">
            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">Registration Settings</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="allowRegistration" 
                        type="checkbox" 
                        v-model="settings.users.allowRegistration" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="allowRegistration" class="font-medium text-gray-700">Allow New Registrations</label>
                      <p class="form-hint">When disabled, new users cannot register.</p>
                    </div>
                  </div>
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="requireApproval" 
                        type="checkbox" 
                        v-model="settings.users.requireApproval" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="requireApproval" class="font-medium text-gray-700">Require Admin Approval</label>
                      <p class="form-hint">New accounts require administrator approval before activation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">User Verification</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="emailVerification" 
                        type="checkbox" 
                        v-model="settings.users.emailVerification" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="emailVerification" class="font-medium text-gray-700">Email Verification</label>
                      <p class="form-hint">Require users to verify their email address.</p>
                    </div>
                  </div>
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="phoneVerification" 
                        type="checkbox" 
                        v-model="settings.users.phoneVerification" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="phoneVerification" class="font-medium text-gray-700">Phone Verification</label>
                      <p class="form-hint">Require users to verify their phone number.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div v-if="saveStatus === 'success'" class="message message-success mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <div v-if="saveStatus === 'error'" class="message message-error mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <button 
                @click="saveUserSettings" 
                class="btn btn-primary"
                :disabled="isSaving"
              >
                <div v-if="isSaving" class="spinner"></div>
                <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-else-if="activeTab === 'security'" class="space-y-8">
            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">Authentication</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="enforceTwoFactor" 
                        type="checkbox" 
                        v-model="settings.security.enforceTwoFactor" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="enforceTwoFactor" class="font-medium text-gray-700">Enforce Two-Factor Authentication</label>
                      <p class="form-hint">Require all users to set up two-factor authentication.</p>
                    </div>
                  </div>
                  <div class="space-y-5">
                    <div>
                      <label for="sessionTimeout" class="form-label">Session Timeout (minutes)</label>
                      <input 
                        type="number" 
                        id="sessionTimeout" 
                        v-model="settings.security.sessionTimeout" 
                        min="5" 
                        class="form-input w-40"
                      />
                    </div>
                    <div>
                      <label for="maxLoginAttempts" class="form-label">Max Login Attempts</label>
                      <input 
                        type="number" 
                        id="maxLoginAttempts" 
                        v-model="settings.security.maxLoginAttempts" 
                        min="1" 
                        class="form-input w-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">API Security</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div class="space-y-5">
                    <div>
                      <label for="apiRateLimit" class="form-label">API Rate Limit (requests per minute)</label>
                      <input 
                        type="number" 
                        id="apiRateLimit" 
                        v-model="settings.security.apiRateLimit" 
                        min="10" 
                        class="form-input w-40"
                      />
                    </div>
                    <div class="checkbox-wrapper">
                      <div class="flex h-5 items-center">
                        <input 
                          id="enableCors" 
                          type="checkbox" 
                          v-model="settings.security.enableCors" 
                          class="checkbox-input"
                        />
                      </div>
                      <div class="checkbox-label">
                        <label for="enableCors" class="font-medium text-gray-700">Enable CORS</label>
                        <p class="form-hint">Allow cross-origin requests to the API.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div v-if="saveStatus === 'success'" class="message message-success mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <div v-if="saveStatus === 'error'" class="message message-error mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <button 
                @click="saveSecuritySettings" 
                class="btn btn-primary"
                :disabled="isSaving"
              >
                <div v-if="isSaving" class="spinner"></div>
                <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </div>

          <!-- Integrations Tab -->
          <div v-else-if="activeTab === 'integrations'" class="space-y-8">
            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">Payment Gateway</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div>
                    <label for="paymentGateway" class="form-label">Payment Provider</label>
                    <select 
                      id="paymentGateway" 
                      v-model="settings.integrations.paymentGateway" 
                      class="form-select"
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                  <div>
                    <label for="apiKey" class="form-label">API Key</label>
                    <input 
                      type="password" 
                      id="apiKey" 
                      v-model="settings.integrations.apiKey" 
                      class="form-input"
                    />
                  </div>
                  <div class="checkbox-wrapper">
                    <div class="flex h-5 items-center">
                      <input 
                        id="testMode" 
                        type="checkbox" 
                        v-model="settings.integrations.testMode" 
                        class="checkbox-input"
                      />
                    </div>
                    <div class="checkbox-label">
                      <label for="testMode" class="font-medium text-gray-700">Test Mode</label>
                      <p class="form-hint">Use sandbox environment for payments.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="settings-card">
              <div class="settings-card-header">
                <h3 class="section-title mb-0">Email Service</h3>
              </div>
              <div class="settings-card-body">
                <div class="space-y-4">
                  <div>
                    <label for="emailProvider" class="form-label">Email Provider</label>
                    <select 
                      id="emailProvider" 
                      v-model="settings.integrations.emailProvider" 
                      class="form-select"
                    >
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailchimp">Mailchimp</option>
                      <option value="ses">Amazon SES</option>
                    </select>
                  </div>
                  <div>
                    <label for="emailApiKey" class="form-label">API Key</label>
                    <input 
                      type="password" 
                      id="emailApiKey" 
                      v-model="settings.integrations.emailApiKey" 
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <div v-if="saveStatus === 'success'" class="message message-success mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <div v-if="saveStatus === 'error'" class="message message-error mb-4">
                <p>{{ saveMessage }}</p>
              </div>
              <button 
                @click="saveIntegrationsSettings" 
                class="btn btn-primary"
                :disabled="isSaving"
              >
                <div v-if="isSaving" class="spinner"></div>
                <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

// State
const activeTab = ref('platform')
const isLoading = ref(true)
const isSaving = ref(false)
const saveStatus = ref<'success' | 'error' | null>(null)
const saveMessage = ref('')

// Reset status when changing tabs
watch(activeTab, () => {
  saveStatus.value = null
  saveMessage.value = ''
})

// Settings data
const settings = ref({
  general: {
    platformName: 'TruckX',
    supportEmail: 'support@truckx.io'
  },
  commission: {
    platformFee: 20,
    truckProviderFee: 20,
    loadProviderFee: 20,
    autoApply: true
  },
  system: {
    maintenanceMode: false,
    debugMode: false
  },
  users: {
    allowRegistration: true,
    requireApproval: true,
    emailVerification: true,
    phoneVerification: false
  },
  security: {
    enforceTwoFactor: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    apiRateLimit: 60,
    enableCors: true
  },
  integrations: {
    paymentGateway: 'stripe',
    apiKey: 'sk_test_*****',
    testMode: true,
    emailProvider: 'sendgrid',
    emailApiKey: '*****'
  }
})

// Computed properties for commission previews
const truckCommission = computed(() => calculateCommission(1000, 'truck'))
const loadCommission = computed(() => calculateCommission(1000, 'load'))

// Fetch settings data
async function fetchSettings() {
  isLoading.value = true
  
  try {
    // In a real application, fetch from API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo, we'll use the default values
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching settings:', error)
    isLoading.value = false
  }
}

// Save platform settings
async function savePlatformSettings() {
  await saveSettings('platform')
}

// Save user settings
async function saveUserSettings() {
  await saveSettings('users')
}

// Save security settings
async function saveSecuritySettings() {
  await saveSettings('security')
}

// Save integrations settings
async function saveIntegrationsSettings() {
  await saveSettings('integrations')
}

// Generic save function
async function saveSettings(section) {
  isSaving.value = true
  saveStatus.value = null
  saveMessage.value = ''
  
  try {
    // In a real application, send to API
    console.log(`Saving ${section} settings:`, settings.value[section])
    
    // Special handling for commission settings
    if (section === 'platform') {
      // This would typically be an API call to update commission settings
      console.log('Updating system-wide commission rates:')
      console.log(`- Platform fee: ${settings.value.commission.platformFee}%`)
      console.log(`- Truck provider fee: ${settings.value.commission.truckProviderFee}%`)
      console.log(`- Load provider fee: ${settings.value.commission.loadProviderFee}%`)
      console.log(`- Auto-apply: ${settings.value.commission.autoApply}`)
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    saveStatus.value = 'success'
    saveMessage.value = section === 'platform' ? 
      'Commission settings saved and applied to all new transactions' : 
      'Settings saved successfully'
    
    isSaving.value = false
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      if (saveStatus.value === 'success') {
        saveStatus.value = null
        saveMessage.value = ''
      }
    }, 5000)
  } catch (error) {
    console.error('Error saving settings:', error)
    saveStatus.value = 'error'
    saveMessage.value = 'Error saving settings. Please try again.'
    isSaving.value = false
  }
}

// Calculate commission for a sample transaction (for demo/preview)
function calculateCommission(amount, providerType) {
  const feePercentage = providerType === 'truck' 
    ? settings.value.commission.truckProviderFee 
    : settings.value.commission.loadProviderFee
  
  const platformAmount = (amount * feePercentage) / 100
  const providerAmount = amount - platformAmount
  
  return {
    total: amount,
    platformAmount: platformAmount.toFixed(2),
    providerAmount: providerAmount.toFixed(2),
    feePercentage
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
/* Base form elements */
.form-input, 
.form-select, 
.form-textarea {
  @apply w-full rounded-md border-gray-300 shadow-sm px-4 py-3;
  @apply focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30;
  @apply text-gray-900 text-sm transition duration-150 ease-in-out;
  @apply bg-white;
}

/* Form labels */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

/* Help text */
.form-hint {
  @apply mt-2 text-xs text-gray-500;
}

/* Form groups */
.form-group {
  @apply mb-6 last:mb-0;
}

/* Card sections */
.settings-card {
  @apply bg-white overflow-hidden rounded-lg border border-gray-200 mb-8 last:mb-6;
}

.settings-card-header {
  @apply px-6 py-5 bg-gray-50 border-b border-gray-200;
}

.settings-card-body {
  @apply px-6 py-6;
}

/* Checkboxes */
.checkbox-wrapper {
  @apply relative flex items-start mb-4 last:mb-0;
}

.checkbox-input {
  @apply h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500;
}

.checkbox-label {
  @apply ml-3 block text-sm;
}

/* Buttons */
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply transition-colors duration-150 ease-in-out;
}

.btn-primary {
  @apply bg-indigo-600 text-white hover:bg-indigo-700;
  @apply focus:ring-indigo-500;
}

.btn-secondary {
  @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50;
  @apply focus:ring-gray-500;
}

/* Sections */
.section-title {
  @apply text-lg font-medium text-gray-900 mb-4;
}

.subsection {
  @apply mt-8 first:mt-0;
}

/* Input groups */
.input-group {
  @apply flex rounded-md shadow-sm;
}

.input-group-text {
  @apply inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm;
}

/* Loading spinner */
.spinner {
  @apply animate-spin rounded-full border-2 border-current border-t-transparent;
  @apply h-4 w-4 mr-2;
}

/* Success and error messages */
.message {
  @apply p-4 mb-6 rounded-md;
}

.message-success {
  @apply bg-green-50 text-green-800 border border-green-200;
}

.message-error {
  @apply bg-red-50 text-red-800 border border-red-200;
}

/* Number inputs */
input[type="number"].form-input {
  @apply pr-2;
}

/* Custom focus outline */
.focus-visible {
  @apply outline-none ring-2 ring-indigo-500 ring-opacity-50;
}

/* Disabled state */
.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled,
.btn:disabled {
  @apply opacity-60 cursor-not-allowed;
}
</style> 