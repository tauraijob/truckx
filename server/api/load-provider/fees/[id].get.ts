import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, createError, getHeader } from 'h3'
import { calculatePlatformFee } from '~/server/services/payment'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('Fetching outstanding fees for load provider')

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

        // Fetch the load provider with their outstanding fees and orders
        const provider = await prisma.user.findUnique({
            where: {
                id,
                role: 'LOAD_PROVIDER'
            },
            select: {
                id: true,
                outstandingFees: true,
                _count: {
                    select: {
                        loads: true
                    }
                },
                payments: {
                    where: {
                        type: 'PLATFORM_FEE'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    select: {
                        createdAt: true
                    }
                },
                // Get completed orders to calculate accurate platform fees
                loadProviderOrders: {
                    where: {
                        status: {
                            in: ['COMPLETED', 'DELIVERED']
                        },
                        // Get orders where platform fee payment hasn't been made
                        payments: {
                            none: {
                                type: 'PLATFORM_FEE',
                                status: 'COMPLETED'
                            }
                        }
                    },
                    include: {
                        load: {
                            select: {
                                price: true
                            }
                        }
                    }
                }
            }
        })

        if (!provider) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Provider not found'
            })
        }

        // Calculate the actual outstanding fees based on completed orders
        let calculatedOutstandingFees = 0
        if (provider.loadProviderOrders && provider.loadProviderOrders.length > 0) {
            calculatedOutstandingFees = provider.loadProviderOrders.reduce((total, order) => {
                // Use the proper platform fee calculation from payment service
                const loadPrice = order.load?.price || 0
                const platformFee = calculatePlatformFee(loadPrice)
                return total + platformFee
            }, 0)
        }

        // Use calculated fees or fall back to the saved outstandingFees field
        const outstandingAmount = calculatedOutstandingFees > 0
            ? calculatedOutstandingFees
            : provider.outstandingFees || 0

        // Calculate status based on amount and time since last payment
        let status = 'Paid'
        if (outstandingAmount > 0) {
            status = 'Due'

            // Check if it's overdue (more than 30 days since last payment)
            const lastPaymentDate = provider.payments.length > 0
                ? new Date(provider.payments[0].createdAt)
                : null

            if (lastPaymentDate) {
                const thirtyDaysAgo = new Date()
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

                if (lastPaymentDate < thirtyDaysAgo) {
                    status = 'Overdue'
                }
            }
        }

        return {
            id: provider.id,
            outstandingAmount,
            loadsCount: provider._count.loads,
            lastPaymentDate: provider.payments.length > 0 ? provider.payments[0].createdAt : null,
            status,
            completedOrdersCount: provider.loadProviderOrders?.length || 0
        }
    } catch (error) {
        console.error('Error fetching load provider fees:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch fee information'
        })
    }
}) 