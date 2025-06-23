import { createReadStream, existsSync } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { lookup } from 'mime-types'

export default defineEventHandler(async (event) => {
  try {
    const filePath = getRouterParam(event, 'path')
    
    if (!filePath) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path is required'
      })
    }

    // Construct the full file path
    const uploadsDir = path.join(process.cwd(), 'uploads')
    const fullPath = path.join(uploadsDir, filePath)

    // Security check: ensure the file is within the uploads directory
    if (!fullPath.startsWith(uploadsDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Get file stats
    const fileStats = await stat(fullPath)
    
    if (!fileStats.isFile()) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }

    // Determine content type
    const mimeType = lookup(fullPath) || 'application/octet-stream'
    
    // Set headers
    setHeader(event, 'Content-Type', mimeType)
    setHeader(event, 'Content-Length', fileStats.size.toString())
    setHeader(event, 'Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    
    // Return file stream
    return sendStream(event, createReadStream(fullPath))
  } catch (error) {
    console.error('Error serving file:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to serve file'
    })
  }
})