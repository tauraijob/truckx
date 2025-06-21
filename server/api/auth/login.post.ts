import { prisma } from '#imports'
import { comparePasswords, generateToken } from '#imports'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { email, password } = body

        console.log('Login attempt for email:', email)

        // Validate required fields
        if (!email || !password) {
            console.log('Missing email or password')
            return {
                success: false,
                message: 'Email and password are required'
            }
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.log('User not found:', email)
            return {
                success: false,
                message: 'Invalid credentials'
            }
        }

        console.log('User found:', user.id, 'Role:', user.role)

        // Check if user is active
        if (!user.isActive) {
            console.log('Account is deactivated:', user.id)
            return {
                success: false,
                message: 'Account is deactivated'
            }
        }
        if (!user.isVerified) {
            console.log('Account is not verified:', user.id)
            return {
                success: false,
                message: 'Account is not verified'
            }
        }

        // Verify password
        const isPasswordValid = await comparePasswords(password, user.password)
        if (!isPasswordValid) {
            console.log('Invalid password for user:', user.id)
            return {
                success: false,
                message: 'Invalid credentials'
            }
        }

        console.log('Password verification successful')

        // Generate token
        const token = generateToken(user.id, user.role)
        console.log('Token generated successfully')

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        console.log('Response user object:', userWithoutPassword)

        console.log("Login endpoint – user:", JSON.stringify(userWithoutPassword, null, 2), "token:", token)

        return {
            success: true,
            user: userWithoutPassword,
            token,
            message: 'Login successful'
        }
    } catch (error: any) {
        console.error('Login error:', error)
        return {
            success: false,
            message: error.message || 'Error logging in'
        }
    }
}) 