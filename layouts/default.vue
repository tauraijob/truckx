<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-navy-800 shadow-md">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="flex items-center">
                <img class="h-8 w-auto" src="/images/logo.png" alt="TruckX Logo" />
                <span class="ml-2 text-white font-bold text-xl">TruckX</span>
              </NuxtLink>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink to="/"
                class="border-transparent text-gray-300 hover:border-primary-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </NuxtLink>
              <NuxtLink to="/about"
                class="border-transparent text-gray-300 hover:border-primary-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </NuxtLink>
              <NuxtLink to="/contact"
                class="border-transparent text-gray-300 hover:border-primary-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </NuxtLink>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <NuxtLink to="/auth/login" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              Sign In
            </NuxtLink>
            <NuxtLink to="/auth/register"
              class="ml-4 bg-primary-500 hover:bg-primary-400 text-white px-4 py-2 rounded-md text-sm font-medium">
              Register
            </NuxtLink>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu" aria-expanded="false" @click="mobileMenuOpen = !mobileMenuOpen">
              <span class="sr-only">Open main menu</span>
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="sm:hidden" id="mobile-menu" v-show="mobileMenuOpen">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink to="/"
            class="bg-navy-700 border-primary-500 text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Home
          </NuxtLink>
          <NuxtLink to="/about"
            class="border-transparent text-gray-300 hover:bg-navy-700 hover:border-primary-400 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            About
          </NuxtLink>
          <NuxtLink to="/contact"
            class="border-transparent text-gray-300 hover:bg-navy-700 hover:border-primary-400 hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Contact
          </NuxtLink>
        </div>
        <div class="pt-4 pb-3 border-t border-navy-700">
          <div class="flex items-center px-4">
            <NuxtLink to="/auth/login"
              class="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-navy-700">
              Sign In
            </NuxtLink>
            <NuxtLink to="/auth/register"
              class="ml-4 block px-4 py-2 text-base font-medium text-white bg-primary-500 hover:bg-primary-400 rounded-md">
              Register
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-navy-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div class="w-full flex flex-col items-center justify-center">
          <h3 class="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <ul class="space-y-2 text-gray-300 text-center">
            <li>Email: admin@mucholinktrucking.com</li>
            <li>Phone: +263785653669</li>
          </ul>
        </div>
        <div class="mt-8 border-t border-navy-700 pt-8 w-full">
          <p class="text-center text-gray-300">
            &copy; {{ new Date().getFullYear() }} TruckX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script>