import { Chart, ChartConfiguration, ChartData } from 'chart.js'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { cloneData } from '~/utils'

export function useChart(
    canvas: HTMLCanvasElement | null,
    data: ChartData | null,
    options: ChartConfiguration
) {
    const chart = ref<Chart | null>(null)

    const renderChart = () => {
        if (!canvas) return

        // Destroy existing chart if it exists
        if (chart.value) {
            chart.value.destroy()
            chart.value = null
        }

        // Check if data is valid
        if (!data || !data.datasets || data.datasets.length === 0) {
            console.warn('Invalid chart data provided')
            return
        }

        try {
            // Create new chart with cloned data to prevent reference issues
            chart.value = new Chart(canvas, {
                type: options.type,
                data: cloneData(data),
                options: options.options
            })
        } catch (error) {
            console.error('Error rendering chart:', error)
        }
    }

    // Watch for data changes
    watch(
        () => data,
        (newData) => {
            if (newData) {
                renderChart()
            }
        },
        { deep: true }
    )

    // Initialize chart on mount
    onMounted(() => {
        if (data) {
            renderChart()
        }
    })

    // Cleanup on unmount
    onUnmounted(() => {
        if (chart.value) {
            chart.value.destroy()
            chart.value = null
        }
    })

    return {
        chart
    }
} 