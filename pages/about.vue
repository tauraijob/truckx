<template>
  <div class="bg-white">
    <!-- Hero Section with Slideshow -->
    <div class="relative bg-[#004599] overflow-hidden">
      <!-- Slideshow Background -->
      <div class="absolute inset-0 z-0">
        <div class="relative h-full">
          <div v-for="(slide, index) in slides" :key="index"
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }">
            <img :src="slide.image" :alt="slide.alt" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-[#003377] bg-opacity-70"></div>
          </div>
        </div>
      </div>

      <!-- Slideshow Controls -->
      <div class="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-2">
        <button v-for="(slide, index) in slides" :key="index" @click="currentSlide = index"
          class="w-3 h-3 rounded-full transition-colors duration-300"
          :class="currentSlide === index ? 'bg-[#004599]' : 'bg-white bg-opacity-50'" aria-label="Go to slide"></button>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span class="block">About</span>
                <span class="block text-[#004599]/80">TruckX</span>
              </h1>
              <p
                class="mt-3 text-base text-navy-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                TruckX is revolutionizing the logistics industry by connecting truck providers with load providers in a seamless marketplace.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <NuxtLink to="/auth/register"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#004599] hover:bg-[#003377] md:py-4 md:text-lg md:px-10">
                    Get Started
                  </NuxtLink>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <NuxtLink to="/contact"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#003377] hover:bg-[#002855] md:py-4 md:text-lg md:px-10">
                    Contact Us
                  </NuxtLink>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-navy-900 sm:text-4xl sm:tracking-tight lg:text-5xl">Our Mission</h2>
        <p class="mt-5 max-w-xl mx-auto text-xl text-navy-500">
          Connecting truck providers with load providers in a seamless marketplace.
        </p>
      </div>

      <div class="mt-16">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div class="pt-6">
            <div class="flow-root bg-navy-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-navy-900 tracking-tight">Fast & Efficient</h3>
                <p class="mt-5 text-base text-navy-500">
                  Our platform connects truck providers with load providers quickly and efficiently, reducing empty miles and maximizing revenue.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flow-root bg-navy-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-navy-900 tracking-tight">Secure & Reliable</h3>
                <p class="mt-5 text-base text-navy-500">
                  We prioritize security and reliability, ensuring that all transactions are protected and verified.
                </p>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flow-root bg-navy-50 rounded-lg px-6 pb-8">
              <div class="-mt-6">
                <div>
                  <span class="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                </div>
                <h3 class="mt-8 text-lg font-medium text-navy-900 tracking-tight">Community Driven</h3>
                <p class="mt-5 text-base text-navy-500">
                  Our platform is built for the trucking community, with features designed to meet the real needs of truck and load providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <div class="bg-navy-50 rounded-lg px-6 py-8 sm:p-10 lg:flex lg:items-center">
          <div class="lg:w-0 lg:flex-1">
            <h2 class="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              Ready to get started?
            </h2>
            <p class="mt-4 max-w-3xl text-lg text-navy-500">
              Join our platform today and start connecting with truck providers or load providers.
            </p>
          </div>
          <div class="mt-8 lg:mt-0 lg:ml-8">
            <div class="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
              <NuxtLink to="/auth/register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                Get started
              </NuxtLink>
              <NuxtLink to="/contact" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200">
                Contact us
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  layout: 'default'
})

// Define slides
const slides = [
  {
    image: '/images/truckx-slide.webp',
    alt: 'Truck on the road'
  },
  {
    image: '/images/truckx-slide2.jpg',
    alt: 'Logistics warehouse'
  },
  {
    image: '/images/truckx-slide3.jpg',
    alt: 'Cargo loading'
  }
]

const currentSlide = ref(0)
let slideInterval

// Function to change slides
const changeSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

// Set up interval on mount
onMounted(() => {
  slideInterval = setInterval(changeSlide, 5000)
})

// Clear interval before unmount
onBeforeUnmount(() => {
  clearInterval(slideInterval)
})
</script> 