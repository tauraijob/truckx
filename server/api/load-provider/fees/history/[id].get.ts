import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, createError, getHeader } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('Fetching payment history for load provider')

    // Check authentication
    const authHeader = getHeader(event, 'authorization')
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        console.log('Development mode - skipping auth check')
    } else if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Unauthorized access attempt - no valid auth header')
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    try {
        const id = getRouterParam(event, 'id')
        console.log('Load provider ID:', id)

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required provider ID'
            })
        }

        // Fetch payment history for the load provider
        const payments = await prisma.payment.findMany({
            where: {
                userId: id,
                type: 'PLATFORM_FEE'
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
            select: {
                id: true,
                amount: true,
                method: true,
                status: true,
                createdAt: true,
                description: true
            }
        })

        // Format the payments for the frontend
        return payments.map(payment => ({
            id: payment.id,
            amount: payment.amount,
            method: payment.method.charAt(0).toUpperCase() + payment.method.slice(1), // Capitalize method
            status: payment.status,
            date: payment.createdAt,
            description: payment.description || 'Platform fee payment'
        }))
    } catch (error) {
        console.error('Error fetching load provider payment history:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch payment history'
        })
    }
}) 