import { ChartData } from 'chart.js'

/**
 * Safely clones chart data to prevent reference issues
 * @param data The chart data to clone
 * @returns A new chart data object with the same structure
 */
export function cloneData(data: ChartData | null): ChartData {
    if (!data) {
        return {
            labels: [],
            datasets: []
        }
    }

    return {
        labels: data.labels ? [...data.labels] : [],
        datasets: data.datasets ? data.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data ? [...dataset.data] : []
        })) : []
    }
}

/**
 * Safely formats a number as currency
 * @param value The number to format
 * @returns A formatted string with the currency symbol
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value)
}

/**
 * Safely formats a date string
 * @param dateString The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateString: string): string {
    if (!dateString) return ''

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
    }
} 