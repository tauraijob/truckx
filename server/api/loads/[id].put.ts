import { processImages, createApiHandler } from '~/server/utils/api-imports'
import type { PrismaClient } from '@prisma/client'

export default createApiHandler(async (event, db) => {
    // Get user ID from auth context
    const userId = event.context.auth.userId
    const userRole = event.context.auth.role

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    // Verify user is a load provider
    if (userRole !== 'LOAD_PROVIDER') {
        throw createError({
            statusCode: 403,
            message: 'Only load providers can update loads'
        })
    }

    // Get load ID from route params
    const id = event.context.params?.id

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Load ID is required'
        })
    }

    // Get load
    const load = await db.load.findUnique({
        where: { id }
    })

    if (!load) {
        throw createError({
            statusCode: 404,
            message: 'Load not found'
        })
    }

    // Check if user is the owner of the load
    if (load.providerId !== userId) {
        throw createError({
            statusCode: 403,
            message: 'You do not have permission to update this load'
        })
    }

    // Get request body
    const body = await readBody(event)
    console.log('Received load update request:', {
        ...body,
        featuredImage: body.featuredImage ? '[BASE64_IMAGE]' : null,
        galleryImages: body.galleryImages ? `${body.galleryImages.length} images` : null
    })

    const {
        title,
        description,
        weight,
        volume,
        pickupLocation,
        deliveryLocation,
        distance,
        price,
        type,
        specifications,
        featuredImage,
        galleryImages
    } = body

    // Validate required fields
    if (!title || !description || !weight || !volume || !pickupLocation ||
        !deliveryLocation || !distance || !price || !type) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields'
        })
    }

    // Process images (handle both base64 and URLs)
    let processedImages: string[] = []

    if (featuredImage) {
        // If we have a featured image, add it as the first image
        console.log('Processing featured image for load update')
        processedImages = await processImages([featuredImage])
    }

    if (galleryImages && galleryImages.length > 0) {
        // Add gallery images after featured image
        console.log(`Processing ${galleryImages.length} gallery images for load update`)
        const processedGalleryImages = await processImages(galleryImages)
        processedImages = [...processedImages, ...processedGalleryImages]
    }

    // If no new images were provided, keep existing ones
    if (processedImages.length === 0) {
        // Try to get images from the load object
        if (load.images && typeof load.images === 'object') {
            // @ts-ignore - we know the structure
            processedImages = Array.isArray(load.images) ? load.images : []
        } else if (load.specifications && typeof load.specifications === 'object' &&
            '_images' in load.specifications) {
            // @ts-ignore - we know the structure
            processedImages = load.specifications._images
        }
    }

    // Update load
    const updatedLoad = await db.load.update({
        where: { id },
        data: {
            title,
            description,
            weight: parseFloat(weight.toString()),
            volume: parseFloat(volume.toString()),
            pickupLocation,
            deliveryLocation,
            distance: parseFloat(distance.toString()),
            price: parseFloat(price.toString()),
            type,
            specifications: {
                ...specifications || {},
                // Store images in specifications until migration is applied
                _images: processedImages
            }
            // images field removed until migration is applied
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

    // Add images to the response
    const responseLoad = {
        ...updatedLoad,
        images: processedImages
    }

    return {
        load: responseLoad,
        message: 'Load updated successfully'
    }
}) 