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
            throw createError({
                statusCode: 400,
                message: 'Email and password are required'
            })
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.log('User not found:', email)
            throw createError({
                statusCode: 401,
                message: 'Invalid credentials'
            })
        }

        console.log('User found:', user.id, 'Role:', user.role)

        // Check if user is active
        if (!user.isActive) {
            console.log('Account is deactivated:', user.id)
            throw createError({
                statusCode: 401,
                message: 'Account is deactivated'
            })
        }

        // Verify password
        const isPasswordValid = await comparePasswords(password, user.password)
        if (!isPasswordValid) {
            console.log('Invalid password for user:', user.id)
            throw createError({
                statusCode: 401,
                message: 'Invalid credentials'
            })
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
            user: userWithoutPassword,
            token,
            message: 'Login successful'
        }
    } catch (error: any) {
        console.error('Login error:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error logging in'
        })
    }
}) 