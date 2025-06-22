import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('Password123!', 10)

    const users = [
        {
            email: 'superadmin@truckx.com',
            password,
            firstName: 'Super',
            lastName: 'Admin',
            phoneNumber: '1000000000',
            role: 'SUPER_ADMIN',
            isVerified: true,
            isActive: true
        },
        {
            email: 'admin@truckx.com',
            password,
            firstName: 'Admin',
            lastName: 'User',
            phoneNumber: '2000000000',
            role: 'ADMIN',
            isVerified: true,
            isActive: true
        },
        {
            email: 'truckprovider@truckx.com',
            password,
            firstName: 'Truck',
            lastName: 'Provider',
            phoneNumber: '3000000000',
            role: 'TRUCK_PROVIDER',
            isVerified: true,
            isActive: true
        },
        {
            email: 'loadprovider@truckx.com',
            password,
            firstName: 'Load',
            lastName: 'Provider',
            phoneNumber: '4000000000',
            role: 'LOAD_PROVIDER',
            isVerified: true,
            isActive: true
        }
    ]

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: user,
            create: user
        })
        console.log(`Seeded user: ${user.email}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 