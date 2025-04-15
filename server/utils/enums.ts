// Define enums to match the Prisma schema
export enum OrderStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum PaymentType {
    PLATFORM_FEE = 'PLATFORM_FEE',
    EARNING = 'EARNING'
}

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    TRUCK_PROVIDER = 'TRUCK_PROVIDER',
    LOAD_PROVIDER = 'LOAD_PROVIDER'
} 