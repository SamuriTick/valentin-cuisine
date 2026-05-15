'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  value: string
  onSave: (v: string) => Promise<void>
  editMode: boolean
  as?: keyof JSX.IntrinsicElements
  className?: string
  style?: React.CSSProperties
  multiline?: boolean
}

export function EditableText({
  value,
  onSave,
  editMode,
  as: Tag = 'span',
  className,
  style,
  multiline = false,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(value)
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null)

  useEffect(() => { setLocal(value) }, [value])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  if (!editMode) {
    return <Tag className={className} style={style}>{value}</Tag>
  }

  if (editing) {
    const sharedStyle: React.CSSProperties = {
      ...style,
      width: '100%',
      background: 'rgba(0,0,0,0.08)',
      border: '2px dashed rgba(0,0,0,0.4)',
      outline: 'none',
      padding: '4px 8px',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      fontStyle: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      color: 'inherit',
      borderRadius: 2,
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { setLocal(value); setEditing(false) }
      if (e.key === 'Enter' && !multiline) { e.preventDefault(); handleSave() }
    }

    const handleSave = async () => {
      setSaving(true)
      await onSave(local)
      setSaving(false)
      setEditing(false)
    }

    return (
      <span style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {multiline ? (
          <textarea
            ref={ref as any}
            value={local}
            onChange={e => setLocal(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ ...sharedStyle, resize: 'vertical', minHeight: 80 }}
            disabled={saving}
          />
        ) : (
          <input
            ref={ref as any}
            type="text"
            value={local}
            onChange={e => setLocal(e.target.value)}
            onKeyDown={handleKeyDown}
            style={sharedStyle}
            disabled={saving}
          />
        )}
        <span style={{ position: 'absolute', bottom: -28, left: 0, display: 'flex', gap: 4, zIndex: 10 }}>
          <button
            onClick={() => { setLocal(value); setEditing(false) }}
            style={{ padding: '2px 8px', fontSize: 11, background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '2px 8px', fontSize: 11, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer' }}
          >
            {saving ? '…' : 'Save'}
          </button>
        </span>
      </span>
    )
  }

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', width: '100%', cursor: 'pointer' }}
      className="group"
      onClick={() => setEditing(true)}
    >
      <Tag className={className} style={style}>{value}</Tag>
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.06)', border: '2px dashed rgba(0,0,0,0.3)',
        opacity: 0, transition: 'opacity 0.15s', borderRadius: 2,
      }} className="group-hover:!opacity-100">
        <span style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 2, letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif", fontStyle: 'normal', fontWeight: 700 }}>
          Edit
        </span>
      </span>
    </span>
  )
}
