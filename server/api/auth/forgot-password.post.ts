// skipAuth: true
import { prisma } from '~/server/utils/prisma'
import { sendResetEmail } from '~/server/utils/email'
import { randomInt } from 'crypto'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email } = body
    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'Email is required' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        // For security, do not reveal if the email exists
        return { success: true }
    }
    // Generate a 6-digit OTP (e.g. 123456)
    const otp = randomInt(100000, 999999).toString()
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    // Store the OTP (using the token field) in the PasswordResetToken table
    await prisma.passwordResetToken.create({
        data: {
            userId: user.id,
            token: otp,
            expiresAt: expires
        }
    })
    // Send the email (placeholder) with the OTP
    await sendResetEmail(email, otp)
    return { success: true }
}) 