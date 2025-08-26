import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize R2 client (R2 is S3-compatible)
const r2Client = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || ''
const PUBLIC_URL = process.env.R2_PUBLIC_URL || ''

// Check if R2 is properly configured
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  )
}

/**
 * Upload a file to R2
 * @param key - The key (path) for the file in R2
 * @param buffer - The file buffer
 * @param contentType - MIME type of the file
 * @param metadata - Optional metadata for the file
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<{ key: string; url: string }> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured. Please set R2 environment variables.')
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    Metadata: metadata,
    // Make files publicly accessible if you have configured public access
    // ACL: 'public-read', // Uncomment if your bucket allows public ACL
  })

  await r2Client.send(command)

  // Return the public URL if configured, otherwise generate a signed URL
  const url = PUBLIC_URL 
    ? `${PUBLIC_URL}/${key}`
    : await getSignedUrl(r2Client, new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }), { expiresIn: 3600 * 24 * 7 }) // 7 days expiry for signed URLs

  return { key, url }
}

/**
 * Delete a file from R2
 * @param key - The key (path) of the file to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured. Please set R2 environment variables.')
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await r2Client.send(command)
}

/**
 * Get a signed URL for temporary access to a private file
 * @param key - The key (path) of the file
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function getSignedUrlFromR2(key: string, expiresIn: number = 3600): Promise<string> {
  if (!isR2Configured()) {
    throw new Error('R2 storage is not configured. Please set R2 environment variables.')
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}

/**
 * Generate a unique key for uploaded files
 * @param filename - Original filename
 * @param folder - Optional folder path
 */
export function generateR2Key(filename: string, folder: string = 'uploads'): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  return `${folder}/${timestamp}_${randomString}_${sanitizedFilename}`
}

/**
 * Convert old R2 signed URLs to public CDN URLs
 */
export function convertToPublicUrl(url: string): string | null {
  if (!url || !PUBLIC_URL) return null
  
  // Check if it's an R2 signed URL
  if (url.includes('r2.cloudflarestorage.com')) {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      // Get the key from the path (usually after the bucket name)
      const key = pathParts.slice(2).join('/')
      if (key) {
        const baseUrl = PUBLIC_URL.endsWith('/') ? PUBLIC_URL.slice(0, -1) : PUBLIC_URL
        return `${baseUrl}/${key}`
      }
    } catch (e) {
      console.error('Error parsing R2 URL:', e)
    }
  }
  
  return null
}

/**
 * Extract the key from an R2 URL
 * @param url - The full R2 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  if (!url) return null
  
  // Handle public URL format
  if (PUBLIC_URL && url.startsWith(PUBLIC_URL)) {
    return url.replace(PUBLIC_URL + '/', '')
  }
  
  // Handle signed URL format (contains the key in the path)
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    if (pathParts.length > 2) {
      return pathParts.slice(2).join('/') // Skip bucket name
    }
  } catch (e) {
    console.error('Failed to extract key from URL:', e)
  }
  
  return null
}