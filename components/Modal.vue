<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
        <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="modelValue"
              class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium leading-6 text-gray-900">
                        {{ title }}
                      </h3>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        @click="closeModal"
                      >
                        <span class="sr-only">Close</span>
                        <svg
                          class="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div class="mt-4">
                      <slot></slot>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6" v-if="showFooter">
                <button
                  v-if="showPrimaryButton"
                  type="button"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-[#0070f3] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#0050b3] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  @click="$emit('primary-action')"
                >
                  {{ primaryButtonText }}
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  @click="closeModal"
                >
                  {{ secondaryButtonText }}
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal Title'
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showPrimaryButton: {
    type: Boolean,
    default: true
  },
  primaryButtonText: {
    type: String,
    default: 'Confirm'
  },
  secondaryButtonText: {
    type: String,
    default: 'Close'
  }
})

const emit = defineEmits(['update:modelValue', 'primary-action'])

function closeModal() {
  emit('update:modelValue', false)
}
</script> 