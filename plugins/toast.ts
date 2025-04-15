import { defineNuxtPlugin } from '#app'
import Toast from '~/components/ui/Toast.vue'

export default defineNuxtPlugin((nuxtApp) => {
    // Register the Toast component globally
    nuxtApp.vueApp.component('Toast', Toast)
}) 