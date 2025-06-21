<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Load Management</h1>
      <div class="flex gap-4">
        <button
          @click="openDeleteAllModal"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete All Loads
        </button>
        <button 
          @click="openCreateModal"
          class="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
        >
        Add New Load
      </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>You may need to log in again to access the data.</p>
          </div>
          <div class="mt-4">
            <div class="-mx-2 -my-1.5 flex">
              <NuxtLink to="/auth/login" class="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100">
                Go to login
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      <p class="mt-2 text-sm text-gray-600">Loading loads...</p>
    </div>

    <!-- Loads Filters -->
    <div v-if="!loading && !error" class="mb-6 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            placeholder="Search loads by title, origin, destination..."
            class="block w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loads Table -->
    <div class="overflow-x-auto rounded-lg border bg-white shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Load Information</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Route</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Provider</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="load in filteredLoads" :key="load.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <TruckIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ load.title }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(load.pickupDate) }}</div>
                  <div class="text-xs text-gray-500">ID: {{ load.id.slice(0, 8) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                <div class="flex items-center">
                  <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                  <span>{{ load.origin }}</span>
                </div>
                <div class="flex items-center mt-1">
                  <ArrowLongRightIcon class="h-4 w-4 text-gray-400 mx-1" />
                </div>
                <div class="flex items-center mt-1">
                  <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                  <span>{{ load.destination }}</span>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">${{ load.price.toFixed(2) }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusBadgeClass(load.status)">
                {{ formatStatus(load.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div class="text-sm">{{ load.providerName }}</div>
              <div class="text-xs text-gray-400">{{ load.providerEmail }}</div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <div class="flex space-x-2">
                <button 
                  @click="openViewModal(load)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-blue-600"
                  title="View Details"
                >
                  <EyeIcon class="h-5 w-5" />
                </button>
                <button 
                  @click="openEditModal(load)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-green-600"
                  title="Edit Load"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button 
                  v-if="load.status === 'PENDING'"
                  @click="openDeleteModal(load)"
                  class="rounded bg-white p-1 text-gray-400 hover:text-red-600"
                  title="Delete Load"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredLoads.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
              No loads found matching your criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Showing {{ displayedRange }} of {{ loads.length }} loads
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- View Load Modal -->
    <TransitionRoot appear :show="isViewModalOpen" as="template">
      <Dialog as="div" @close="closeViewModal" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Load Details
                </DialogTitle>

                <div v-if="selectedLoad" class="mt-4 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Title</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedLoad.title }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Status</h4>
                      <p class="mt-1">
                        <span class="inline-flex rounded-full px-3 py-0.5 text-xs font-medium" :class="getStatusBadgeClass(selectedLoad.status)">
                          {{ formatStatus(selectedLoad.status) }}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Price</h4>
                      <p class="mt-1 text-sm text-gray-900">${{ selectedLoad.price.toFixed(2) }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Provider</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedLoad.providerName }}</p>
                      <p class="text-xs text-gray-500">{{ selectedLoad.providerEmail }}</p>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Route</h4>
                    <div class="mt-2 space-y-2">
                      <div class="flex items-center">
                        <MapPinIcon class="h-4 w-4 text-gray-400 mr-2" />
                        <span class="text-sm text-gray-900">{{ selectedLoad.origin }}</span>
                      </div>
                      <div class="flex items-center">
                        <ArrowLongRightIcon class="h-4 w-4 text-gray-400 mx-2" />
                      </div>
                      <div class="flex items-center">
                        <MapPinIcon class="h-4 w-4 text-gray-400 mr-2" />
                        <span class="text-sm text-gray-900">{{ selectedLoad.destination }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Pickup Date</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedLoad.pickupDate) }}</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Delivery Date</h4>
                      <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedLoad.deliveryDate) }}</p>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-sm font-medium text-gray-500">Description</h4>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedLoad.description || 'No description provided' }}</p>
                  </div>

                  <div v-if="selectedLoad.activeOrder" class="mt-4 rounded-md bg-gray-50 p-4">
                    <h4 class="text-sm font-medium text-gray-900">Active Order</h4>
                    <div class="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500">Order ID</p>
                        <p class="text-sm text-gray-900">{{ selectedLoad.activeOrder.id.slice(0, 8) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Status</p>
                        <p class="text-sm">
                          <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium" :class="getOrderStatusBadgeClass(selectedLoad.activeOrder.status)">
                            {{ formatOrderStatus(selectedLoad.activeOrder.status) }}
                          </span>
                        </p>
                      </div>
                      <div v-if="selectedLoad.activeOrder.truck">
                        <p class="text-xs text-gray-500">Truck</p>
                        <p class="text-sm text-gray-900">
                          {{ selectedLoad.activeOrder.truck.make }} - {{ selectedLoad.activeOrder.truck.licensePlate }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    @click="closeViewModal"
                  >
                    Close
                  </button>
                  <button
                    v-if="selectedLoad && selectedLoad.status === 'PENDING'"
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    @click="openEditModal(selectedLoad)"
                  >
                    Edit Load
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Edit Load Modal -->
    <TransitionRoot appear :show="isEditModalOpen" as="template">
      <Dialog as="div" @close="closeEditModal" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ isCreating ? 'Create New Load' : 'Edit Load' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        id="title"
                        v-model="formData.title"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="price" class="block text-sm font-medium text-gray-700">Price ($)</label>
                      <input
                        type="number"
                        id="price"
                        v-model.number="formData.price"
                        required
                        min="0"
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="origin" class="block text-sm font-medium text-gray-700">Origin</label>
                      <input
                        type="text"
                        id="origin"
                        v-model="formData.origin"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="destination" class="block text-sm font-medium text-gray-700">Destination</label>
                      <input
                        type="text"
                        id="destination"
                        v-model="formData.destination"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="pickupDate" class="block text-sm font-medium text-gray-700">Pickup Date</label>
                      <input
                        type="datetime-local"
                        id="pickupDate"
                        v-model="formData.pickupDate"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="deliveryDate" class="block text-sm font-medium text-gray-700">Delivery Date</label>
                      <input
                        type="datetime-local"
                        id="deliveryDate"
                        v-model="formData.deliveryDate"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      v-model="formData.description"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      @click="closeEditModal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      :disabled="isSubmitting"
                    >
                      {{ isSubmitting ? 'Saving...' : (isCreating ? 'Create Load' : 'Save Changes') }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="isDeleteModalOpen" as="template">
      <Dialog as="div" @close="closeDeleteModal" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Delete Load
                </DialogTitle>

                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this load? This action cannot be undone.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    @click="closeDeleteModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    @click="handleDelete"
                    :disabled="isDeleting"
                  >
                    {{ isDeleting ? 'Deleting...' : 'Delete Load' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete All Confirmation Modal -->
    <TransitionRoot appear :show="isDeleteAllModalOpen" as="template">
      <Dialog as="div" @close="closeDeleteAllModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Delete All Loads
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    This action will permanently delete ALL loads and their associated orders. This action cannot be undone.
                    Are you absolutely sure you want to proceed?
                  </p>
                </div>

                <div class="mt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    @click="closeDeleteAllModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    @click="confirmDeleteAll"
                    :disabled="isDeleting"
                  >
                    {{ isDeleting ? 'Deleting...' : 'Yes, Delete All' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  MagnifyingGlassIcon,
  TruckIcon,
  MapPinIcon,
  ArrowLongRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { LoadStatus, OrderStatus } from '~/types'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'admin-dashboard',
  middleware: ['auth']
})

interface Load {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  price: number;
  status: LoadStatus;
  providerId: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
  activeOrder?: {
    id: string;
    status: OrderStatus;
    truck?: {
      id: string;
      make: string;
      licensePlate: string;
    };
  };
}

// Pagination settings
const itemsPerPage = 10
const currentPage = ref(1)
const searchQuery = ref('')
const filterStatus = ref<LoadStatus | ''>('')

// Loads data
const loads = ref<Load[]>([])
const loading = ref(true)
const error = ref('')

// Modal states
const isViewModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isCreating = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const selectedLoad = ref<Load | null>(null)

// Form data
const formData = ref({
  title: '',
  description: '',
  origin: '',
  destination: '',
  pickupDate: '',
  deliveryDate: '',
  price: 0
})

// Delete All Modal State
const isDeleteAllModalOpen = ref(false)

// Get auth composable
const { getToken, checkAuth } = useAuth()

// Filter loads based on search and status filter
const filteredLoads = computed(() => {
  let result = loads.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(load => 
      load.title.toLowerCase().includes(query) || 
      load.origin.toLowerCase().includes(query) || 
      load.destination.toLowerCase().includes(query) ||
      load.providerName.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    result = result.filter(load => load.status === filterStatus.value)
  }

  // Return paginated result
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return result.slice(startIndex, startIndex + itemsPerPage)
})

// Calculate total pages
const totalPages = computed(() => Math.ceil(loads.value.length / itemsPerPage))

// Display range for pagination
const displayedRange = computed(() => {
  const filteredCount = loads.value.length
  
  const start = Math.min((currentPage.value - 1) * itemsPerPage + 1, filteredCount)
  const end = Math.min(start + filteredLoads.value.length - 1, filteredCount)
  
  return `${start}-${end}`
})

// Pagination methods
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Format status for display
function formatStatus(status: LoadStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'ASSIGNED':
      return 'Assigned'
    case 'IN_TRANSIT':
      return 'In Transit'
    case 'DELIVERED':
      return 'Delivered'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return status
  }
}

// Format order status for display
function formatOrderStatus(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'ACCEPTED':
      return 'Accepted'
    case 'IN_TRANSIT':
      return 'In Transit'
    case 'DELIVERED':
      return 'Delivered'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    case 'REJECTED':
      return 'Rejected'
    default:
      return status
  }
}

// Get status badge styling
function getStatusBadgeClass(status: LoadStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_TRANSIT':
      return 'bg-purple-100 text-purple-800'
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get order status badge styling
function getOrderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'ACCEPTED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_TRANSIT':
      return 'bg-purple-100 text-purple-800'
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Modal methods
function openViewModal(load: Load) {
  selectedLoad.value = load
  isViewModalOpen.value = true
}

function closeViewModal() {
  selectedLoad.value = null
  isViewModalOpen.value = false
}

function openEditModal(load?: Load) {
  isCreating.value = !load
  if (load) {
    selectedLoad.value = load
    formData.value = {
      title: load.title,
      description: load.description || '',
      origin: load.origin,
      destination: load.destination,
      pickupDate: new Date(load.pickupDate).toISOString().slice(0, 16),
      deliveryDate: new Date(load.deliveryDate).toISOString().slice(0, 16),
      price: load.price
    }
  } else {
    selectedLoad.value = null
    formData.value = {
      title: '',
      description: '',
      origin: '',
      destination: '',
      pickupDate: '',
      deliveryDate: '',
      price: 0
    }
  }
  isEditModalOpen.value = true
}

function closeEditModal() {
  selectedLoad.value = null
  isEditModalOpen.value = false
}

function openDeleteModal(load: Load) {
  selectedLoad.value = load
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  selectedLoad.value = null
  isDeleteModalOpen.value = false
}

// Form submission
async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const url = isCreating.value ? '/api/admin/loads' : `/api/admin/loads/${selectedLoad.value?.id}`
    const method = isCreating.value ? 'POST' : 'PUT'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to save load')
    }

    // Refresh the loads list
    await fetchLoads()
    closeEditModal()
  } catch (err: any) {
    console.error('Error saving load:', err)
    error.value = err.message || 'An error occurred while saving the load'
  } finally {
    isSubmitting.value = false
  }
}

// Delete load
async function handleDelete() {
  if (isDeleting.value || !selectedLoad.value) return

  isDeleting.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`/api/admin/loads/${selectedLoad.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete load')
    }

    // Refresh the loads list
    await fetchLoads()
    closeDeleteModal()
  } catch (err: any) {
    console.error('Error deleting load:', err)
    error.value = err.message || 'An error occurred while deleting the load'
  } finally {
    isDeleting.value = false
  }
}

// Fetch loads
async function fetchLoads() {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    // Build the URL with query parameters
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: itemsPerPage.toString()
    })
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    if (filterStatus.value) {
      params.append('status', filterStatus.value)
    }
    
    const url = `/api/admin/loads?${params.toString()}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to load data (${response.status})`)
    }
    
    const data = await response.json()
    
    if (data && data.loads) {
      loads.value = data.loads
    }
  } catch (err: any) {
    console.error('Error fetching loads:', err)
    error.value = err.message || 'An error occurred while loading data'
  } finally {
    loading.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchLoads()
})

// Watch for changes in filters and pagination
watch([searchQuery, filterStatus, currentPage], () => {
  // Reset to first page when filters change
  if ((searchQuery.value || filterStatus.value) && currentPage.value !== 1) {
    currentPage.value = 1
    return // The watch will trigger again with the updated page
  }
  
  fetchLoads()
})

// Delete All Modal methods
const openDeleteAllModal = () => {
  isDeleteAllModalOpen.value = true
}

const closeDeleteAllModal = () => {
  isDeleteAllModalOpen.value = false
}

const confirmDeleteAll = async () => {
  try {
    // Check authentication first
    const isAuth = await checkAuth()
    if (!isAuth) {
      alert('Please log in again to perform this action')
      navigateTo('/auth/login')
      return
    }

    isDeleting.value = true
    const token = getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await $fetch('/api/admin/loads/delete-all-force', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.success) {
      // Show success message
      alert(`Successfully deleted ${response.details.deletedLoads} loads and ${response.details.deletedOrders} orders`)
      // Refresh the loads list
      await fetchLoads()
    }
  } catch (error: any) {
    if (error.statusCode === 401) {
      alert('Please log in again to perform this action')
      navigateTo('/auth/login')
    } else {
      alert(error.message || 'Failed to delete loads')
    }
  } finally {
    isDeleting.value = false
    closeDeleteAllModal()
  }
}
</script> 