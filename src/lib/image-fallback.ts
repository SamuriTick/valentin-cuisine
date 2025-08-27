/**
 * Image fallback utilities for handling missing uploaded images
 */

/**
 * Fix CDN URLs that are missing the /uploads/ prefix
 */
export function fixCdnUrl(url: string | null): string | null {
  if (!url) return url
  
  if (url.includes('cdn.chartedconsultants.com') && !url.includes('/uploads/')) {
    // Extract filename and add /uploads/ prefix
    const filename = url.split('/').pop()
    return `https://cdn.chartedconsultants.com/uploads/${filename}`
  }
  return url
}

/**
 * Check if an uploaded image exists on disk or is an R2 URL
 * Note: This function only works on the server side for local files
 */
export function imageExists(imagePath: string): boolean {
  if (typeof window !== 'undefined') {
    // Client-side: assume image exists, will handle errors in component
    return true
  }
  
  // If it's an R2 URL (starts with http/https), assume it exists
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return true
  }
  
  // Only check local files that start with /uploads/
  if (!imagePath || !imagePath.startsWith('/uploads/')) {
    return false
  }
  
  try {
    const fs = require('fs')
    const path = require('path')
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    const exists = fs.existsSync(fullPath)
    // Reduce logging to avoid spam
    if (!exists) {
      console.log('[Image Fallback] Missing local file:', imagePath)
    }
    return exists
  } catch (error) {
    console.error('[Image Fallback] Error checking image existence:', error)
    return false
  }
}

/**
 * Get a fallback image path for facility images
 */
export function getFacilityFallbackImage(facilityName?: string | null): string {
  const facilityFallbacks: Record<string, string> = {
    'main hall': '/img/80-chairs.jpeg',
    'small hall': '/img/entrance.jpeg', 
    'kitchen': '/img/kitchen.jpeg',
    'default': '/img/80-chairs.jpeg'
  }
  
  if (!facilityName) return facilityFallbacks.default!
  
  const key = facilityName.toLowerCase()
  
  for (const [name, image] of Object.entries(facilityFallbacks)) {
    if (key.includes(name)) {
      return image
    }
  }
  
  return facilityFallbacks.default!
}

/**
 * Get a fallback image path for program images
 */
export function getProgramFallbackImage(programName?: string | null): string {
  const programFallbacks: Record<string, string> = {
    'stay': '/img/poster-stayandplay.jpeg',
    'play': '/img/poster-stayandplay.jpeg',
    'taekwondo': '/img/poster-taekwondo.jpeg',
    'judo': '/img/poster-judo.jpeg',
    'kumon': '/img/poster-kumon.jpeg',
    'zumba': '/img/poster-zumba.jpeg',
    'fitness': '/img/poster-poundfitness.jpeg',
    'pound': '/img/poster-poundfitness.jpeg',
    'knit': '/img/poster-knitandchat.jpeg',
    'chat': '/img/poster-knitandchat.jpeg',
    'japanese': '/img/poster-japanesegcse.jpeg',
    'english': '/img/poster-englishlessforjapanese.jpeg',
    'default': '/img/poster-stayandplay.jpeg'
  }
  
  if (!programName) return programFallbacks.default!
  
  const key = programName.toLowerCase()
  
  for (const [name, image] of Object.entries(programFallbacks)) {
    if (key.includes(name)) {
      return image
    }
  }
  
  return programFallbacks.default!
}

/**
 * Process facility image URL, replacing non-existent uploads with fallbacks
 */
export function processFacilityImage(imageUrl: string | null, facilityName?: string): string | null {
  console.log(`[processFacilityImage] Processing imageUrl: "${imageUrl}" for facility: "${facilityName}"`)
  
  // If no image URL provided, return fallback
  if (!imageUrl) {
    const fallback = getFacilityFallbackImage(facilityName)
    console.log(`[processFacilityImage] No imageUrl, using fallback: "${fallback}"`)
    return fallback
  }
  
  // Fix CDN URLs if needed
  imageUrl = fixCdnUrl(imageUrl)
  console.log(`[processFacilityImage] After fixCdnUrl: "${imageUrl}"`)
  
  // If it's an R2 URL (http/https), return as is
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    console.log(`[processFacilityImage] Returning HTTPS URL as-is: "${imageUrl}"`)
    return imageUrl
  }
  
  // If it's not an upload path, return as is (assumes it's a static image)
  if (imageUrl && !imageUrl.startsWith('/uploads/')) {
    return imageUrl
  }
  
  // Check if uploaded image exists
  if (imageUrl && imageExists(imageUrl)) {
    return imageUrl
  }
  
  // If uploaded image doesn't exist, return fallback
  const fallback = getFacilityFallbackImage(facilityName)
  console.error(`[processFacilityImage] Upload missing for facility '${facilityName}' at ${imageUrl}, using fallback: ${fallback}`)
  return fallback
}

/**
 * Process program image URL, replacing non-existent uploads with fallbacks
 */
export function processProgramImage(imageUrl: string | null, programName?: string): string | null {
  // If no image URL provided, return fallback
  if (!imageUrl) {
    const fallback = getProgramFallbackImage(programName)
    return fallback
  }
  
  // Fix CDN URLs if needed
  imageUrl = fixCdnUrl(imageUrl)
  
  // If it's an R2 URL (http/https), return as is
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl
  }
  
  // If it's not an upload path, return as is (assumes it's a static image)
  if (imageUrl && !imageUrl.startsWith('/uploads/')) {
    return imageUrl
  }
  
  // Check if uploaded image exists
  if (imageUrl && imageExists(imageUrl)) {
    return imageUrl
  }
  
  // If uploaded image doesn't exist, return fallback
  const fallback = getProgramFallbackImage(programName)
  console.warn(`[Image Fallback] Upload missing for program '${programName}' at ${imageUrl}, using fallback:`, fallback)
  return fallback
}