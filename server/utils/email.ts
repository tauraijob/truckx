export async function sendResetEmail(email: string, otp: string) {
    // In production, send an actual email with the OTP
    console.log(`Send password reset OTP to ${email}: ${otp}`)
    // TODO: Integrate with real email service
} 