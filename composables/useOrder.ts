import { ref } from 'vue'

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

interface Order {
    id: string
    loadId: string
    truckId: string
    loadProviderId: string
    truckProviderId: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
    price: number
    notes?: string
    acceptedAt?: string
    startedAt?: string
    completedAt?: string
    createdAt: string
    updatedAt: string
    load: Load
    truck: Truck
    loadProvider: UserInfo
    truckProvider: UserInfo
}

export const useOrder = () => {
    const orders = ref<Order[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchOrders = async () => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch('/api/orders')
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to fetch orders')
            }

            const data = await response.json()
            orders.value = data.orders || []

            return data
        } catch (err: any) {
            error.value = err.message || 'Failed to load orders'
            console.error('Error fetching orders:', err)
            orders.value = [] // Ensure we clear any mock data
        } finally {
            loading.value = false
        }
    }

    const createOrder = async (orderData: { loadId: string, truckId: string, price: number, notes?: string }) => {
        try {
            loading.value = true
            error.value = null

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to create order')
            }

            const data = await response.json()
            // Refresh orders list after creating a new one
            await fetchOrders()

            return data.order
        } catch (err: any) {
            error.value = err.message || 'Failed to create order'
            console.error('Error creating order:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
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