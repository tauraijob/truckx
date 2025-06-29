import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import path from 'path'
import fs from 'fs'
import { nanoid } from 'nanoid'

// Configure storage to use /uploads
const storage = createStorage({
    driver: fsDriver({ base: './uploads' })
})

// Ensure the upload directory exists (in /uploads)
const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Interface for image metadata
interface UploadedImage {
    url: string
    filename: string
    size: number
    type: string
}

/**
 * Process multiple images (either base64 or URLs) and return their paths
 * This function handles both URL images and base64 images, saving base64 images to the filesystem
 */
export async function processImages(images: string[]): Promise<string[]> {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return []
    }

    // Process each image in parallel and collect the paths
    const imagePromises = images.map(async (image) => {
        try {
            // Skip empty strings or null values
            if (!image) return null

            // If image is already a URL (e.g., from a previous upload), use it as is
            if (image.startsWith('http') || image.startsWith('/uploads') || image.startsWith('/api/uploads')) {
                // Normalize to /api/uploads, but avoid double /api/api/uploads
                return image.replace(/^(\/uploads|\/api\/uploads)/, '/api/uploads')
            }

            // If it's a base64 image, save it to the filesystem
            if (image.startsWith('data:image')) {
                const savedPath = await saveBase64Image(image)
                if (savedPath) {
                    return savedPath
                }
            }
        } catch (error) {
            console.error('Error processing image:', error)
            // Continue with other images even if one fails
        }
        return null
    })

    let imagePaths = (await Promise.all(imagePromises)).filter(Boolean) as string[]

    // If we couldn't process any images, use a default
    if (imagePaths.length === 0) {
        imagePaths.push('/images/truckx-slide.webp')
    }

    return imagePaths
}

/**
 * Save a base64 image to the filesystem and return its public path
 */
async function saveBase64Image(base64String: string): Promise<string> {
    try {
        // Extract the file format and data
        const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/)

        if (!matches || matches.length !== 3) {
            console.error('Invalid base64 image format')
            return ''
        }

        const [, format, data] = matches

        // Generate a unique filename
        const filename = `${nanoid()}.${format}`
        const filePath = `/api/uploads/${filename}`
        const fullPath = path.join(uploadDir, filename)

        // Write the file to disk asynchronously
        await fs.promises.writeFile(fullPath, Buffer.from(data, 'base64'))

        return filePath
    } catch (error) {
        console.error('Error saving base64 image:', error)
        return ''
    }
}

/**
 * Process a single image and return its path
 * @deprecated Use processImages instead
 */
export async function processImage(image: string): Promise<string> {
    const result = await processImages([image])
    return result.length > 0 ? result[0] : ''
}

/**
 * Save multiple base64 images and return their URLs
 * @param base64DataArray Array of base64 encoded image data
 * @returns Array of URLs for the saved images
 */
export async function saveMultipleBase64Images(base64DataArray: string[]): Promise<UploadedImage[]> {
    // Process all images in parallel
    const results = await Promise.all(base64DataArray.map(async (base64Data) => {
        try {
            const url = await saveBase64Image(base64Data)
            return url ? { url, filename: url.split('/').pop() || '', size: Buffer.byteLength(base64Data, 'base64'), type: 'image' } : null
        } catch (error) {
            console.error('Error saving one of the images:', error)
            return null
        }
    }))
    // Filter out any nulls
    return results.filter(Boolean) as UploadedImage[]
}

/**
 * Delete an image from the file system
 * @param url The URL of the image to delete
 * @returns True if successful, false otherwise
 */
export async function deleteImage(url: string): Promise<boolean> {
    try {
        // Extract the filename from the URL
        const filename = url.split('/').pop()
        if (!filename) return false

        const filePath = path.join(uploadDir, filename)

        // Check if file exists
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath)
            return true
        }

        return false
    } catch (error) {
        console.error('Error deleting image:', error)
        return false
    }
}

/**
 * Determine if a URL points to an existing file in the uploads directory
 * @param url The URL to check
 * @returns True if the file exists, false otherwise
 */
export function isExistingUploadedImage(url: string): boolean {
    try {
        // If it's not an uploaded image, return true (to indicate an external URL)
        if (!url.startsWith('/uploads/')) return true

        const filename = url.split('/').pop()
        if (!filename) return false

        const filePath = path.join(uploadDir, filename)
        return fs.existsSync(filePath)
    } catch (error) {
        console.error('Error checking image existence:', error)
        return false
    }
} 