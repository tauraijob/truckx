// skipAuth: true
import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { otp, password, email } = body
    if (!otp || !password || !email) {
        throw createError({ statusCode: 400, statusMessage: 'OTP, email, and password are required' })
    }
    // Find the reset token for this user and OTP
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid email or OTP' })
    }
    const resetToken = await prisma.passwordResetToken.findFirst({
        where: {
            userId: user.id,
            token: otp,
            expiresAt: { gte: new Date() }
        }
    })
    if (!resetToken) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or expired OTP' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    })
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
    return { success: true }
}) 