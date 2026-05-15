'use client'

import { useState } from 'react'
import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
  onClose: () => void
}

interface MediaItem {
  id: number
  filePath: string
  originalName: string
  altText: string | null
  fileType: string
}

export function ImageUploadWidget({ editor, onClose }: Props) {
  const [tab, setTab] = useState<'upload' | 'library' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  const [library, setLibrary] = useState<MediaItem[]>([])
  const [loadingLib, setLoadingLib] = useState(false)

  const insert = (src: string, alt = '') => {
    editor.chain().focus().setImage({ src, alt, width: '100', alignment: 'center' }).run()
    onClose()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('altText', '')
      const res = await fetch('/api/media', { method: 'POST', body: fd })
      if (res.ok) {
        const item = await res.json()
        insert(item.filePath, item.altText || item.originalName)
      }
    } finally {
      setUploading(false)
    }
  }

  const loadLibrary = async () => {
    if (library.length) return
    setLoadingLib(true)
    try {
      const res = await fetch('/api/media')
      if (res.ok) {
        const items = await res.json()
        setLibrary(items.filter((i: MediaItem) => i.fileType === 'image'))
      }
    } finally {
      setLoadingLib(false)
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none',
    borderBottom: active ? '2px solid #1a1a1a' : '2px solid transparent',
    color: active ? '#1a1a1a' : '#7A7060', fontWeight: active ? 600 : 400,
  })

  return (
    <div style={{
      position: 'absolute', top: 8, left: 8, right: 8, zIndex: 50,
      background: '#fff', border: '1px solid #e8e3dc', borderRadius: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: 20,
    }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e8e3dc', marginBottom: 16 }}>
        <button style={tabStyle(tab === 'upload')} onClick={() => setTab('upload')}>Upload</button>
        <button style={tabStyle(tab === 'library')} onClick={() => { setTab('library'); loadLibrary() }}>Library</button>
        <button style={tabStyle(tab === 'url')} onClick={() => setTab('url')}>URL</button>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#7A7060', fontSize: 18 }}>✕</button>
      </div>

      {tab === 'upload' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <input type="file" accept="image/*" onChange={handleUpload} id="img-upload" style={{ display: 'none' }} />
          <label htmlFor="img-upload" style={{
            display: 'inline-block', padding: '10px 24px', background: '#1a1a1a', color: '#fff',
            borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            {uploading ? 'Uploading…' : 'Choose image'}
          </label>
          <p style={{ fontSize: 12, color: '#7A7060', marginTop: 10 }}>JPG, PNG, WebP — max 5MB</p>
        </div>
      )}

      {tab === 'library' && (
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {loadingLib ? (
            <p style={{ textAlign: 'center', color: '#7A7060', fontSize: 13 }}>Loading…</p>
          ) : library.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#7A7060', fontSize: 13 }}>No images yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {library.map(item => (
                <button key={item.id} onClick={() => insert(item.filePath, item.altText || item.originalName)}
                  style={{ border: '1px solid #e8e3dc', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', padding: 0, aspectRatio: '1', background: '#F7F5F0' }}>
                  <img src={item.filePath} alt={item.altText || item.originalName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'url' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #e8e3dc', borderRadius: 6, fontSize: 13 }}
          />
          <button onClick={() => url && insert(url)} style={{
            padding: '8px 16px', background: '#1a1a1a', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>Insert</button>
        </div>
      )}
    </div>
  )
}
