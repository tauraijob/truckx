import { ref, computed } from 'vue'
import type { Order, OrderStatus } from '~/types'

interface Load {
    id: string
    title: string
    description: string
    pickupLocation: string
    deliveryLocation: string
    weight: number
    isAvailable: boolean
}

interface Truck {
    id: string
    make: string
    model: string
    capacity: number
    licensePlate: string
}

interface UserInfo {
    id: string
    firstName: string
    lastName: string
    email: string
}

interface OrderResponse {
    orders: Order[]
    pagination?: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}

export const useOrder = () => {
    const orders = ref<Order[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchOrders = async (page = 1, status?: OrderStatus) => {
        try {
            loading.value = true
            error.value = null

            const queryParams = new URLSearchParams()
            if (page > 1) queryParams.append('page', page.toString())
            if (status) queryParams.append('status', status)

            const response = await fetch(`/api/orders?${queryParams.toString()}`)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to fetch orders')
            }

            const data = await response.json() as OrderResponse
            orders.value = data.orders

            return data
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch orders'
            console.error('Error fetching orders:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const createOrder = async (loadId: string, truckId: string, price: number, notes?: string) => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loadId, truckId, price, notes }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to create order')
            }

            const data = await response.json()
            orders.value.unshift(data.order)

            return data.order
        } catch (err: any) {
            error.value = err.message || 'Failed to create order'
            console.error('Error creating order:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, notes }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to update order status')
            }

            const data = await response.json()

            // Update the order in the local state
            const index = orders.value.findIndex(o => o.id === orderId)
            if (index !== -1) {
                orders.value[index] = data.order
            }

            return data.order
        } catch (err: any) {
            error.value = err.message || 'Failed to update order status'
            console.error('Error updating order status:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const getOrderById = async (orderId: string) => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch(`/api/orders/${orderId}`)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to fetch order')
            }

            const data = await response.json()
            return data.order
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch order'
            console.error('Error fetching order:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const cancelOrder = async (orderId: string, reason?: string) => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to cancel order')
            }

            const data = await response.json()

            // Update the order in the local state
            const index = orders.value.findIndex(o => o.id === orderId)
            if (index !== -1) {
                orders.value[index] = data.order
            }

            return data.order
        } catch (err: any) {
            error.value = err.message || 'Failed to cancel order'
            console.error('Error cancelling order:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const completeOrder = async (orderId: string, notes?: string) => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch(`/api/orders/${orderId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to complete order')
            }

            const data = await response.json()

            // Update the order in the local state
            const index = orders.value.findIndex(o => o.id === orderId)
            if (index !== -1) {
                orders.value[index] = data.order
            }

            return data.order
        } catch (err: any) {
            error.value = err.message || 'Failed to complete order'
            console.error('Error completing order:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        orders,
        loading,
        error,
        fetchOrders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        cancelOrder,
        completeOrder
    }
} 