import { prisma } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, otp } = body

    if (!email || !otp) {
      throw createError({ statusCode: 400, message: 'Email and OTP are required.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found.' })
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw createError({ statusCode: 400, message: 'No OTP set for this user.' })
    }

    if (user.otp !== otp) {
      throw createError({ statusCode: 400, message: 'Invalid OTP.' })
    }

    if (new Date() > user.otpExpiresAt) {
      throw createError({ statusCode: 400, message: 'OTP has expired.' })
    }

    // Activate user, mark as verified, and clear OTP fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null
      }
    })

    return { success: true, message: 'Email verified successfully.' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'OTP verification failed.'
    })
  }
})

export const skipAuth = true; 