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
                <span class="block">Contact</span>
                <span class="block text-[#004599]/80">Us</span>
              </h1>
              <p class="mt-3 text-base text-navy-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Have questions about our platform? We're here to help. Send us a message and we'll respond as soon as possible.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#contact-form" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#004599] hover:bg-[#003377] md:py-4 md:text-lg md:px-10">
                    Send a message
                  </a>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <a href="tel:+15551234567" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#003377] hover:bg-[#002855] md:py-4 md:text-lg md:px-10">
                    Call us
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8" id="contact-form">
      <div class="max-w-lg mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-8">
        <div>
          <h2 class="text-2xl font-extrabold text-navy-900 sm:text-3xl sm:tracking-tight">
            Get in touch
          </h2>
          <div class="mt-3">
            <p class="text-lg text-navy-500">
              Have questions about our platform? We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div class="mt-9">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-navy-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div class="ml-3 text-base text-navy-500">
                <p>
                  +1 (555) 123-4567
                </p>
                <p class="mt-1">
                  Mon-Fri 8am to 6pm PST
                </p>
              </div>
            </div>
            <div class="mt-6 flex">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-navy-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-3 text-base text-navy-500">
                <p>
                  support@truckx.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 sm:mt-16 md:mt-0">
          <h2 class="text-2xl font-extrabold text-navy-900 sm:text-3xl sm:tracking-tight">
            Send us a message
          </h2>
          <div class="mt-9">
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-navy-700">Name</label>
                <div class="mt-1">
                  <input type="text" name="name" id="name" v-model="form.name" autocomplete="name" required
                    class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-navy-300 rounded-md">
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-navy-700">Email</label>
                <div class="mt-1">
                  <input id="email" name="email" type="email" v-model="form.email" autocomplete="email" required
                    class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-navy-300 rounded-md">
                </div>
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-navy-700">Phone</label>
                <div class="mt-1">
                  <input type="text" name="phone" id="phone" v-model="form.phone" autocomplete="tel"
                    class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-navy-300 rounded-md">
                </div>
              </div>
              <div>
                <label for="message" class="block text-sm font-medium text-navy-700">Message</label>
                <div class="mt-1">
                  <textarea id="message" name="message" v-model="form.message" rows="4" required
                    class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-navy-300 rounded-md"></textarea>
                </div>
              </div>
              <div>
                <button type="submit" :disabled="loading"
                  class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span v-if="loading">Sending...</span>
                  <span v-else>Send message</span>
                </button>
              </div>
              <div v-if="success" class="mt-2 text-sm text-green-600">
                Your message has been sent successfully. We'll get back to you soon.
              </div>
              <div v-if="error" class="mt-2 text-sm text-red-600">
                {{ error }}
              </div>
            </form>
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

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    // In a real application, you would send this to your API
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
    
    success.value = true
  } catch (err) {
    error.value = 'Failed to send message. Please try again.'
  } finally {
    loading.value = false
  }
}
</script> 