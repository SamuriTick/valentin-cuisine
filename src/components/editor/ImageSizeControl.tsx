'use client'

import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'

interface Props {
  editor: Editor
  onClose: () => void
}

export function ImageSizeControl({ editor, onClose }: Props) {
  const [width, setWidth] = useState(100)
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center')
  const [alt, setAlt] = useState('')

  useEffect(() => {
    const { width: w, alignment: a, alt: al } = editor.getAttributes('customImage')
    if (w) setWidth(parseInt(w))
    if (a) setAlignment(a)
    if (al) setAlt(al)
  }, [editor])

  const updateWidth = (v: number) => {
    setWidth(v)
    editor.chain().focus().updateImageAttributes({ width: String(v) }).run()
  }

  const updateAlignment = (v: 'left' | 'center' | 'right') => {
    setAlignment(v)
    editor.chain().focus().updateImageAttributes({ alignment: v }).run()
  }

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      zIndex: 1000, background: '#fff', border: '1px solid #e8e3dc', borderRadius: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)', padding: 24, width: 340,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>Image settings</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#7A7060' }}>✕</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#7A7060', marginBottom: 8 }}>Width: {width}%</label>
        <input type="range" min={25} max={100} step={5} value={width}
          onChange={e => updateWidth(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#1a1a1a' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#7A7060', marginTop: 4 }}>
          <span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#7A7060', marginBottom: 8 }}>Alignment</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['left', 'center', 'right'] as const).map(a => (
            <button key={a} onClick={() => updateAlignment(a)} style={{
              flex: 1, padding: '8px 0', fontSize: 12, borderRadius: 6, cursor: 'pointer', border: '1px solid',
              borderColor: alignment === a ? '#1a1a1a' : '#e8e3dc',
              background: alignment === a ? '#1a1a1a' : '#fff',
              color: alignment === a ? '#fff' : '#7A7060',
            }}>{a}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#7A7060', marginBottom: 8 }}>Alt text</label>
        <input value={alt} onChange={e => setAlt(e.target.value)}
          onBlur={() => editor.chain().focus().updateImageAttributes({ alt }).run()}
          placeholder="Describe this image…"
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #e8e3dc', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => { editor.chain().focus().deleteSelection().run(); onClose() }} style={{
          flex: 1, padding: '10px 0', background: '#FEF2F2', color: '#B91C1C',
          border: '1px solid #FECACA', borderRadius: 6, cursor: 'pointer', fontSize: 13,
        }}>Delete</button>
        <button onClick={onClose} style={{
          flex: 1, padding: '10px 0', background: '#1a1a1a', color: '#fff',
          border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13,
        }}>Done</button>
      </div>
    </div>
  )
}
