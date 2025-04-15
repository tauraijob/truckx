import { prisma } from '#imports'
import { processImages } from '../../utils/image-upload'

export default defineEventHandler(async (event) => {
    try {
        // Get user ID from auth context
        const userId = event.context.auth.userId
        const userRole = event.context.auth.role

        if (!userId) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized'
            })
        }

        // Check if user is a truck provider
        if (userRole !== 'TRUCK_PROVIDER') {
            throw createError({
                statusCode: 403,
                message: 'Only truck providers can create trucks'
            })
        }

        // Get request body
        const body = await readBody(event)
        const {
            make,
            model,
            year,
            capacity,
            licensePlate,
            specifications,
            currentLocation,
            type,
            name,
            featuredImage,
            galleryImages
        } = body

        // Validate required fields
        if (!make || !model || !year || !capacity || !licensePlate) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields'
            })
        }

        // Check if license plate is already registered
        const existingTruck = await prisma.truck.findUnique({
            where: { licensePlate }
        })

        if (existingTruck) {
            return {
                success: false,
                exists: true,
                message: 'A truck with this license plate already exists',
                existingTruck: {
                    id: existingTruck.id,
                    make: existingTruck.make,
                    model: existingTruck.model,
                    licensePlate: existingTruck.licensePlate,
                    year: existingTruck.year,
                }
            }
        }

        // Process images (handle both base64 and URLs)
        let processedImages: string[] = []

        if (featuredImage) {
            // If we have a featured image, add it as the first image
            processedImages = await processImages([featuredImage])
        }

        if (galleryImages && galleryImages.length > 0) {
            // Add gallery images after featured image
            const processedGalleryImages = await processImages(galleryImages)
            processedImages = [...processedImages, ...processedGalleryImages]
        }

        // If no images were provided, use default images
        if (processedImages.length === 0) {
            processedImages = ['/images/truckx-slide.webp']
        }

        // Create truck
        const truck = await prisma.truck.create({
            data: {
                make,
                model,
                year: parseInt(year.toString()),
                capacity: parseFloat(capacity.toString()),
                licensePlate,
                specifications: specifications || {},
                providerId: userId,
                isAvailable: true,
                images: processedImages
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true
                    }
                }
            }
        })

        return {
            truck,
            message: 'Truck created successfully'
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error creating truck'
        })
    }
}) 