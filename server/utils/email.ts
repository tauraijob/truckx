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
  const mailOptions = {
    from: 'no-reply@mucholinktrucking.com',
    to: email,
    subject: 'Reset your TruckX password',
    html: `
      <div style="font-family: 'Roboto', Arial, sans-serif; background: #f0f4f8; padding: 32px;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
          <div style="background: #004080; padding: 24px 0; text-align: center;">
            <img src='https://truckx.com/images/logo.png' alt='TruckX' style='height: 48px; margin-bottom: 8px;' />
            <h1 style="color: #fff; font-size: 1.5rem; margin: 0;">Reset Your Password</h1>
          </div>
          <div style="padding: 32px 24px 24px 24px; text-align: center;">
            <p style="font-size: 1.1rem; color: #334e68; margin-bottom: 24px;">You requested a password reset for <b>TruckX</b>. Please use the code below to reset your password:</p>
            <div style="display: inline-block; background: #0073ff; color: #fff; font-size: 2rem; font-weight: bold; letter-spacing: 6px; border-radius: 8px; padding: 16px 32px; margin-bottom: 24px;">
              ${otp}
            </div>
            <p style="color: #627d98; margin-top: 24px;">This code will expire in <b>1 hour</b>. If you did not request this, please ignore this email.</p>
            <p style="color: #829ab1; font-size: 0.95rem; margin-top: 32px;">&copy; ${new Date().getFullYear()} TruckX. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  }
  await transport.sendMail(mailOptions)
}

function brandedEmailTemplate({ title, message }: { title: string, message: string }) {
  return `
    <div style="font-family: 'Roboto', Arial, sans-serif; background: #f0f4f8; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
        <div style="background: #004080; padding: 24px 0; text-align: center;">
          <img src='https://truckx.com/images/logo.png' alt='TruckX' style='height: 48px; margin-bottom: 8px;' />
          <h1 style="color: #fff; font-size: 1.5rem; margin: 0;">${title}</h1>
        </div>
        <div style="padding: 32px 24px 24px 24px; text-align: center;">
          ${message}
          <p style="color: #829ab1; font-size: 0.95rem; margin-top: 32px;">&copy; ${new Date().getFullYear()} TruckX. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendOrderCreatedEmail(to: string, order: any) {
  const message = `
    <p style="font-size: 1.1rem; color: #334e68; margin-bottom: 24px;">Your order for <b>${order.load?.title || 'a load'}</b> has been placed successfully!</p>
    <div style="background: #0073ff; color: #fff; font-size: 1.2rem; font-weight: bold; border-radius: 8px; padding: 12px 24px; margin-bottom: 24px; display: inline-block;">Order ID: ${order.id}</div>
    <p style="color: #627d98;">You will receive further updates as your order progresses.</p>
  `;
  const mailOptions = {
    from: 'no-reply@mucholinktrucking.com',
    to,
    subject: 'Order Placed Successfully',
    html: brandedEmailTemplate({ title: 'Order Placed', message })
  }
  await transport.sendMail(mailOptions)
}

export async function sendOrderCompletedEmail(to: string, order: any) {
  const message = `
    <p style="font-size: 1.1rem; color: #334e68; margin-bottom: 24px;">Your order for <b>${order.load?.title || 'a load'}</b> has been marked as <b>delivered/completed</b>.</p>
    <div style="background: #22c55e; color: #fff; font-size: 1.2rem; font-weight: bold; border-radius: 8px; padding: 12px 24px; margin-bottom: 24px; display: inline-block;">Order ID: ${order.id}</div>
    <p style="color: #627d98;">Thank you for using TruckX! We hope to serve you again soon.</p>
  `;
  const mailOptions = {
    from: 'no-reply@mucholinktrucking.com',
    to,
    subject: 'Order Delivered/Completed',
    html: brandedEmailTemplate({ title: 'Order Delivered', message })
  }
  await transport.sendMail(mailOptions)
}

export async function sendOrderCancelledEmail(to: string, order: any) {
  const message = `
    <p style="font-size: 1.1rem; color: #334e68; margin-bottom: 24px;">Your order for <b>${order.load?.title || 'a load'}</b> has been <b>cancelled</b>.</p>
    <div style="background: #ef4444; color: #fff; font-size: 1.2rem; font-weight: bold; border-radius: 8px; padding: 12px 24px; margin-bottom: 24px; display: inline-block;">Order ID: ${order.id}</div>
    <p style="color: #627d98;">If you have questions, please contact support.</p>
  `;
  const mailOptions = {
    from: 'no-reply@mucholinktrucking.com',
    to,
    subject: 'Order Cancelled',
    html: brandedEmailTemplate({ title: 'Order Cancelled', message })
  }
  await transport.sendMail(mailOptions)
}

export async function sendOrderUpdatedEmail(to: string, order: any, status: string) {
  let extraDetails = ''
  if (status === 'ACCEPTED') {
    extraDetails = `
      <h3 style="color: #004080; margin-bottom: 8px;">Truck Provider Details</h3>
      <div style="margin-bottom: 16px;">
        <b>Name:</b> ${order.truckProvider?.firstName || ''} ${order.truckProvider?.lastName || ''}<br/>
        <b>Email:</b> ${order.truckProvider?.email || 'N/A'}
      </div>
      <h3 style="color: #004080; margin-bottom: 8px;">Truck Details</h3>
      <div style="margin-bottom: 16px;">
        <b>Make:</b> ${order.truck?.make || 'N/A'}<br/>
        <b>Model:</b> ${order.truck?.model || 'N/A'}<br/>
        <b>License Plate:</b> ${order.truck?.licensePlate || 'N/A'}
      </div>
    `
  }
  const message = `
    <p style="font-size: 1.1rem; color: #334e68; margin-bottom: 24px;">Your order for <b>${order.load?.title || 'a load'}</b> status has been updated to <b>${status}</b>.</p>
    <div style="background: #004080; color: #fff; font-size: 1.2rem; font-weight: bold; border-radius: 8px; padding: 12px 24px; margin-bottom: 24px; display: inline-block;">Order ID: ${order.id}</div>
    ${extraDetails}
    <p style="color: #627d98;">You will receive further updates as your order progresses.</p>
  `;
  const mailOptions = {
    from: 'no-reply@mucholinktrucking.com',
    to,
    subject: 'Order Status Updated',
    html: brandedEmailTemplate({ title: 'Order Status Updated', message })
  }
  await transport.sendMail(mailOptions)
} 