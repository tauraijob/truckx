import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, createError, getHeader } from 'h3'
import { calculatePlatformFee } from '~/server/services/payment'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('Fetching upcoming platform fees for truck provider')

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
        console.log('Truck provider ID:', id)

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Missing required provider ID'
            })
        }

        // Fetch the truck provider and their orders
        const provider = await prisma.user.findUnique({
            where: {
                id,
                role: 'TRUCK_PROVIDER'
            },
            select: {
                id: true,
                createdAt: true,
                trucks: {
                    select: {
                        id: true,
                        licensePlate: true,
                        orders: {
                            select: {
                                id: true,
                                platformFee: true,
                                status: true,
                                createdAt: true,
                                completedAt: true,
                                price: true,
                                load: {
                                    select: {
                                        id: true,
                                        title: true
                                    }
                                },
                                payments: {
                                    where: {
                                        type: 'PLATFORM_FEE'
                                    },
                                    select: {
                                        id: true,
                                        amount: true,
                                        status: true,
                                        createdAt: true
                                    }
                                }
                            }
                        }
                    },
                    take: 10
                },
                payments: {
                    where: {
                        type: 'PLATFORM_FEE'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5,
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        createdAt: true,
                        order: {
                            select: {
                                id: true,
                                load: {
                                    select: {
                                        title: true
                                    }
                                }
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

        // Calculate total unpaid platform fees
        let totalUnpaidFees = 0;
        let unpaidOrderCount = 0;

        // Flatten orders from all trucks
        const orders = provider.trucks.flatMap(truck =>
            truck.orders.map(order => ({
                ...order,
                truckLicense: truck.licensePlate
            }))
        );

        // Find unpaid completed orders
        const unpaidOrders = orders.filter(order =>
            (order.status === 'COMPLETED' || order.status === 'DELIVERED') &&
            !order.payments.some(payment => payment.status === 'COMPLETED')
        );

        unpaidOrders.forEach(order => {
            // Calculate proper platform fee using the service function
            const loadPrice = order.load?.price || 0;
            const platformFee = calculatePlatformFee(loadPrice);
            totalUnpaidFees += platformFee;
            unpaidOrderCount++;
        });

        // Generate upcoming fees based on unpaid orders
        const upcomingFees = [];

        // If there are unpaid fees, create a current due entry
        if (totalUnpaidFees > 0) {
            // Determine due date: end of current month
            const now = new Date();
            const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

            // Check if it's overdue (past the due date)
            let status = 'Due';
            if (dueDate < now) {
                status = 'Overdue';
            }

            upcomingFees.push({
                id: 'current',
                amount: totalUnpaidFees,
                dueDate: dueDate.toISOString(),
                status,
                description: `Platform fees for ${unpaidOrderCount} completed orders`
            });
        }

        // Add the recent platform fee payments
        provider.payments.forEach(payment => {
            const loadTitle = payment.order?.load?.title || 'Unknown load';

            upcomingFees.push({
                id: payment.id,
                amount: payment.amount,
                dueDate: payment.createdAt,
                status: payment.status === 'COMPLETED' ? 'Paid' :
                    payment.status === 'PENDING' ? 'Due' : 'Failed',
                description: `Platform fee for ${loadTitle}`
            });
        });

        return upcomingFees;
    } catch (error) {
        console.error('Error fetching upcoming fees:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch upcoming fees'
        })
    }
}) 