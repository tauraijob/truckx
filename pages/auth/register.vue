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

        <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    alert('Account created successfully! Please log in.')
    router.push('/auth/login')
  } catch (err: any) {
    console.error('Registration failed:', err)
    error.value = err.data?.message || 'An error occurred during registration. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>