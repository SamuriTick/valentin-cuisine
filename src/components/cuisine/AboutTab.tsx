'use client';

import { useState } from 'react';
import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';
import { EditableTitleBlock } from '@/components/admin/visual/EditableTitleBlock'
import { MediaPicker } from '@/components/admin/visual/EditableImage';

function AvatarContainer({ src, editMode, onSave, onCropSave }: {
  src: string; editMode: boolean
  onSave: (url: string) => Promise<void>
  onCropSave?: (x: number, y: number, zoom: number) => Promise<void>
}) {
  const [hovered, setHovered] = useState(false)
  const [picking, setPicking] = useState(false)
  const [repositioning, setRepositioning] = useState(false)

  return (
    <div
      style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 48px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle */}
      <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', background: '#fff', border: '1px solid #e8e3dc', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {src ? (
          <img src={src} alt="Valentin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span className="font-display text-[72px] font-normal text-brand-teal leading-none">V</span>
        )}
      </div>

      {/* Hover buttons — shown below circle only on hover */}
      {editMode && (
        <div style={{ position: 'absolute', bottom: -38, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, whiteSpace: 'nowrap', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s', pointerEvents: hovered ? 'auto' : 'none' }}>
          {src && (
            <button onClick={() => setRepositioning(true)}
              style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'Nunito', sans-serif", background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >Reposition</button>
          )}
          <button onClick={() => setPicking(true)}
            style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, fontFamily: "'Nunito', sans-serif", background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >Change photo</button>
        </div>
      )}

      {repositioning && src && (
        <RepositionModal src={src} onSave={onCropSave} onClose={() => setRepositioning(false)} />
      )}
      {picking && (
        <MediaPicker
          onSelect={async url => { setPicking(false); await onSave(url) }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  )
}

function RepositionModal({ src, onSave, onClose }: {
  src: string
  onSave?: (x: number, y: number, zoom: number) => Promise<void>
  onClose: () => void
}) {
  const [pos, setPos] = useState({ x: 50, y: 50, zoom: 1 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)

  function onMouseDown(e: React.MouseEvent) { e.preventDefault(); setDragging(true); setDragStart({ x: e.clientX, y: e.clientY }) }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging) return
    setPos(p => ({ ...p, x: Math.max(0, Math.min(100, p.x - (e.clientX - dragStart.x) / 3)), y: Math.max(0, Math.min(100, p.y - (e.clientY - dragStart.y) / 3)) }))
    setDragStart({ x: e.clientX, y: e.clientY })
  }
  function onMouseUp() { setDragging(false) }

  async function save() {
    setSaving(true)
    await onSave?.(pos.x, pos.y, pos.zoom)
    setSaving(false)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 360 }}>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Reposition photo</p>
        <div
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          style={{ width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', cursor: dragging ? 'grabbing' : 'grab', border: '2px dashed #e8e3dc', position: 'relative' }}
        >
          <img src={src} alt="" style={{ position: 'absolute', inset: '-20%', width: '140%', height: '140%', objectFit: 'cover', objectPosition: `${pos.x}% ${pos.y}%`, transform: `scale(${pos.zoom})`, transformOrigin: `${pos.x}% ${pos.y}%`, pointerEvents: 'none' }} draggable={false} />
        </div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#666' }}>Zoom</span>
          <input type="range" min={100} max={250} value={pos.zoom * 100} onChange={e => setPos(p => ({ ...p, zoom: parseInt(e.target.value) / 100 }))} style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: '#666', width: 36 }}>{Math.round(pos.zoom * 100)}%</span>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '6px 14px', fontSize: 12, background: '#e8e3dc', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: '6px 14px', fontSize: 12, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {saving ? '…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props { t: Translations }

export function AboutTab({ t }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false

  const save = (key: string) => async (value: string) => {
    await editCtx?.onFieldUpdate(key, value)
  }

  const aboutTitleRaw = [t.aboutTitle[0] ?? '', t.aboutTitle[1] ?? ''].join('\n')

  return (
    <div id="about" className="scroll-mt-[72px]">

      {/* Section 1 · Intro */}
      <div className="bg-brand-light border-t border-brand-border">
        <ContainerStandard className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* Portrait */}
          <div className="flex flex-col items-center text-center">
            {/* Circle: hover group shows edit buttons below */}
            <AvatarContainer
              src={t.aboutAvatar}
              editMode={editMode}
              onSave={async url => { await editCtx?.onImageUpdate('about.avatar', url) }}
              onCropSave={async (x, y, zoom) => { await editCtx?.onFieldUpdate('about.avatar.crop', `${x} ${y} ${zoom}`) }}
            />
            <p className="font-display text-[22px] font-normal text-brand-dark mb-1">Valentin Thang</p>
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted">
              <EditableText value={t.taglineSub} onSave={save('about.tagline_sub')} editMode={editMode} as="span" />
            </p>
          </div>

          {/* Text */}
          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
              <EditableText value={t.aboutEyebrow} onSave={save('about.eyebrow')} editMode={editMode} as="span" />
            </p>
            <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              <EditableTitleBlock
                rawText={aboutTitleRaw}
                editMode={editMode}
                onSave={async raw => {
                  const lines = raw.split('\n')
                  await Promise.all([
                    editCtx?.onFieldUpdate('about.title1', lines[0] ?? ''),
                    editCtx?.onFieldUpdate('about.title2', lines[1] ?? ''),
                  ])
                }}
                renderLine={(parts, i) => (
                  <span key={i} className="block">
                    {parts.map((p, j) =>
                      p.highlighted
                        ? <span key={j} className="font-semibold italic text-brand-teal">{p.text}</span>
                        : <span key={j}>{p.text}</span>
                    )}
                  </span>
                )}
              />
            </h2>
            <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-4">
              <EditableText value={t.aboutBody1} onSave={save('about.body1')} editMode={editMode} as="span" multiline />
            </p>
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-6">
              <EditableText value={t.aboutBody2} onSave={save('about.body2')} editMode={editMode} as="span" multiline />
            </p>
            <blockquote className="m-0 px-6 py-5 bg-white border border-brand-border rounded-lg">
              <p className="font-display text-[18px] font-light italic text-brand-dark leading-[1.6] mb-2">
                <EditableText value={t.aboutQuote} onSave={save('about.quote')} editMode={editMode} as="span" multiline />
              </p>
              <cite className="font-body block text-[11px] tracking-[1.8px] uppercase text-brand-muted not-italic">
                <EditableText value={t.aboutQuoteCredit} onSave={save('about.quote_credit')} editMode={editMode} as="span" />
              </cite>
            </blockquote>
          </div>

        </ContainerStandard>
      </div>

      {/* Section 2 · Stats */}
      <div className="bg-white border-t border-brand-border">
        <ContainerStandard className="py-10 md:py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {([
            [t.statsLabel1, t.statsDesc1, 'stats.label1', 'stats.desc1'],
            [t.statsLabel2, t.statsDesc2, 'stats.label2', 'stats.desc2'],
            [t.statsLabel3, t.statsDesc3, 'stats.label3', 'stats.desc3'],
          ] as [string, string, string, string][]).map(([label, desc, lKey, dKey]) => (
            <div key={lKey} className="text-center px-4 py-2">
              <p className="font-display font-normal text-[clamp(28px,4vw,44px)] text-brand-teal leading-none mb-3">
                <EditableText value={label} onSave={save(lKey)} editMode={editMode} as="span" />
              </p>
              <p className="font-body text-[13px] text-brand-muted leading-[1.7]">
                <EditableText value={desc} onSave={save(dKey)} editMode={editMode} as="span" multiline />
              </p>
            </div>
          ))}
        </ContainerStandard>
      </div>

      {/* Section 3 · Story cards */}
      <div className="bg-brand-light border-t border-brand-border">
        <ContainerStandard className="py-10 md:py-12">
          <p className="font-accent text-[clamp(22px,3vw,36px)] text-brand-teal mb-3 leading-none text-center">Highlights</p>
          <div className="w-12 h-px bg-brand-border mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              [t.storyTitle1, t.storyBody1, 'story.title1', 'story.body1'],
              [t.storyTitle2, t.storyBody2, 'story.title2', 'story.body2'],
              [t.storyTitle3, t.storyBody3, 'story.title3', 'story.body3'],
              [t.storyTitle4, t.storyBody4, 'story.title4', 'story.body4'],
            ] as [string, string, string, string][]).map(([title, body, tKey, bKey]) => (
              <div key={tKey} className="bg-white rounded-lg border border-brand-border px-6 py-6">
                <h3 className="font-display font-semibold text-[18px] text-brand-dark leading-snug mb-3">
                  <EditableText value={title} onSave={save(tKey)} editMode={editMode} as="span" />
                </h3>
                <div className="w-7 h-px bg-brand-border mb-4" />
                <p className="font-body text-[13px] text-brand-muted leading-[1.75]">
                  <EditableText value={body} onSave={save(bKey)} editMode={editMode} as="span" multiline />
                </p>
              </div>
            ))}
          </div>
        </ContainerStandard>
      </div>

    </div>
  );
}
