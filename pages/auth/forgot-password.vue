<template>
  <div class="min-h-screen bg-navy-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="/images/logo.png" alt="TruckX" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-navy-900">
        Forgot your password?
      </h2>
      <p class="mt-2 text-center text-sm text-navy-600">
        Enter your email address and we'll send you a code to reset your password.
      </p>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form v-if="!showResetForm" class="space-y-6" @submit.prevent="handleForgotPassword">
          <div>
            <label for="email" class="block text-sm font-medium text-navy-700">Email address</label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            </div>
          </div>
          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
              <span v-if="loading">Sending...</span>
              <span v-else>Send reset code</span>
            </button>
          </div>
          <div v-if="message" class="mt-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            {{ message }}
          </div>
          <div v-if="error" class="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {{ error }}
          </div>
        </form>
        <form v-else class="space-y-6" @submit.prevent="handleResetPassword">
          <div>
            <label for="otp" class="block text-sm font-medium text-navy-700">Reset Code</label>
            <div class="mt-1">
              <input id="otp" v-model="otp" name="otp" type="text" maxlength="6" minlength="6" required pattern="\d{6}"
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-navy-700">New Password</label>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" autocomplete="new-password" required
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            </div>
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-navy-700">Confirm New Password</label>
            <div class="mt-1">
              <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" required
                class="appearance-none block w-full px-3 py-2 border border-navy-300 rounded-md shadow-sm placeholder-navy-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            </div>
          </div>
          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200">
              <span v-if="loading">Resetting...</span>
              <span v-else>Reset Password</span>
            </button>
          </div>
          <div v-if="resetMessage" class="mt-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            {{ resetMessage }}
          </div>
          <div v-if="resetError" class="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {{ resetError }}
          </div>
        </form>
        <div class="mt-6 text-center">
          <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
            Back to login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')
const showResetForm = ref(false)
const otp = ref('')
const password = ref('')
const confirmPassword = ref('')
const resetMessage = ref('')
const resetError = ref('')

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleForgotPassword = async () => {
  if (!email.value) {
    error.value = 'Email is required.'
    return
  }
  if (!isValidEmail(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    message.value = 'If an account with that email exists, a reset code has been sent to your email.'
    showResetForm.value = true
  } catch (err: any) {
    error.value = err.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!otp.value || otp.value.length !== 6 || !/^\d{6}$/.test(otp.value)) {
    resetError.value = 'Please enter the 6-digit reset code sent to your email.'
    return
  }
  if (password.value.length < 6) {
    resetError.value = 'Password must be at least 6 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    resetError.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  resetMessage.value = ''
  resetError.value = ''
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { otp: otp.value, password: password.value, email: email.value }
    })
    resetMessage.value = 'Your password has been reset. You can now log in.'
    setTimeout(() => router.push('/auth/login'), 1500)
  } catch (err: any) {
    resetError.value = err.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script> 