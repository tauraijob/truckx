import { db } from '~/server/db'
import { hashPassword } from '~/server/services/auth'

export default defineEventHandler(async (event) => {
    try {
        console.log('Creating default admin user...')

        // Check if admin already exists
        const existingAdmin = await db.user.findFirst({
            where: {
                email: 'admin@truckx.com',
                role: 'ADMIN'
            }
        })

        if (existingAdmin) {
            console.log('Admin user already exists!')
            return {
                success: false,
                message: 'Admin user already exists',
                user: {
                    email: existingAdmin.email,
                    role: existingAdmin.role
                }
            }
        }

        // Create admin user
        const hashedPassword = await hashPassword('Admin@123')

        const admin = await db.user.create({
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

        // Return success response without sensitive data
        return {
            success: true,
            message: 'Admin user created successfully',
            user: {
                id: admin.id,
                email: admin.email,
                role: admin.role
            }
        }
    } catch (error) {
        console.error('Error creating admin user:', error)
        throw createError({
            statusCode: 500,
            message: 'Error creating admin user'
        })
    }
}) 