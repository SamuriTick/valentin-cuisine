"use client"

import { useState, useRef } from "react"
import { validateImageFile, formatFileSize, extractImageMetadata } from "@/lib/image-utils"

interface MediaItem {
  id: number
  filename: string
  originalName: string
  filePath: string
  fileType: string
  fileSize: number | null
  altText: string | null
  caption: string | null
  uploadedAt: string
}

interface FileUploadProps {
  onFileSelect: (file: MediaItem) => void
  currentImage?: string | null
  label?: string
  accept?: string
  showMediaLibrary?: boolean
}

export default function FileUpload({ 
  onFileSelect, 
  currentImage, 
  label = "Upload Image",
  accept = "image/*",
  showMediaLibrary = true
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    await uploadFile(file)
    
    // Clean up preview URL after upload
    URL.revokeObjectURL(objectUrl)
    setPreviewUrl(null)
  }

  const uploadFile = async (file: File, altText = "", caption = "") => {
    console.log('[FileUpload] Starting upload for:', file.name, 'Size:', file.size)
    // Validate file before upload
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      console.error('[FileUpload] Validation failed:', validation.error)
      alert(`Upload failed: ${validation.error}`)
      return
    }
    console.log('[FileUpload] File validation passed')

    setUploading(true)
    
    try {
      // Extract metadata for better alt text if none provided
      const metadata = await extractImageMetadata(file)
      const finalAltText = altText || `Image: ${metadata.name}`
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', finalAltText)
      formData.append('caption', caption)
      console.log('[FileUpload] FormData prepared, sending to API')

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })
      console.log('[FileUpload] Response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Upload failed'
        try {
          const error = await response.json()
          errorMessage = error.detail ? `${error.error}: ${error.detail}` : (error.error || errorMessage)
          console.error('[FileUpload] API error response:', error)
        } catch (e) {
          // Response is not JSON (likely HTML error page)
          console.error('[FileUpload] Failed to parse error response, likely HTML:', e)
          if (response.status === 401) {
            errorMessage = 'Unauthorized. Please log in to upload files.'
          } else if (response.status === 413) {
            errorMessage = 'File too large'
          } else {
            errorMessage = `Upload failed (${response.status})`
          }
        }
        throw new Error(errorMessage)
      }

      const mediaItem = await response.json()
      console.log('[FileUpload] Upload successful:', mediaItem)
      onFileSelect(mediaItem)
    } catch (error) {
      console.error('[FileUpload] Error uploading file:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      console.log('[FileUpload] Upload process completed')
    }
  }

  const loadMediaLibrary = async () => {
    if (mediaItems.length > 0) {
      setShowLibrary(true)
      return
    }

    setLoadingLibrary(true)
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const items = await response.json()
        setMediaItems(items)
        setShowLibrary(true)
      }
    } catch (error) {
      console.error('Error loading media library:', error)
    } finally {
      setLoadingLibrary(false)
    }
  }

  const selectFromLibrary = (item: MediaItem) => {
    onFileSelect(item)
    setShowLibrary(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Create preview URL for dropped file
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      
      uploadFile(file).then(() => {
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(null)
      })
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Current Image Preview */}
      {(currentImage || previewUrl) && (
        <div className="relative inline-block">
          <img
            src={previewUrl || currentImage || ''}
            alt={previewUrl ? "Preview" : "Current"}
            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
          />
          {previewUrl && (
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-medium">Preview</span>
            </div>
          )}
          {!previewUrl && currentImage && (
            <button
              type="button"
              onClick={() => onFileSelect({ filePath: '' } as MediaItem)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Drop an image here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-500 font-medium"
                disabled={uploading}
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP, SVG up to 5MB</p>
          </div>
        </div>

        {uploading && (
          <div className="mt-4 space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Library Button */}
      {showMediaLibrary && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={loadMediaLibrary}
            disabled={loadingLibrary}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingLibrary ? 'Loading...' : 'Choose from Library'}
          </button>
        </div>
      )}

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectFromLibrary(item)}
                  className="relative cursor-pointer group border border-gray-200 rounded-lg overflow-hidden hover:border-primary-500"
                >
                  <img
                    src={item.filePath}
                    alt={item.altText || item.originalName}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.originalName}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mediaItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No images uploaded yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}