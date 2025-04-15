<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900">My Loads</h1>
            <button @click="showAddModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add New Load
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
        <div v-else-if="loads.length === 0" class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">No loads added yet</h3>
            <p class="text-gray-500 mb-4">Start by adding your first load to the platform</p>
            <button @click="showAddModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Your First Load
            </button>
        </div>

        <!-- Loads List -->
        <div v-else class="space-y-4">
            <div v-for="load in loads" :key="load.id" class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">
                            {{ load.title }}
                        </h3>
                        <p class="text-gray-600">{{ load.description }}</p>
                    </div>
                    <span :class="[
                        'px-3 py-1 rounded-full text-sm font-medium',
                        {
                            'bg-yellow-100 text-yellow-800': load.status === 'PENDING',
                            'bg-blue-100 text-blue-800': load.status === 'ASSIGNED',
                            'bg-green-100 text-green-800': load.status === 'IN_TRANSIT',
                            'bg-gray-100 text-gray-800': load.status === 'DELIVERED',
                            'bg-red-100 text-red-800': load.status === 'CANCELLED',
                        }
                    ]">
                        {{ load.status }}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Pickup Location</h4>
                        <p class="text-gray-900">{{ load.pickupLocation }}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Delivery Location</h4>
                        <p class="text-gray-900">{{ load.deliveryLocation }}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Weight</h4>
                        <p class="text-gray-900">{{ load.weight }} tons</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Dimensions</h4>
                        <p class="text-gray-900">
                            {{ load.dimensions.length }}m × {{ load.dimensions.width }}m × {{ load.dimensions.height }}m
                        </p>
                    </div>
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Price</h4>
                        <p class="text-gray-900">${{ load.price.toLocaleString() }}</p>
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <div class="flex space-x-4">
                        <button @click="editLoad(load)" class="text-blue-600 hover:text-blue-800 font-medium">
                            Edit
                        </button>
                        <button @click="handleDelete(load.id)" class="text-red-600 hover:text-red-800 font-medium">
                            Delete
                        </button>
                    </div>
                    <div class="text-sm text-gray-500">
                        Created: {{ new Date(load.createdAt).toLocaleDateString() }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Load Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    {{ editingLoad ? 'Edit Load' : 'Add New Load' }}
                </h2>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input v-model="formData.title" type="text" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea v-model="formData.description" required rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Pickup Location
                            </label>
                            <input v-model="formData.pickupLocation" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Location
                            </label>
                            <input v-model="formData.deliveryLocation" type="text" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Weight (tons)
                            </label>
                            <input v-model="formData.weight" type="number" required min="0" step="0.1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)
                            </label>
                            <input v-model="formData.price" type="number" required min="0" step="0.01"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Length (m)
                            </label>
                            <input v-model="formData.dimensions.length" type="number" required min="0" step="0.1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Width (m)
                            </label>
                            <input v-model="formData.dimensions.width" type="number" required min="0" step="0.1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Height (m)
                            </label>
                            <input v-model="formData.dimensions.height" type="number" required min="0" step="0.1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
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
import { useLoad } from '~/composables/useLoad'

const {
    loads,
    loading,
    error,
    fetchLoads,
    addLoad,
    updateLoad,
    deleteLoad,
} = useLoad()

const showAddModal = ref(false)
const editingLoad = ref<any>(null)
const formData = ref({
    title: '',
    description: '',
    pickupLocation: '',
    deliveryLocation: '',
    weight: 0,
    price: 0,
    dimensions: {
        length: 0,
        width: 0,
        height: 0,
    },
})

onMounted(async () => {
    await fetchLoads()
})

const editLoad = (load: any) => {
    editingLoad.value = load
    formData.value = {
        title: load.title,
        description: load.description,
        pickupLocation: load.pickupLocation,
        deliveryLocation: load.deliveryLocation,
        weight: load.weight,
        price: load.price,
        dimensions: { ...load.dimensions },
    }
    showAddModal.value = true
}

const handleSubmit = async () => {
    try {
        if (editingLoad.value) {
            await updateLoad(editingLoad.value.id, formData.value)
        } else {
            await addLoad(formData.value)
        }
        showAddModal.value = false
        editingLoad.value = null
        formData.value = {
            title: '',
            description: '',
            pickupLocation: '',
            deliveryLocation: '',
            weight: 0,
            price: 0,
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
            },
        }
    } catch (err) {
        console.error('Error saving load:', err)
    }
}

const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this load?')) {
        try {
            await deleteLoad(id)
            await fetchLoads()
        } catch (err) {
            console.error('Error deleting load:', err)
        }
    }
}
</script>