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

        // Get truck ID from route params
        const id = event.context.params?.id

        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Truck ID is required'
            })
        }

        // Get truck
        const truck = await prisma.truck.findUnique({
            where: { id }
        })

        if (!truck) {
            throw createError({
                statusCode: 404,
                message: 'Truck not found'
            })
        }

        // Check if user is the owner of the truck or an admin or super admin
        if (truck.providerId !== userId && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            throw createError({
                statusCode: 403,
                message: 'You do not have permission to update this truck'
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
            isAvailable,
            currentLocation,
            type,
            name,
            featuredImage,
            galleryImages,
            keepExistingImages
        } = body

        // Check if license plate is already registered by another truck
        if (licensePlate && licensePlate !== truck.licensePlate) {
            const existingTruck = await prisma.truck.findUnique({
                where: { licensePlate }
            })

            if (existingTruck) {
                throw createError({
                    statusCode: 400,
                    message: 'A truck with this license plate already exists'
                })
            }
        }

        // Process images (handle both base64 and URLs)
        let processedImages: string[] = []

        // If keepExistingImages is true and we have either a featuredImage or galleryImages,
        // we want to keep the existing images and add the new ones
        if (keepExistingImages && (featuredImage || (galleryImages && galleryImages.length > 0)) && truck.images.length > 0) {
            processedImages = [...(truck.images as string[])]
        }

        // Add featured image if provided
        if (featuredImage) {
            const processedFeaturedImage = await processImages([featuredImage])
            // If we're keeping existing images and have a new featured image, 
            // replace the first image (the current featured image)
            if (keepExistingImages && processedImages.length > 0) {
                processedImages[0] = processedFeaturedImage[0]
            } else {
                // Otherwise, start fresh with the new featured image
                processedImages = processedFeaturedImage
            }
        }

        // Add gallery images if provided
        if (galleryImages && galleryImages.length > 0) {
            const processedGalleryImages = await processImages(galleryImages)

            if (keepExistingImages) {
                // If keeping existing, append the new gallery images
                // (Skip if we're already over the first image which is the featured image)
                if (processedImages.length > 1) {
                    processedImages = [...processedImages, ...processedGalleryImages]
                } else {
                    processedImages = [...processedImages, ...processedGalleryImages]
                }
            } else if (featuredImage) {
                // If we have a featured image but not keeping existing, we already added the featured
                // so just append gallery images
                processedImages = [...processedImages, ...processedGalleryImages]
            } else {
                // If no featured image and not keeping existing, start fresh with gallery images
                processedImages = processedGalleryImages
            }
        }

        // If no images were processed and we're not keeping existing ones, use the existing images
        if (processedImages.length === 0) {
            processedImages = truck.images as string[]
        }

        // Update truck
        const updatedTruck = await prisma.truck.update({
            where: { id },
            data: {
                make: make || truck.make,
                model: model || truck.model,
                year: year !== undefined ? parseInt(year.toString()) : truck.year,
                capacity: capacity !== undefined ? parseFloat(capacity.toString()) : truck.capacity,
                licensePlate: licensePlate || truck.licensePlate,
                images: processedImages,
                specifications: specifications || truck.specifications,
                isAvailable: isAvailable !== undefined ? isAvailable : truck.isAvailable,
                name: name || truck.name
            }
        })

        return {
            truck: updatedTruck,
            message: 'Truck updated successfully'
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Error updating truck'
        })
    }
}) 