<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          :class="[
            'toast-item shadow-lg rounded-md px-4 py-3 flex items-start gap-3 transition-all',
            getToastClass(toast.type)
          ]"
          v-show="toast.visible"
        >
          <div class="shrink-0">
            <CheckCircleIcon v-if="toast.type === 'success'" class="h-5 w-5" />
            <ExclamationCircleIcon v-else-if="toast.type === 'error'" class="h-5 w-5" />
            <ExclamationTriangleIcon v-else-if="toast.type === 'warning'" class="h-5 w-5" />
            <InformationCircleIcon v-else class="h-5 w-5" />
          </div>
          <div class="flex-1 pr-6">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>
          <button 
            @click="hide(toast.id)" 
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const { toasts, hide } = useToast()

// Style classes for different toast types
const typeClasses = {
  success: 'bg-green-50 text-green-800 border-l-4 border-green-500',
  error: 'bg-red-50 text-red-800 border-l-4 border-red-500',
  warning: 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500',
  info: 'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
}

// Safe getter for toast classes with fallback
function getToastClass(type: string | undefined) {
  if (!type || !typeClasses[type as keyof typeof typeClasses]) {
    return typeClasses.info
  }
  return typeClasses[type as keyof typeof typeClasses]
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 