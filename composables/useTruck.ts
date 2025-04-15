import { ref } from 'vue'

interface Truck {
    id: string
    make: string
    model: string
    year: number
    capacity: number
    licensePlate: string
    images: string[]
    specifications: Record<string, any>
    isAvailable: boolean
}

export const useTruck = () => {
    const trucks = ref<Truck[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchTrucks = async () => {
        try {
            loading.value = true
            error.value = null

            const { data, error: fetchError } = await useFetch('/api/trucks', {
                query: {
                    providerId: 'current'
                }
            })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'Failed to fetch trucks')
            }

            if (data.value) {
                trucks.value = data.value.trucks.map((truck: any) => ({
                    id: truck.id,
                    make: truck.make,
                    model: truck.model,
                    year: truck.year,
                    capacity: truck.capacity,
                    licensePlate: truck.licensePlate,
                    images: truck.images || [],
                    specifications: truck.specifications || {},
                    isAvailable: truck.specifications?.availability === 'AVAILABLE'
                }))
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to load trucks'
            console.error('Error fetching trucks:', err)
        } finally {
            loading.value = false
        }
    }

    const addTruck = async (truckData: Omit<Truck, 'id'>) => {
        try {
            loading.value = true
            error.value = null

            const { data, error: fetchError } = await useFetch('/api/trucks', {
                method: 'POST',
                body: {
                    make: truckData.make,
                    model: truckData.model,
                    year: truckData.year,
                    capacity: truckData.capacity,
                    licensePlate: truckData.licensePlate,
                    images: truckData.images,
                    specifications: truckData.specifications
                }
            })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'Failed to add truck')
            }

            if (data.value && data.value.truck) {
                const newTruck = {
                    id: data.value.truck.id,
                    make: data.value.truck.make,
                    model: data.value.truck.model,
                    year: data.value.truck.year,
                    capacity: data.value.truck.capacity,
                    licensePlate: data.value.truck.licensePlate,
                    images: data.value.truck.images || [],
                    specifications: data.value.truck.specifications || {},
                    isAvailable: data.value.truck.specifications?.availability === 'AVAILABLE'
                }
                trucks.value.push(newTruck)
                return newTruck
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to add truck'
            console.error('Error adding truck:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateTruck = async (id: string, truckData: Partial<Truck>) => {
        try {
            loading.value = true
            error.value = null

            const { data, error: fetchError } = await useFetch(`/api/trucks/${id}`, {
                method: 'PUT',
                body: {
                    make: truckData.make,
                    model: truckData.model,
                    year: truckData.year,
                    capacity: truckData.capacity,
                    licensePlate: truckData.licensePlate,
                    images: truckData.images,
                    specifications: truckData.specifications
                }
            })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'Failed to update truck')
            }

            if (data.value && data.value.truck) {
                const updatedTruck = {
                    id: data.value.truck.id,
                    make: data.value.truck.make,
                    model: data.value.truck.model,
                    year: data.value.truck.year,
                    capacity: data.value.truck.capacity,
                    licensePlate: data.value.truck.licensePlate,
                    images: data.value.truck.images || [],
                    specifications: data.value.truck.specifications || {},
                    isAvailable: data.value.truck.specifications?.availability === 'AVAILABLE'
                }
                const index = trucks.value.findIndex(t => t.id === id)
                if (index !== -1) {
                    trucks.value[index] = updatedTruck
                }
                return updatedTruck
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to update truck'
            console.error('Error updating truck:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteTruck = async (id: string) => {
        try {
            loading.value = true
            error.value = null

            const { error: fetchError } = await useFetch(`/api/trucks/${id}`, {
                method: 'DELETE'
            })

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'Failed to delete truck')
            }

            trucks.value = trucks.value.filter(t => t.id !== id)
        } catch (err: any) {
            error.value = err.message || 'Failed to delete truck'
            console.error('Error deleting truck:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const uploadTruckImages = async (truckId: string, images: File[]) => {
        try {
            loading.value = true
            error.value = null
            const formData = new FormData()
            images.forEach(image => {
                formData.append('images', image)
            })
            // TODO: Replace with actual API call
            const response = await fetch(`/api/trucks/${truckId}/images`, {
                method: 'POST',
                body: formData,
            })
            if (!response.ok) throw new Error('Failed to upload images')
            const { imageUrls } = await response.json()
            const truck = trucks.value.find(t => t.id === truckId)
            if (truck) {
                truck.images = [...truck.images, ...imageUrls]
            }
            return imageUrls
        } catch (err) {
            error.value = 'Failed to upload images'
            console.error('Error uploading images:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        trucks,
        loading,
        error,
        fetchTrucks,
        addTruck,
        updateTruck,
        deleteTruck,
        uploadTruckImages,
    }
} 