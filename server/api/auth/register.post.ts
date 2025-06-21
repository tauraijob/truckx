import { prisma } from '#imports'
import { hashPassword } from '#imports'
import { sendVerificationEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        let { email, password, firstName, lastName, phoneNumber, role } = body

        console.log('Registration request body:', body)

        // Set default values for missing fields
        if (!lastName) lastName = '-'
        if (!phoneNumber) phoneNumber = '123-456-7890'

        // Validate required fields
        if (!email || !password || !firstName || !role) {
            console.log('Missing required fields:', { email, password, firstName, lastName, phoneNumber, role })
            return {
                success: false,
                message: 'Missing required fields'
            }
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            console.log('User already exists:', email)
            return {
                success: false,
                message: 'User with this email already exists'
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password)
        console.log('Password hashed successfully')

        // Map role string to enum (directly use uppercase)
        let userRole: any
        switch (role.toUpperCase()) {
            case 'TRUCK_PROVIDER':
                userRole = 'TRUCK_PROVIDER'
                break
            case 'LOAD_PROVIDER':
                userRole = 'LOAD_PROVIDER'
                break
            case 'ADMIN':
                userRole = 'ADMIN'
                break
            case 'SUPER_ADMIN':
                userRole = 'SUPER_ADMIN'
                break
            default:
                // Default based on email pattern
                if (email.includes('truck')) {
                    userRole = 'TRUCK_PROVIDER'
                } else if (email.includes('load')) {
                    userRole = 'LOAD_PROVIDER'
                } else if (email.includes('admin')) {
                    userRole = 'ADMIN'
                } else {
                    userRole = 'LOAD_PROVIDER' // Default fallback
                }
        }

        console.log('Creating user with role:', userRole)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                role: userRole
            }
        })

        console.log('User created successfully:', user.id, 'with role:', user.role)

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
        // Store OTP and expiry in the user record
        await prisma.user.update({
            where: { id: user.id },
            data: { otp, otpExpiresAt }
        })
        // Send verification email
        await sendVerificationEmail(user.email, otp)
        console.log('Verification OTP sent to:', user.email)

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        return {
            success: true,
            user: userWithoutPassword,
            message: 'User registered successfully'
        }
    } catch (error: any) {
        console.error('Registration error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error registering user'
        })
    }
}) 