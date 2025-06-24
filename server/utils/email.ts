import nodemailer from 'nodemailer'

var transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "577850002107ac2149f757585ad66ca6"
  }
});

export async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: 'no-reply@mucholinktrucking.com',
    to: email,
    subject: 'Verify your TruckX account',
    html: `
      <div style="font-family: 'Roboto', Arial, sans-serif; background: #f0f4f8; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
          <div style="background: #004080; padding: 24px 0; text-align: center;">
            <img src='https://truckx.com/images/logo.png' alt='TruckX' style='height: 48px; margin-bottom: 8px;' />
            <h1 style="color: #fff; font-size: 1.5rem; margin: 0;">Verify Your Email</h1>
          </div>
          <div style="padding: 32px 24px 24px 24px; text-align: center;">
            <p style="font-size: 1.1rem; color: #334e68; margin-bottom: 24px;">Thank you for registering with <b>TruckX</b>! Please use the code below to verify your email address:</p>
            <div style="display: inline-block; background: #0073ff; color: #fff; font-size: 2rem; font-weight: bold; letter-spacing: 6px; border-radius: 8px; padding: 16px 32px; margin-bottom: 24px;">
              ${otp}
            </div>
            <p style="color: #627d98; margin-top: 24px;">This code will expire in <b>15 minutes</b>. If you did not request this, please ignore this email.</p>
            <p style="color: #829ab1; font-size: 0.95rem; margin-top: 32px;">&copy; ${new Date().getFullYear()} TruckX. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  }
  await transport.sendMail(mailOptions)
}

export async function sendResetEmail(email: string, otp: string) {
  // In production, send an actual email with the OTP
  console.log(`Send password reset OTP to ${email}: ${otp}`)
  // TODO: Integrate with real email service
} 