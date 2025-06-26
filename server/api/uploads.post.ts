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
    const uploadDir = path.join(process.cwd(), 'uploads');
    const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

    const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            if (err) reject(err)
            else resolve([fields, files])
        })
    });

    let file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file || !file.filepath) {
        throw createError({ statusCode: 400, message: 'No file uploaded' });
    }

    // Get the original extension
    const ext = path.extname(file.originalFilename || file.newFilename || file.filepath);
    // Generate a new filename with the correct extension
    const newFilename = `${path.basename(file.filepath, path.extname(file.filepath))}${ext}`;
    const newFilePath = path.join(uploadDir, newFilename);

    // Move/rename the file to the new filename (overwrite if exists)
    fs.renameSync(file.filepath, newFilePath);

    return { url: `/api/uploads/${newFilename}` };
}); 