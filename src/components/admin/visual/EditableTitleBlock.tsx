'use client'

import { useState, useEffect, useRef } from 'react'

// "Anyone can cook,\nbut only the\n*fearless* can be great"
// Words wrapped in *asterisks* get the highlight style.

interface Token { word: string; highlighted: boolean; isSpace: boolean }

function tokenise(text: string): Token[] {
  return text.split(/(\s+)/g).map(chunk => {
    if (/^\s+$/.test(chunk)) return { word: chunk, highlighted: false, isSpace: true }
    const highlighted = chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2
    return { word: highlighted ? chunk.slice(1, -1) : chunk, highlighted, isSpace: false }
  })
}

function tokensToText(tokens: Token[]): string {
  return tokens.map(t => t.isSpace ? t.word : t.highlighted ? `*${t.word}*` : t.word).join('')
}

function toggleWord(text: string, wordIndex: number): string {
  const tokens = tokenise(text)
  let wi = 0
  const next = tokens.map(t => {
    if (t.isSpace) return t
    const isTarget = wi++ === wordIndex
    if (isTarget) return { ...t, highlighted: !t.highlighted }
    return t
  })
  return tokensToText(next)
}

interface Props {
  rawText: string // full title with \n line breaks and *markers*
  editMode: boolean
  onSave: (raw: string) => Promise<void>
  renderLine: (parts: { text: string; highlighted: boolean }[], lineIndex: number) => React.ReactNode
}

export function EditableTitleBlock({ rawText, editMode, onSave, renderLine }: Props) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState(rawText)
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setLocal(rawText) }, [rawText])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  // Parse for rendering
  function parseLines(raw: string) {
    return raw.split('\n').map(line =>
      line.split(/(\*[^*]+\*)/g).map(part => ({
        text: part.replace(/\*/g, ''),
        highlighted: part.startsWith('*') && part.endsWith('*'),
      }))
    )
  }

  async function handleSave() {
    setSaving(true)
    await onSave(local)
    setSaving(false)
    setEditing(false)
  }

  function handleCancel() {
    setLocal(rawText)
    setEditing(false)
  }

  if (!editMode) {
    return <>{parseLines(rawText).map((parts, i) => renderLine(parts, i))}</>
  }

  if (editing) {
    const tokens = tokenise(local)
    let wordIdx = 0

    return (
      <div style={{ width: '100%' }}>
        <textarea
          ref={ref}
          value={local.replace(/\*/g, '')}
          onChange={e => {
            // strip markers from textarea, preserve them in local state by re-applying
            // simpler: let textarea be marker-free, word chips toggle markers
            const raw = e.target.value
            // rebuild: preserve highlight status for matching words
            const oldTokens = tokenise(local)
            const highlights = new Set<string>()
            oldTokens.filter(t => !t.isSpace && t.highlighted).forEach(t => highlights.add(t.word.toLowerCase()))
            const newText = raw.split(/(\s+)/g).map(chunk => {
              if (/^\s+$/.test(chunk)) return chunk
              return highlights.has(chunk.replace(/\*/g, '').toLowerCase()) ? `*${chunk.replace(/\*/g, '')}*` : chunk.replace(/\*/g, '')
            }).join('')
            setLocal(newText)
          }}
          onKeyDown={e => { if (e.key === 'Escape') handleCancel() }}
          rows={3}
          style={{
            width: '100%', background: 'rgba(0,0,0,0.06)',
            border: '2px dashed rgba(0,0,0,0.4)', outline: 'none',
            padding: '8px', fontFamily: 'inherit', fontSize: 'inherit',
            fontWeight: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit',
            color: 'inherit', borderRadius: 4, resize: 'vertical',
          }}
          disabled={saving}
        />

        {/* Word chip highlight picker */}
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
            Highlight
          </span>
          {tokens.map((t, i) => {
            if (t.isSpace) return null
            const wi = wordIdx++
            return (
              <button
                key={i}
                onClick={() => setLocal(toggleWord(local, wi))}
                style={{
                  padding: '3px 10px', fontSize: 13, borderRadius: 4, cursor: 'pointer', border: 'none',
                  fontStyle: t.highlighted ? 'italic' : 'normal',
                  fontWeight: t.highlighted ? 700 : 400,
                  background: t.highlighted ? '#b03060' : '#e8e3dc',
                  color: t.highlighted ? '#fff' : '#1a1a1a',
                  transition: 'all 0.1s',
                }}
              >
                {t.word}
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <button onClick={handleCancel} style={{ padding: '4px 12px', fontSize: 12, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '4px 12px', fontSize: 12, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {saving ? '…' : 'Save'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group" style={{ position: 'relative', cursor: 'pointer', width: '100%' }} onClick={() => setEditing(true)}>
      {parseLines(rawText).map((parts, i) => renderLine(parts, i))}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.06)', border: '2px dashed rgba(0,0,0,0.3)',
        opacity: 0, transition: 'opacity 0.15s', borderRadius: 4, pointerEvents: 'none',
      }} className="group-hover:!opacity-100">
        <span style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 3, letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif", fontStyle: 'normal', fontWeight: 700 }}>
          Edit
        </span>
      </div>
    </div>
  )
}
