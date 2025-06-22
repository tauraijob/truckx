<template>
  <div class="min-h-screen bg-navy-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="/images/logo.png" alt="TruckX" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-navy-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-navy-600">
        Or
        <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
          sign in to your existing account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label for="name" class="block text-sm font-medium text-navy-700">
              First Name
            </label>
            <div class="mt-1">
              <input id="name" name="firstName" type="text" autocomplete="given-name" required v-model="name"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-navy-700">
              Last Name
            </label>
            <div class="mt-1">
              <input id="lastName" name="lastName" type="text" autocomplete="family-name" v-model="lastName"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-navy-700">
              Email address
            </label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-navy-700">
              Phone Number
            </label>
            <div class="mt-1">
              <input id="phoneNumber" name="phoneNumber" type="tel" autocomplete="tel" required v-model="phoneNumber"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-navy-700">
              Password
            </label>
            <div class="mt-1">
              <input id="password" name="password" type="password" autocomplete="new-password" required
                v-model="password"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-navy-700">
              Confirm Password
            </label>
            <div class="mt-1">
              <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required
                v-model="confirmPassword"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-navy-700">
              Account Type
            </label>
            <div class="mt-1">
              <select id="role" name="role" required v-model="role"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                <option value="">Select an account type</option>
                <option value="truck_provider">Truck Provider</option>
                <option value="load_provider">Load Provider</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <input id="terms" name="terms" type="checkbox" required v-model="terms"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-navy-300 rounded" />
            <label for="terms" class="ml-2 block text-sm text-navy-900">
              I agree to the
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Terms of Service</a>
              and
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>

          <div>
            <button type="submit" :disabled="loading || !isFormValid"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
              <span v-if="loading">Creating account...</span>
              <span v-else>Create account</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showOtpDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <img src="/images/logo.png" alt="TruckX" class="h-10 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-navy-900 text-center mb-2">Verify Your Email</h3>
        <p class="text-navy-700 text-center mb-4">Enter the 6-digit code sent to your email to verify your account.</p>
        <input v-model="otpInput" maxlength="6" class="w-full px-4 py-2 border border-primary-200 rounded-md text-center text-lg tracking-widest mb-4 focus:ring-primary-500 focus:border-primary-500" placeholder="Enter OTP" />
        <div v-if="otpError" class="text-red-600 text-sm text-center mb-2">{{ otpError }}</div>
        <button @click="verifyOtp" :disabled="otpLoading || otpInput.length !== 6" class="w-full py-2 px-4 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition disabled:opacity-50">Verify</button>
        <button @click="closeOtpDialog" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import pkg from 'vue-toastification'
const { useToast } = pkg

const router = useRouter()
const toast = useToast()

const name = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phoneNumber = ref('')
const role = ref('')
const terms = ref(false)
const loading = ref(false)
const error = ref('')

// OTP dialog state
const showOtpDialog = ref(false)
const otpInput = ref('')
const otpError = ref('')
const otpLoading = ref(false)

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isFormValid = computed(() => {
  return (
    name.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    isValidEmail(email.value) &&
    phoneNumber.value.trim().length > 0 &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value &&
    role.value !== '' &&
    terms.value
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields correctly.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        firstName: name.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        role: role.value
      }
    })
    console.log('Registration successful:', response)
    // Show OTP dialog instead of redirecting
    showOtpDialog.value = true
  } catch (err: any) {
    console.error('Registration failed:', err)
    error.value = err.data?.message || 'An error occurred during registration. Please try again.'
  } finally {
    loading.value = false
  }
}

function closeOtpDialog() {
  showOtpDialog.value = false
  otpInput.value = ''
  otpError.value = ''
}

// Watch for error changes and show Vue Toastification toast
watch(error, (val) => {
  if (val) {
    toast.error(val, {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
    error.value = ''
  }
})

async function verifyOtp() {
  otpLoading.value = true
  otpError.value = ''
  try {
    await $fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: {
        email: email.value,
        otp: otpInput.value
      }
    })
    toast.success('Email verified! You can now log in.', {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
    closeOtpDialog()
    router.push('/auth/login')
  } catch (err: any) {
    otpError.value = err.data?.message || 'Invalid OTP. Please try again.'
    toast.error(otpError.value, {
      timeout: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
  } finally {
    otpLoading.value = false
  }
}
</script>