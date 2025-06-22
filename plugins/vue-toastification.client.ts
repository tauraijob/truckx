// plugins/vue-toastification.client.ts
import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
    // register the plugin on the Vue app
    nuxtApp.vueApp.use(Toast as any /* CJS workaround */, {
        // your options here, e.g.
        position: 'top-right',
        timeout: 3000,
    } as PluginOptions)
})
