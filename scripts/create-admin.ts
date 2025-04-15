import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../server/services/auth'

const prisma = new PrismaClient()

async function createAdminUser() {
    try {
        console.log('Creating default admin user...')

        // Check if admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: {
                email: 'admin@truckx.com',
                role: 'ADMIN'
            }
        })

        if (existingAdmin) {
            console.log('Admin user already exists!')
            return
        }

        // Create admin user
        const hashedPassword = await hashPassword('Admin@123')

        const admin = await prisma.user.create({
            data: {
                email: 'admin@truckx.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                phoneNumber: '+1234567890',
                role: 'ADMIN',
                isActive: true
            }
        })

        console.log('Admin user created successfully:', admin.id)
    } catch (error) {
        console.error('Error creating admin user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createAdminUser() 