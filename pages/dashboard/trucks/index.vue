<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">My Trucks</h1>
            <button @click="showAddModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add New Truck
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="trucks.length === 0" class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">No trucks added yet</h3>
            <p class="text-gray-500 mb-4">Start by adding your first truck to the platform</p>
            <button @click="showAddModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Your First Truck
            </button>
        </div>

        <!-- Trucks Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="truck in trucks" :key="truck.id" class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="relative h-48">
                    <img :src="truck.images[0] || '/placeholder-truck.jpg'" :alt="truck.make + ' ' + truck.model"
                        class="w-full h-full object-cover" />
                    <div class="absolute top-2 right-2">
                        <span :class="[
                            'px-2 py-1 rounded-full text-sm font-medium',
                            truck.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        ]">
                            {{ truck.isAvailable ? 'Available' : 'Unavailable' }}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        {{ truck.make }} {{ truck.model }}
                    </h3>
                    <p class="text-gray-600 mb-2">Year: {{ truck.year }}</p>
                    <p class="text-gray-600 mb-2">Capacity: {{ truck.capacity }} tons</p>
                    <p class="text-gray-600 mb-4">License: {{ truck.licensePlate }}</p>
                    <div class="flex justify-between items-center">
                        <button @click="openViewModal(truck)" class="text-blue-600 hover:text-blue-800 font-medium">
                            View
                        </button>
                        <button @click="editTruck(truck)" class="text-blue-600 hover:text-blue-800 font-medium">
                            Edit
                        </button>
                        <button @click="handleDelete(truck.id)" class="text-red-600 hover:text-red-800 font-medium">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Truck Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    {{ editingTruck ? 'Edit Truck' : 'Add New Truck' }}
                </h2>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Make
                            </label>
                            <input v-model="formData.make" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Model
                            </label>
                            <input v-model="formData.model" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <input v-model="formData.year" type="number" required min="1900"
                                :max="new Date().getFullYear()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Capacity (tons)
                            </label>
                            <input v-model="formData.capacity" type="number" required min="0" step="0.1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                License Plate
                            </label>
                            <input v-model="formData.licensePlate" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select v-model="formData.isAvailable"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option :value="true">Available</option>
                                <option :value="false">Unavailable</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Images
                        </label>
                        <input type="file" multiple accept="image/*" @change="handleImageUpload"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div class="flex justify-end space-x-4 mt-6">
                        <button type="button" @click="showAddModal = false"
                            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            :disabled="loading">
                            {{ loading ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- View Truck Modal -->
        <div v-if="showViewModal && selectedTruck" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg max-w-lg w-full p-6 relative">
                <button @click="showViewModal = false" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                <h2 class="text-2xl font-bold mb-4">Truck Details</h2>
                <div class="mb-4">
                    <img v-if="selectedTruck.images && selectedTruck.images.length > 0" :src="selectedTruck.images[0]" alt="Truck image" class="w-full h-48 object-cover rounded mb-2" />
                    <div v-else class="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-400">No Image</div>
                </div>
                <div class="mb-2"><strong>Make:</strong> {{ selectedTruck.make }}</div>
                <div class="mb-2"><strong>Model:</strong> {{ selectedTruck.model }}</div>
                <div class="mb-2"><strong>Year:</strong> {{ selectedTruck.year }}</div>
                <div class="mb-2"><strong>Capacity:</strong> {{ selectedTruck.capacity }} tons</div>
                <div class="mb-2"><strong>License Plate:</strong> {{ selectedTruck.licensePlate }}</div>
                <div class="mb-2"><strong>Status:</strong> <span :class="selectedTruck.isAvailable ? 'text-green-600' : 'text-red-600'">{{ selectedTruck.isAvailable ? 'Available' : 'Unavailable' }}</span></div>
                <div class="mb-2"><strong>Provider:</strong> {{ selectedTruck.provider ? selectedTruck.provider.firstName + ' ' + selectedTruck.provider.lastName : 'N/A' }}</div>
                <div class="mb-2"><strong>Provider Email:</strong> {{ selectedTruck.provider ? selectedTruck.provider.email : 'N/A' }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const trucks = ref([])
const loading = ref(false)
const error = ref<string | null>(null)
const showAddModal = ref(false)
const showViewModal = ref(false)
const editingTruck = ref<any>(null)
const selectedTruck = ref<any>(null)
const formData = ref({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    licensePlate: '',
    isAvailable: true,
    images: [] as File[],
})

const fetchTrucks = async () => {
    loading.value = true
    error.value = null
    try {
        const res = await fetch('/api/admin/trucks')
        if (!res.ok) throw new Error('Failed to fetch trucks')
        const data = await res.json()
        trucks.value = (data.trucks || []).map((truck: any) => ({
            id: truck.id,
            make: truck.make,
            model: truck.model,
            year: truck.year,
            capacity: truck.capacity,
            licensePlate: truck.licensePlate,
            images: truck.images || [],
            isAvailable: truck.isAvailable !== false, // fallback true if undefined
            provider: truck.provider,
        }))
    } catch (err: any) {
        error.value = err.message || 'Failed to load trucks'
    } finally {
        loading.value = false
    }
}

onMounted(fetchTrucks)

const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        formData.value.images = Array.from(input.files)
    }
}

const openViewModal = (truck: any) => {
    selectedTruck.value = truck
    showViewModal.value = true
}

const editTruck = (truck: any) => {
    editingTruck.value = truck
    formData.value = {
        make: truck.make,
        model: truck.model,
        year: truck.year,
        capacity: truck.capacity,
        licensePlate: truck.licensePlate,
        isAvailable: truck.isAvailable,
        images: [],
    }
    showAddModal.value = true
}

const handleSubmit = async () => {
    try {
        loading.value = true
        if (editingTruck.value) {
            // Edit
            const res = await fetch(`/api/admin/trucks/${editingTruck.value.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    make: formData.value.make,
                    model: formData.value.model,
                    year: formData.value.year,
                    capacity: formData.value.capacity,
                    licensePlate: formData.value.licensePlate,
                    isAvailable: formData.value.isAvailable,
                })
            })
            if (!res.ok) throw new Error('Failed to update truck')
        } else {
            // Add
            const res = await fetch('/api/admin/trucks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    make: formData.value.make,
                    model: formData.value.model,
                    year: formData.value.year,
                    capacity: formData.value.capacity,
                    licensePlate: formData.value.licensePlate,
                    isAvailable: formData.value.isAvailable,
                })
            })
            if (!res.ok) throw new Error('Failed to add truck')
        }
        showAddModal.value = false
        editingTruck.value = null
        formData.value = {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            capacity: 0,
            licensePlate: '',
            isAvailable: true,
            images: [],
        }
        await fetchTrucks()
    } catch (err) {
        error.value = (err as any).message || 'Failed to save truck'
    } finally {
        loading.value = false
    }
}

const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this truck?')) {
        try {
            loading.value = true
            const res = await fetch(`/api/admin/trucks/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete truck')
            await fetchTrucks()
        } catch (err) {
            error.value = (err as any).message || 'Failed to delete truck'
        } finally {
            loading.value = false
        }
    }
}
</script>