<template>
  <div>
    <!-- Hero Section with Slideshow -->
    <div class="relative bg-gradient-to-br from-[#004080] to-[#001a33] overflow-hidden">
      <!-- Slideshow Background -->
      <div class="absolute inset-0 z-0">
        <div class="relative h-full">
          <div v-for="(slide, index) in slides" :key="index"
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }">
            <img :src="slide.image" :alt="slide.alt" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-[#004080]/85 to-[#001a33]/70"></div>
          </div>
        </div>
      </div>

      <!-- Slideshow Controls -->
      <div class="absolute bottom-6 left-0 right-0 z-10 flex justify-center space-x-3">
        <button v-for="(slide, index) in slides" :key="index" @click="currentSlide = index"
          class="w-3 h-3 rounded-full transition-colors duration-300"
          :class="currentSlide === index ? 'bg-white' : 'bg-white/40'" 
          aria-label="Go to slide"></button>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="relative z-10 py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div class="text-center sm:text-center lg:text-left max-w-lg lg:max-w-xl">
            <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span class="block">Streamlined</span>
              <span class="block text-[#4dabf7]">Logistics Solutions</span>
            </h1>
            <p class="mt-4 text-xl text-gray-200 max-w-md mx-auto lg:mx-0">
              Connect with reliable truck providers and load providers in our marketplace. Fast, secure, and efficient
              logistics management.
            </p>
            <div class="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
              <div>
                <NuxtLink to="/auth/register"
                  class="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-[#0070f3] hover:bg-[#0060df] transition-colors shadow-lg shadow-[#0070f3]/20 md:py-4 md:text-lg md:px-10">
                  Get Started
                </NuxtLink>
              </div>
              <div class="mt-3 sm:mt-0">
                <NuxtLink to="/auth/login"
                  class="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-transparent border-2 border-white/30 hover:bg-white/10 transition-colors md:py-4 md:text-lg md:px-10">
                  Sign In
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-[#0070f3] font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to manage logistics
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Our platform connects truck providers with load providers, making logistics management simple and efficient.
          </p>
        </div>

        <div class="mt-16">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-12">
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white shadow-lg">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Easy Matching</h3>
                <p class="mt-2 text-base text-gray-500">
                  Find the perfect match between trucks and loads with our intelligent matching system.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white shadow-lg">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Secure Payments</h3>
                <p class="mt-2 text-base text-gray-500">
                  Handle payments securely with our integrated payment system.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white shadow-lg">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Verified Partners</h3>
                <p class="mt-2 text-base text-gray-500">
                  Work with verified truck and load providers for peace of mind.
                </p>
              </div>
            </div>

            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#0070f3] text-white shadow-lg">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Real-time Tracking</h3>
                <p class="mt-2 text-base text-gray-500">
                  Track your shipments in real-time with our advanced tracking system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Trucks Section -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-[#0070f3] font-semibold tracking-wide uppercase">Available Trucks</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find the right truck for your load
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our selection of available trucks from verified providers.
          </p>
        </div>
        <div class="mt-12">
          <div v-if="isLoadingTrucks" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="bg-white overflow-hidden shadow-lg rounded-xl transition-all">
              <div class="animate-pulse">
                <div class="relative h-52 bg-gray-200"></div>
                <div class="p-6">
                  <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div class="mt-4 space-y-4">
                    <div class="flex items-center">
                      <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                      <div class="h-4 bg-gray-200 rounded w-2/5"></div>
                    </div>
                    <div class="flex items-center">
                      <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                      <div class="h-4 bg-gray-200 rounded w-3/5"></div>
                    </div>
                  </div>
                  <div class="mt-4 flex">
                    <div class="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="truckError" class="text-center py-8">
            <p class="text-red-500">{{ truckError }}</p>
            <button @click="fetchTrucks" class="mt-4 px-4 py-2 bg-[#0070f3] text-white rounded hover:bg-[#0050b3]">
              Try Again
            </button>
          </div>

          <div v-else-if="trucks.length === 0" class="text-center py-8">
            <p class="text-gray-500">No available trucks found at the moment.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="truck in trucks" :key="truck.id" class="bg-white overflow-hidden shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div class="relative h-52">
                <img :src="truck.imageUrl" :alt="truck.name" class="w-full h-full object-cover" />
                <div class="absolute top-4 right-4 bg-[#0070f3] text-white text-xs font-bold px-2 py-1 rounded-full">
                  Available Now
                </div>
              </div>
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900">{{ truck.name }}</h3>
                <div class="mt-2 flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>Capacity: {{ truck.capacity }} {{ truck.capacityUnit }}</span>
                </div>
                <div class="mt-2 flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Location: {{ truck.location }}</span>
                </div>
                <div class="mt-4">
                  <button 
                    class="inline-flex items-center text-[#0070f3] hover:text-[#0050b3] font-medium"
                    @click="openTruckModal(truck)"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 text-center">
            <NuxtLink to="/auth/login?redirect=/dashboard/available-trucks"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-[#0070f3] hover:bg-[#0050b3] transition-colors">
              View All Available Trucks
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Loads Section -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-[#0070f3] font-semibold tracking-wide uppercase">Available Loads</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find loads for your trucks
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Browse our selection of available loads from verified providers.
          </p>
        </div>
        <div class="mt-12">
          <div v-if="isLoadingLoads" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all p-6">
              <div class="animate-pulse">
                <div class="flex justify-between">
                  <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div class="h-6 bg-blue-100 rounded-full w-20"></div>
                </div>
                <div class="mt-4 space-y-4">
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-2/5"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-3/5"></div>
                  </div>
                  <div class="flex items-center">
                    <div class="h-5 w-5 mr-2 rounded-full bg-gray-200"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                  <div class="h-6 bg-blue-100 rounded w-20"></div>
                  <div class="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="loadError" class="text-center py-8">
            <p class="text-red-500">{{ loadError }}</p>
            <button @click="fetchLoads" class="mt-4 px-4 py-2 bg-[#0070f3] text-white rounded hover:bg-[#0050b3]">
              Try Again
            </button>
          </div>

          <div v-else-if="loads.length === 0" class="text-center py-8">
            <p class="text-gray-500">No available loads found at the moment.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="load in loads" :key="load.id" class="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div class="p-6">
                <div class="flex justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">{{ load.name }}</h3>
                  <span class="bg-blue-100 text-[#0070f3] text-xs px-2 py-1 rounded-full font-medium flex items-center">
                    {{ load.status }}
                  </span>
                </div>
                <div class="mt-4 space-y-2">
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span>Weight: {{ load.weight }} {{ load.weightUnit }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Pickup: {{ formatDate(load.pickupDate) }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>From: {{ load.origin }}</span>
                  </div>
                  <div class="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>To: {{ load.destination }}</span>
                  </div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                  <p class="text-[#0070f3] font-semibold text-lg">${{ formatPrice(load.price) }}</p>
                  <button 
                    class="inline-flex items-center text-[#0070f3] hover:text-[#0050b3] font-medium"
                    @click="openLoadModal(load)"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-12 text-center">
            <NuxtLink to="/auth/login?redirect=/dashboard/available-loads"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-[#0070f3] hover:bg-[#0050b3] transition-colors">
              View All Available Loads
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-[#0070f3] font-semibold tracking-wide uppercase">Testimonials</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by logistics professionals
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Hear what our users have to say about their experience with our platform
          </p>
        </div>
        <div class="mt-12">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div class="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl relative">
              <!-- Quote mark -->
              <div class="absolute top-6 right-8 text-[#0070f3]/10">
                <svg class="h-16 w-16" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <div class="mb-6">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-[#0070f3]/10 flex items-center justify-center text-[#0070f3] font-bold">
                    JD
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-900">John Doe</h4>
                    <p class="text-[#0070f3]">Truck Provider</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between space-y-4">
                <p class="text-gray-600">
                  "This platform has completely transformed my business. I've found consistent work and reliable clients. The user interface is intuitive and the support team is always helpful."
                </p>
                <div class="flex items-center text-[#0070f3]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl relative">
              <!-- Quote mark -->
              <div class="absolute top-6 right-8 text-[#0070f3]/10">
                <svg class="h-16 w-16" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <div class="mb-6">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-[#0070f3]/10 flex items-center justify-center text-[#0070f3] font-bold">
                    AS
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-900">Alice Smith</h4>
                    <p class="text-[#0070f3]">Load Provider</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between space-y-4">
                <p class="text-gray-600">
                  "Finding reliable trucks has never been easier. The platform is intuitive and the service is excellent. I've been able to save time and money by efficiently connecting with the right carriers."
                </p>
                <div class="flex items-center text-[#0070f3]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl relative">
              <!-- Quote mark -->
              <div class="absolute top-6 right-8 text-[#0070f3]/10">
                <svg class="h-16 w-16" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <div class="mb-6">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-[#0070f3]/10 flex items-center justify-center text-[#0070f3] font-bold">
                    AS
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-900">Alice Smith</h4>
                    <p class="text-[#0070f3]">Load Provider</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between space-y-4">
                <p class="text-gray-600">
                  "Finding reliable trucks has never been easier. The platform is intuitive and the service is excellent."
                </p>
                <div class="flex items-center text-[#0070f3]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-br from-[#0070f3] to-[#0050b3]">
      <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block text-blue-100">Join our platform today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
          <div class="inline-flex rounded-md shadow">
            <NuxtLink to="/auth/register"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#0070f3] bg-white hover:bg-gray-100 transition-colors">
              Get started
            </NuxtLink>
          </div>
          <div class="inline-flex rounded-md shadow">
            <NuxtLink to="/auth/login"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0050b3] hover:bg-[#004099] transition-colors">
              Sign in
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Truck Detail Modal -->
    <Modal v-model="showTruckModal" title="Truck Details" :show-primary-button="false" secondary-button-text="Close">
      <TruckDetailModal :truck="selectedTruck" />
    </Modal>
    
    <!-- Load Detail Modal -->
    <Modal v-model="showLoadModal" title="Load Details" :show-primary-button="false" secondary-button-text="Close">
      <LoadDetailModal :load="selectedLoad" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Modal from '~/components/Modal.vue'
import TruckDetailModal from '~/components/TruckDetailModal.vue'
import LoadDetailModal from '~/components/LoadDetailModal.vue'

// Slideshow data
const slides = [
  { image: '/images/truckx-slide.webp', alt: 'Truck on the highway' },
  { image: '/images/truckx-slide2.jpg', alt: 'Logistics warehouse' },
  { image: '/images/truckx-slide3.jpg', alt: 'Delivery truck' }
]

const currentSlide = ref(0)
let slideshowInterval: NodeJS.Timeout | null = null

// Auto-advance slideshow
const startSlideshow = () => {
  slideshowInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000) // Change slide every 5 seconds
}

// Clean up interval on component unmount
onMounted(() => {
  startSlideshow()
  fetchLoads()
  fetchTrucks()
})

onUnmounted(() => {
  if (slideshowInterval) {
    clearInterval(slideshowInterval)
  }
})

// Load data management
const loads = ref<any[]>([])
const isLoadingLoads = ref(true)
const loadError = ref<string | null>(null)

const fetchLoads = async () => {
  isLoadingLoads.value = true
  loadError.value = null
  
  try {
    const response = await fetch('/api/public/loads?limit=3')
    
    if (!response.ok) {
      throw new Error('Failed to fetch loads')
    }
    
    const data = await response.json()
    loads.value = data.loads || []
  } catch (error) {
    console.error('Error fetching loads:', error)
    loadError.value = 'Unable to load data. Please try again later.'
    
    // Fallback to demo data if in development
    if (process.env.NODE_ENV === 'development') {
      loads.value = [
        {
          id: 'demo1',
          name: 'Electronics Shipment',
          status: 'Available',
          weight: 5,
          weightUnit: 'tons',
          pickupDate: '2023-02-15',
          origin: 'San Francisco, CA',
          destination: 'Seattle, WA',
          price: 2500
        },
        {
          id: 'demo2',
          name: 'Furniture Delivery',
          status: 'Available',
          weight: 3,
          weightUnit: 'tons',
          pickupDate: '2023-02-18',
          origin: 'Miami, FL',
          destination: 'Atlanta, GA',
          price: 1800
        },
        {
          id: 'demo3',
          name: 'Agricultural Products',
          status: 'Available',
          weight: 12,
          weightUnit: 'tons',
          pickupDate: '2023-02-22',
          origin: 'Dallas, TX',
          destination: 'Houston, TX',
          price: 3200
        }
      ]
    }
  } finally {
    isLoadingLoads.value = false
  }
}

// Truck data management
const trucks = ref<any[]>([])
const isLoadingTrucks = ref(true)
const truckError = ref<string | null>(null)

const fetchTrucks = async () => {
  isLoadingTrucks.value = true
  truckError.value = null
  
  try {
    const response = await fetch('/api/public/trucks?limit=3')
    
    if (!response.ok) {
      throw new Error('Failed to fetch trucks')
    }
    
    const data = await response.json()
    trucks.value = data.trucks || []
  } catch (error) {
    console.error('Error fetching trucks:', error)
    truckError.value = 'Unable to load truck data. Please try again later.'
    
    // Fallback to demo data
    trucks.value = [
      {
        id: 'demo1',
        name: 'Volvo VNL 760',
        make: 'Volvo',
        model: 'VNL 760',
        year: 2023,
        capacity: 40000,
        capacityUnit: 'lbs',
        location: 'Chicago, IL',
        imageUrl: 'https://placehold.co/600x400?text=Volvo+Truck'
      },
      {
        id: 'demo2',
        name: 'Peterbilt 389',
        make: 'Peterbilt',
        model: '389',
        year: 2022,
        capacity: 45000,
        capacityUnit: 'lbs',
        location: 'Dallas, TX',
        imageUrl: 'https://placehold.co/600x400?text=Peterbilt+Truck'
      },
      {
        id: 'demo3',
        name: 'Freightliner Cascadia',
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2023,
        capacity: 42000,
        capacityUnit: 'lbs',
        location: 'Atlanta, GA',
        imageUrl: 'https://placehold.co/600x400?text=Freightliner+Truck'
      }
    ]
  } finally {
    isLoadingTrucks.value = false
  }
}

// Modal handling
const showTruckModal = ref(false)
const showLoadModal = ref(false)
const selectedTruck = ref(null)
const selectedLoad = ref(null)

function openTruckModal(truck: any) {
  selectedTruck.value = truck
  showTruckModal.value = true
}

function openLoadModal(load: any) {
  selectedLoad.value = load
  showLoadModal.value = true
}

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date)
}

const formatPrice = (price: number) => {
  if (!price && price !== 0) return 'N/A'
  return price.toLocaleString('en-US')
}
</script>