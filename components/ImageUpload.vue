<template>
  <div class="image-upload-container">
    <!-- Featured Image Upload -->
    <div v-if="mode === 'featured'" class="featured-image-upload">
      <div 
        class="upload-area relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        :class="{'border-primary-500 bg-primary-50': isDraggingFeatured}"
        @click="triggerFeaturedFileInput"
        @dragover.prevent="isDraggingFeatured = true"
        @dragleave.prevent="isDraggingFeatured = false"
        @drop.prevent="handleFeaturedDrop"
      >
        <div v-if="!featuredImage" class="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-600 mb-1">Upload a featured image</p>
          <p class="text-xs text-gray-500">Drag and drop, or click to select</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>
        
        <div v-else class="w-full h-full">
          <img :src="featuredPreview" alt="Featured image preview" class="max-h-40 mx-auto object-contain" />
          <button 
            @click.stop="removeFeaturedImage" 
            class="mt-2 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </button>
        </div>
        
        <input 
          ref="featuredFileInput"
          type="file" 
          class="hidden" 
          accept="image/png, image/jpeg, image/webp" 
          @change="handleFeaturedFileChange"
        />
      </div>
      
      <p v-if="featuredError" class="mt-1 text-sm text-red-600">{{ featuredError }}</p>
    </div>

    <!-- Gallery Upload -->
    <div v-else-if="mode === 'gallery'" class="gallery-upload">
      <div 
        class="upload-area relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        :class="{'border-primary-500 bg-primary-50': isDraggingGallery}"
        @click="triggerGalleryFileInput"
        @dragover.prevent="isDraggingGallery = true"
        @dragleave.prevent="isDraggingGallery = false"
        @drop.prevent="handleGalleryDrop"
      >
        <div class="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-gray-600 mb-1">Add photos to gallery</p>
          <p class="text-xs text-gray-500">Drag and drop, or click to select</p>
          <p class="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each (max 8 images)</p>
        </div>

        <input 
          ref="galleryFileInput"
          type="file" 
          class="hidden" 
          accept="image/png, image/jpeg, image/webp" 
          multiple
          @change="handleGalleryFileChange"
        />
      </div>
      
      <!-- Gallery Previews -->
      <div v-if="galleryImages.length > 0" class="mt-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="(image, index) in galleryImages" :key="index" class="relative group">
            <img :src="galleryPreviews[index]" alt="Gallery image preview" class="h-32 w-full object-cover rounded-lg" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <button 
                @click="removeGalleryImage(index)" 
                class="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full p-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p v-if="galleryError" class="mt-1 text-sm text-red-600">{{ galleryError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'featured',
    validator: (value: string) => ['featured', 'gallery'].includes(value)
  },
  initialImages: {
    type: Array,
    default: () => []
  },
  maxGalleryImages: {
    type: Number,
    default: 8
  }
})

const emit = defineEmits(['update:featured', 'update:gallery', 'error'])

// Featured image upload refs
const featuredFileInput = ref<HTMLInputElement | null>(null)
const featuredImage = ref<File | null>(null)
const featuredPreview = ref<string>('')
const featuredError = ref<string>('')
const isDraggingFeatured = ref<boolean>(false)

// Gallery upload refs
const galleryFileInput = ref<HTMLInputElement | null>(null)
const galleryImages = ref<File[]>([])
const galleryPreviews = ref<string[]>([])
const galleryError = ref<string>('')
const isDraggingGallery = ref<boolean>(false)

// Initialize with initial images if provided
watch(() => props.initialImages, (newImages) => {
  if (newImages && newImages.length > 0) {
    if (props.mode === 'featured' && newImages[0]) {
      // For featured mode, use the first image as featured
      fetchAndCreateFile(newImages[0]).then(file => {
        if (file) {
          featuredImage.value = file
          createFeaturedPreview(file)
        }
      })
    } else if (props.mode === 'gallery') {
      // For gallery mode, use all images
      Promise.all(newImages.map(url => fetchAndCreateFile(url))).then(files => {
        galleryImages.value = files.filter(Boolean) as File[]
        createGalleryPreviews()
      })
    }
  }
}, { immediate: true })

