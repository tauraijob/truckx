import { ref } from 'vue'

interface Load {
    id: string
    title: string
    description: string
    pickupLocation: string
    deliveryLocation: string
    weight: number
    dimensions: {
        length: number
        width: number
        height: number
    }
    price: number
    status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
    createdAt: string
    updatedAt: string
}

export const useLoad = () => {
    const loads = ref<Load[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchLoads = async () => {
        try {
            loading.value = true
            error.value = null
            // TODO: Replace with actual API call
            const response = await fetch('/api/loads')
            if (!response.ok) throw new Error('Failed to fetch loads')
            loads.value = await response.json()
        } catch (err) {
            error.value = 'Failed to load loads'
            console.error('Error fetching loads:', err)
        } finally {
            loading.value = false
        }
    }

    const addLoad = async (loadData: Omit<Load, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            loading.value = true
            error.value = null
            // TODO: Replace with actual API call
            const response = await fetch('/api/loads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loadData),
            })
            if (!response.ok) throw new Error('Failed to add load')
            const newLoad = await response.json()
            loads.value.push(newLoad)
            return newLoad
        } catch (err) {
            error.value = 'Failed to add load'
            console.error('Error adding load:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateLoad = async (id: string, loadData: Partial<Load>) => {
        try {
            loading.value = true
            error.value = null
            // TODO: Replace with actual API call
            const response = await fetch(`/api/loads/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loadData),
            })
            if (!response.ok) throw new Error('Failed to update load')
            const updatedLoad = await response.json()
            const index = loads.value.findIndex(l => l.id === id)
            if (index !== -1) {
                loads.value[index] = updatedLoad
            }
            return updatedLoad
        } catch (err) {
            error.value = 'Failed to update load'
            console.error('Error updating load:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteLoad = async (id: string) => {
        try {
            loading.value = true
            error.value = null
            // TODO: Replace with actual API call
            const response = await fetch(`/api/loads/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error('Failed to delete load')
            loads.value = loads.value.filter(l => l.id !== id)
        } catch (err) {
            error.value = 'Failed to delete load'
            console.error('Error deleting load:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const assignTruckToLoad = async (loadId: string, truckId: string) => {
        try {
            loading.value = true
            error.value = null
            // TODO: Replace with actual API call
            const response = await fetch(`/api/loads/${loadId}/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ truckId }),
            })
            if (!response.ok) throw new Error('Failed to assign truck to load')
            const updatedLoad = await response.json()
            const index = loads.value.findIndex(l => l.id === loadId)
            if (index !== -1) {
                loads.value[index] = updatedLoad
            }
            return updatedLoad
        } catch (err) {
            error.value = 'Failed to assign truck to load'
            console.error('Error assigning truck to load:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateLoadStatus = async (loadId: string, status: Load['status']) => {
        try {
            loading.value = true
            error.value = null
            // TODO: Replace with actual API call
            const response = await fetch(`/api/loads/${loadId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })
            if (!response.ok) throw new Error('Failed to update load status')
            const updatedLoad = await response.json()
            const index = loads.value.findIndex(l => l.id === loadId)
            if (index !== -1) {
                loads.value[index] = updatedLoad
            }
            return updatedLoad
        } catch (err) {
            error.value = 'Failed to update load status'
            console.error('Error updating load status:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loads,
        loading,
        error,
        fetchLoads,
        addLoad,
        updateLoad,
        deleteLoad,
        assignTruckToLoad,
        updateLoadStatus,
    }
} 