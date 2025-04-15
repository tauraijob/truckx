import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthToken {
    userId: string
    role: string
    iat: number
    exp: number
}

export interface UserSession {
    id: string
    email: string
    role: string
    firstName: string
    lastName: string
    phoneNumber: string
    isActive: boolean
}

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: string, role: string): string => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): AuthToken | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthToken
        return decoded
    } catch (error) {
        return null
    }
}

export async function getServerSession(event: H3Event): Promise<{ user: UserSession } | null> {
    try {
        const token = event.node.req.headers.authorization?.split(' ')[1]

        if (!token) {
            return null
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })

        if (!user) {
            return null
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                isActive: user.isActive
            }
        }
    } catch (error) {
        console.error('Error in getServerSession:', error)
        return null
    }
} 