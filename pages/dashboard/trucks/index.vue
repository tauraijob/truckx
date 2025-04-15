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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTruck } from '~/composables/useTruck'

const {
    trucks,
    loading,
    error,
    fetchTrucks,
    addTruck,
    updateTruck,
    deleteTruck,
    uploadTruckImages,
} = useTruck()

const showAddModal = ref(false)
const editingTruck = ref<any>(null)
const formData = ref({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity: 0,
    licensePlate: '',
    isAvailable: true,
    images: [] as File[],
})

onMounted(async () => {
    await fetchTrucks()
})

const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        formData.value.images = Array.from(input.files)
    }
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
        if (editingTruck.value) {
            await updateTruck(editingTruck.value.id, formData.value)
            if (formData.value.images.length > 0) {
                await uploadTruckImages(editingTruck.value.id, formData.value.images)
            }
        } else {
            const newTruck = await addTruck(formData.value)
            if (formData.value.images.length > 0) {
                await uploadTruckImages(newTruck.id, formData.value.images)
            }
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
    } catch (err) {
        console.error('Error saving truck:', err)
    }
}

const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this truck?')) {
        try {
            await deleteTruck(id)
            await fetchTrucks()
        } catch (err) {
            console.error('Error deleting truck:', err)
        }
    }
}
</script>