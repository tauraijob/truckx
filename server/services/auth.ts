import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

/**
 * Get JWT secret from environment or use default for development
 */
export const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        console.warn('WARNING: Using default JWT secret, not safe for production!')
        return 'default-secret-for-development-only'
    }
    return secret
}

/**
 * Generate JWT token for a user
 */
export const generateToken = (userId: string, role: string): string => {
    const secret = getJwtSecret()
    return jwt.sign(
        {
            userId,
            role
        },
        secret,
        {
            expiresIn: '7d'
        }
    )
}

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

/**
 * Compare a plain text password with a hashed password
 */
export const comparePasswords = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword)
} 