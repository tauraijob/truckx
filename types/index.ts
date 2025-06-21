// User roles
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    TRUCK_PROVIDER = 'TRUCK_PROVIDER',
    LOAD_PROVIDER = 'LOAD_PROVIDER'
}

// Load statuses
export enum LoadStatus {
    PENDING = 'PENDING',
    AVAILABLE = 'AVAILABLE',
    ASSIGNED = 'ASSIGNED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

// Order statuses
export enum OrderStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

// Payment statuses
export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

// Payment types
export enum PaymentType {
    PLATFORM_FEE = 'PLATFORM_FEE',
    EARNING = 'EARNING'
}

// User interface
export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    phoneNumber: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// Order interface
export interface Order {
    id: string
    status: OrderStatus
    platformFee: number
    price?: number
    paymentStatus: PaymentStatus
    notes?: string
    completedAt?: string
    createdAt: string
    acceptedAt?: string
    updatedAt: string
    loadId: string
    truckId: string
    truckProviderId: string
    loadProviderId: string
}

// Load interface
export interface Load {
    id: string
    title: string
    description: string
    weight: number
    volume: number
    pickupLocation: string
    deliveryLocation: string
    distance: number
    price: number
    type: string
    status: LoadStatus
    images: string[]
    specifications: Record<string, any>
    isAvailable: boolean
    createdAt: string
    updatedAt: string
    providerId: string
}

// Truck interface
export interface Truck {
    id: string
    make: string
    model: string
    year: number
    capacity: number
    licensePlate: string
    images: string[]
    specifications: Record<string, any>
    isAvailable: boolean
    createdAt: string
    updatedAt: string
    providerId: string
}

// Payment interface
export interface Payment {
    id: string
    amount: number
    type: PaymentType
    status: PaymentStatus
    description: string
    createdAt: string
    updatedAt: string
    orderId: string
    userId: string
}

// PaymentInfo interface
export interface PaymentInfo {
    id: string
    bankName: string
    accountNumber: string
    routingNumber: string
    accountType: string
    paymentFrequency: string
    createdAt: string
    updatedAt: string
    userId: string
} 