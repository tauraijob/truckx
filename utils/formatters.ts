export function getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'PROCESSING': 'bg-blue-100 text-blue-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'FAILED': 'bg-red-100 text-red-800',
        'CANCELED': 'bg-gray-100 text-gray-800',
        'REFUNDED': 'bg-purple-100 text-purple-800'
    }

    return statusMap[status] || 'bg-gray-100 text-gray-800'
}

export function formatCurrency(value: number | undefined | null): string {
    // Handle undefined or null values
    if (value === undefined || value === null) {
        return '0.00'
    }

    // Format as USD with 2 decimal places
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

export function formatDate(dateString: string): string {
    if (!dateString) return 'N/A'

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date'

    // Format as MM/DD/YYYY
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
} 