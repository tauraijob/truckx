import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
    console.log('Test finances endpoint called')

    // Return mock data to debug the frontend
    const mockData = {
        currentBalance: 5000.50,
        totalPaid: 10000.75,
        pendingAmount: 2500.25,
        platformFees: 250.15,
        providerPayments: 9750.60,
        thisMonthTotal: 3500.80,
        transactions: [
            {
                id: 'tx1',
                orderId: 'order1',
                description: 'Payment for Load #1',
                amount: 1200.00,
                status: 'COMPLETED',
                createdAt: new Date().toISOString(),
                orderDetails: {
                    loadName: 'Furniture Delivery',
                    truckName: 'Truck A',
                    providerName: 'Provider X'
                }
            },
            {
                id: 'tx2',
                orderId: 'order2',
                description: 'Payment for Load #2',
                amount: 950.50,
                status: 'PENDING',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                orderDetails: {
                    loadName: 'Electronics Delivery',
                    truckName: 'Truck B',
                    providerName: 'Provider Y'
                }
            }
        ],
        pendingOrders: [
            {
                id: 'po1',
                loadTitle: 'Furniture Load',
                truckInfo: 'Truck A - ABC123',
                amount: 1500.00
            },
            {
                id: 'po2',
                loadTitle: 'Food Delivery',
                truckInfo: 'Truck C - XYZ789',
                amount: 1000.25
            }
        ]
    }

    console.log('Returning mock data:', mockData)

    return mockData
}) 