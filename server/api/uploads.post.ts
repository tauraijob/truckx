import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
    api: {
        bodyParser: false
    }
}

export const skipAuth = true;

export default defineEventHandler(async (event) => {
    const form = formidable({ multiples: false, uploadDir: path.join(process.cwd(), 'public', 'images'), keepExtensions: true })
    const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            if (err) reject(err)
            else resolve([fields, files])
        })
    })

    const fileField = files.file
    let file
    if (Array.isArray(fileField)) {
        file = fileField[0]
    } else {
        file = fileField
    }
    if (!file || !file.filepath) {
        console.error('Upload error: files object:', files)
        throw createError({ statusCode: 400, message: 'No file uploaded' })
    }

    // Move file to /uploads and return the URL
    const filename = path.basename(file.filepath)
    return { url: `/images/${filename}` }
}) 