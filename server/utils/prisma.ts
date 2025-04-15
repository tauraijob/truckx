import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

// Check if we're in production
if (process.env.NODE_ENV === 'production') {
  // In production, create a new instance
  prisma = new PrismaClient()
} else {
  // In development, use global to prevent multiple connections
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['error', 'warn']
    })
  }
  prisma = (global as any).prisma
}

export default prisma
export { prisma }
export const db = prisma 