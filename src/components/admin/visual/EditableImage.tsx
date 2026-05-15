'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface CropPosition { x: number; y: number; zoom: number }
const DEFAULT_CROP: CropPosition = { x: 50, y: 50, zoom: 1 }

// ─── Media picker ─────────────────────────────────────────────────────────────
export function MediaPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = useState<{ id: number; url?: string; filePath?: string; filename: string }[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/media?fileType=image&limit=48')
      .then(r => r.ok ? r.json() : { items: [] })
      .then(d => setImages(d.items ?? d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function upload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/media', { method: 'POST', body: fd })
    if (res.ok) {
      const item = await res.json()
      onSelect(item.filePath ?? item.url ?? item.filename)
    }
    setUploading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 12, width: '90%', maxWidth: 700, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8e3dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontSize: 15 }}>Choose photo</strong>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #e8e3dc' }}>
          <label style={{ fontSize: 13, color: '#b03060', fontWeight: 600, cursor: uploading ? 'default' : 'pointer' }}>
            {uploading ? 'Uploading…' : '+ Upload new photo'}
            {!uploading && (
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }} />
            )}
          </label>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
          {images.map(img => {
            const src = img.url ?? img.filePath ?? img.filename
            return (
              <button key={img.id} onClick={() => onSelect(src)} style={{
                border: '2px solid transparent', borderRadius: 6, overflow: 'hidden',
                padding: 0, cursor: 'pointer', background: '#f4f1ed', aspectRatio: '1',
              }}>
                <img src={src} alt={img.filename} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            )
          })}
          {images.length === 0 && !uploading && (
            <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
              No photos yet. Upload one above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── EditableImage ─────────────────────────────────────────────────────────────
interface Props {
  src: string
  alt: string
  className?: string
  editMode: boolean
  crop?: CropPosition
  onSave: (url: string) => Promise<void>
  onCropSave?: (crop: CropPosition) => Promise<void>
}

export function EditableImage({ src, alt, className, editMode, crop = DEFAULT_CROP, onSave, onCropSave }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [cropping, setCropping] = useState(false)
  const [localCrop, setLocalCrop] = useState<CropPosition>(crop)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setLocalCrop(crop) }, [crop.x, crop.y, crop.zoom])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100
    setLocalCrop(p => ({
      ...p,
      x: Math.max(0, Math.min(100, p.x - dx)),
      y: Math.max(0, Math.min(100, p.y - dy)),
    }))
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const objectPosition = `${localCrop.x}% ${localCrop.y}%`
  const imgStyle: React.CSSProperties = {
    objectPosition,
    transform: localCrop.zoom > 1 ? `scale(${localCrop.zoom})` : undefined,
    transformOrigin: `${localCrop.x}% ${localCrop.y}%`,
    pointerEvents: 'none',
    transition: isDragging ? 'none' : 'object-position 0.1s',
  }

  if (!editMode) {
    return (
      <img
        src={src} alt={alt} className={className}
        style={{ objectPosition: `${crop.x}% ${crop.y}%`, transform: crop.zoom > 1 ? `scale(${crop.zoom})` : undefined, transformOrigin: `${crop.x}% ${crop.y}%` }}
      />
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      >
        <img src={src} alt={alt} className={className} style={{ ...imgStyle, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />

        {/* Crop mode overlay */}
        {cropping && (
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', border: '3px dashed rgba(176,48,96,0.8)', zIndex: 10, cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={e => { e.preventDefault(); setIsDragging(true); setDragStart({ x: e.clientX, y: e.clientY }) }}
          >
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 12, padding: '4px 14px', borderRadius: 4 }}>
              Drag to reposition
            </div>

            {/* Zoom slider */}
            <div style={{ position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}
              onMouseDown={e => e.stopPropagation()}
            >
              <span style={{ color: '#fff', fontSize: 11 }}>Zoom</span>
              <input type="range" min={100} max={300} value={localCrop.zoom * 100}
                onChange={e => setLocalCrop(p => ({ ...p, zoom: parseInt(e.target.value) / 100 }))}
                style={{ width: 100 }}
              />
              <span style={{ color: '#fff', fontSize: 11, width: 36 }}>{Math.round(localCrop.zoom * 100)}%</span>
            </div>

            {/* Controls */}
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}
              onMouseDown={e => e.stopPropagation()}
            >
              <button onClick={() => setLocalCrop(DEFAULT_CROP)} style={{ padding: '4px 12px', fontSize: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, cursor: 'pointer' }}>
                Reset
              </button>
              <button onClick={() => { setLocalCrop(crop); setCropping(false) }} style={{ padding: '4px 12px', fontSize: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={async () => { setSaving(true); await onCropSave?.(localCrop); setSaving(false); setCropping(false) }}
                style={{ padding: '4px 14px', fontSize: 12, background: 'rgba(176,48,96,0.9)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
              >
                {saving ? '…' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {/* Edit buttons (when not in crop mode) */}
        {!cropping && (
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, display: 'flex', gap: 6 }}>
            <button onClick={() => setCropping(true)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
              Reposition
            </button>
            <button onClick={() => setShowPicker(true)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, background: 'rgba(176,48,96,0.9)', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
              Change photo
            </button>
          </div>
        )}
      </div>

      {showPicker && (
        <MediaPicker
          onSelect={async url => { setShowPicker(false); setSaving(true); await onSave(url); setSaving(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}