// Helper to fetch a URL and create a File object
async function fetchAndCreateFile(url: string): Promise<File | null> {
  try {
    // If the url starts with /uploads/, convert to /api/uploads/
    if (url.startsWith('/uploads/')) {
      url = url.replace('/uploads/', '/api/uploads/');
    }
    const response = await fetch(url)
    const blob = await response.blob()
    const filename = url.split('/').pop() || 'image.jpg'
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

// Helper to upload a file to /api/uploads and return the uploaded URL
async function uploadFileToUploads(file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch('/api/uploads', {
    method: 'POST',
    body: formData
  })
  if (!response.ok) throw new Error('Failed to upload image')
  const data = await response.json()
  return data.url // Should be /uploads/filename.ext
}

// Featured image handlers
function triggerFeaturedFileInput() {
  featuredFileInput.value?.click()
}

async function handleFeaturedFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    validateAndSetFeaturedImage(input.files[0])
    try {
      const url = await uploadFileToUploads(input.files[0])
      emit('update:featured', url)
    } catch (e) {
      featuredError.value = 'Failed to upload image.'
      emit('error', featuredError.value)
    }
  }
}

function handleFeaturedDrop(event: DragEvent) {
  isDraggingFeatured.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    validateAndSetFeaturedImage(event.dataTransfer.files[0])
  }
}

function validateAndSetFeaturedImage(file: File) {
  featuredError.value = ''
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    featuredError.value = 'Invalid file type. Please use PNG, JPG, or WEBP.'
    emit('error', featuredError.value)
    return
  }
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    featuredError.value = 'File too large. Maximum size is 5MB.'
    emit('error', featuredError.value)
    return
  }
  
  featuredImage.value = file
  createFeaturedPreview(file)
  emit('update:featured', file)
}

function createFeaturedPreview(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    featuredPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function removeFeaturedImage() {
  featuredImage.value = null
  featuredPreview.value = ''
  featuredError.value = ''
  emit('update:featured', null)
}

// Gallery image handlers
function triggerGalleryFileInput() {
  galleryFileInput.value?.click()
}

async function handleGalleryFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    validateAndAddGalleryImages(Array.from(input.files))
    try {
      const urls = []
      for (const file of input.files) {
        urls.push(await uploadFileToUploads(file))
      }
      emit('update:gallery', urls)
    } catch (e) {
      galleryError.value = 'Failed to upload one or more images.'
      emit('error', galleryError.value)
    }
  }
}

function handleGalleryDrop(event: DragEvent) {
  isDraggingGallery.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    validateAndAddGalleryImages(Array.from(event.dataTransfer.files))
  }
}

function validateAndAddGalleryImages(files: File[]) {
  galleryError.value = ''
  
  // Check if adding these files would exceed the max
  if (galleryImages.value.length + files.length > props.maxGalleryImages) {
    galleryError.value = `You can only upload up to ${props.maxGalleryImages} images.`
    emit('error', galleryError.value)
    return
  }
  
  // Validate each file
  const validFiles: File[] = []
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  for (const file of files) {
    if (!validTypes.includes(file.type)) {
      galleryError.value = 'Some files were skipped. Only PNG, JPG, or WEBP are allowed.'
      continue
    }
    
    if (file.size > maxSize) {
      galleryError.value = 'Some files were skipped. Maximum size per file is 5MB.'
      continue
    }
    
    validFiles.push(file)
  }
  
  if (validFiles.length > 0) {
    galleryImages.value = [...galleryImages.value, ...validFiles]
    createGalleryPreviews()
    emit('update:gallery', galleryImages.value)
  }
}

function createGalleryPreviews() {
  galleryPreviews.value = []
  
  galleryImages.value.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      galleryPreviews.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

function removeGalleryImage(index: number) {
  galleryImages.value.splice(index, 1)
  galleryPreviews.value.splice(index, 1)
  galleryError.value = ''
  emit('update:gallery', galleryImages.value)
}

// Expose methods and data
defineExpose({
  featuredImage,
  galleryImages,
  resetFeatured: removeFeaturedImage,
  resetGallery: () => {
    galleryImages.value = []
    galleryPreviews.value = []
    galleryError.value = ''
    emit('update:gallery', [])
  }
})
</script> 