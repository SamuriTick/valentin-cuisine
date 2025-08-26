'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string
  fallback?: string
  onError?: () => void
}

/**
 * Enhanced Image component that automatically handles R2 URLs and external images
 * This component provides a long-term solution for image optimization across the app
 */
export default function OptimizedImage({ src, fallback, onError, ...props }: OptimizedImageProps) {
  // Fix CDN URLs that are missing the /uploads/ prefix
  const fixCdnUrl = (url: string): string => {
    if (url?.includes('cdn.chartedconsultants.com') && !url.includes('/uploads/')) {
      // Extract filename and add /uploads/ prefix
      const filename = url.split('/').pop()
      return `https://cdn.chartedconsultants.com/uploads/${filename}`
    }
    return url
  }
  
  const [imgSrc, setImgSrc] = useState(fixCdnUrl(src))
  const [hasError, setHasError] = useState(false)
  
  // Check if the image is from R2 or external source
  const isExternalImage = imgSrc?.startsWith('http://') || imgSrc?.startsWith('https://')
  const isR2PrivateBucket = imgSrc?.includes('r2.cloudflarestorage.com')
  const isCDN = imgSrc?.includes('cdn.chartedconsultants.com')
  
  // For CDN images and local images, we CAN optimize
  // For R2 private bucket signed URLs, we CANNOT optimize (they expire)
  const shouldOptimize = !isR2PrivateBucket && (isCDN || !isExternalImage)
  
  // Add error handling for broken images
  const handleError = () => {
    console.warn(`Failed to load image: ${imgSrc}`)
    setHasError(true)
    
    if (fallback && !hasError) {
      setImgSrc(fixCdnUrl(fallback))
      return
    }
    
    if (onError) {
      onError()
    }
  }
  
  return (
    <Image
      {...props}
      src={imgSrc}
      onError={handleError}
      unoptimized={!shouldOptimize}
      priority={props.priority || false}
      alt={props.alt || 'Image'}
    />
  )
}