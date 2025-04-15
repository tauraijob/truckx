import { ref } from 'vue'

interface ToastOptions {
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
}

interface Toast extends ToastOptions {
    id: number
    visible: boolean
}

// Create a single instance that can be reused across the app
const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
    const show = (options: ToastOptions) => {
        const toast: Toast = {
            id: ++toastId,
            message: options.message,
            type: options.type,
            duration: options.duration || 3000,
            visible: true
        }

        toasts.value.push(toast)

        // Auto-hide the toast after duration
        setTimeout(() => {
            hide(toast.id)
        }, toast.duration)

        return toast.id
    }

    const hide = (id: number) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index !== -1) {
            toasts.value[index].visible = false

            // Remove from array after animation completes
            setTimeout(() => {
                toasts.value = toasts.value.filter(t => t.id !== id)
            }, 300)
        }
    }

    // Convenience methods
    const success = (message: string, duration?: number) => show({ message, type: 'success', duration })
    const error = (message: string, duration?: number) => show({ message, type: 'error', duration })
    const warning = (message: string, duration?: number) => show({ message, type: 'warning', duration })
    const info = (message: string, duration?: number) => show({ message, type: 'info', duration })

    return {
        toasts,
        show,
        hide,
        success,
        error,
        warning,
        info
    }
} 