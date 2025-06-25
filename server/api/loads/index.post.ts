import { processImages, createApiHandler } from '~/server/utils/api-imports'
import type { PrismaClient } from '@prisma/client'

const devLog = (...args: any[]) => { if (process.env.NODE_ENV !== 'production') console.log(...args) }

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
            message: 'Only load providers can create loads'
        })
    }

    // Get request body
    const body = await readBody(event)
    devLog('Received load creation request:', {
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
        devLog('Missing required fields in load creation', {
            title, description, weight, volume, pickupLocation,
            deliveryLocation, distance, price, type
        })
        throw createError({
            statusCode: 400,
            message: 'Missing required fields'
        })
    }

    // Limit the number of images to prevent memory issues
    const MAX_IMAGES = 10
    let featuredImageLimited = featuredImage ? [featuredImage] : []
    let galleryImagesLimited = Array.isArray(galleryImages) ? galleryImages.slice(0, MAX_IMAGES - featuredImageLimited.length) : []

    // Process images (handle both base64 and URLs)
    let processedImages: string[] = []

    if (featuredImageLimited.length > 0) {
        // If we have a featured image, add it as the first image
        devLog('Processing featured image for load')
        processedImages = await processImages(featuredImageLimited)
    }

    if (galleryImagesLimited.length > 0) {
        // Add gallery images after featured image
        devLog(`Processing ${galleryImagesLimited.length} gallery images for load`)
        const processedGalleryImages = await processImages(galleryImagesLimited)
        processedImages = [...processedImages, ...processedGalleryImages]
    }

    // If no images were provided, use default images
    if (processedImages.length === 0) {
        processedImages = ['/images/load-default.webp']
    }

    // Create load
    const load = await db.load.create({
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
            },
            providerId: userId,
            isAvailable: true
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

    // Add images to the response for client-side use
    const responseLoad = {
        ...load,
        images: processedImages
    }

    devLog('Load created successfully:', load.id)

    return {
        load: responseLoad,
        message: 'Load created successfully'
    }
}) 