'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';
import { EditableImage, MediaPicker } from '@/components/admin/visual/EditableImage';
import { getMediaDisplayUrl } from '@/lib/media-url';
import { GALLERY_KEY, GalleryPhoto } from '@/lib/gallery';
import { useState } from 'react';

interface Props { t?: Translations; photos?: GalleryPhoto[] }

const ctrlBtn: React.CSSProperties = {
  padding: '5px 10px', fontSize: 12, fontWeight: 600, background: 'rgba(0,0,0,0.7)',
  color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer',
}

export function GalleryTab({ t: tProp, photos = [] }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false
  const list = photos
  const [showPicker, setShowPicker] = useState(false)

  const saveList = async (next: GalleryPhoto[]) => {
    await editCtx?.onFieldUpdate(GALLERY_KEY, JSON.stringify(next))
  }
  const updateAt = (i: number, patch: Partial<GalleryPhoto>) =>
    saveList(list.map((p, j) => (j === i ? { ...p, ...patch } : p)))
  const removeAt = (i: number) => saveList(list.filter((_, j) => j !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    next.splice(j, 0, ...next.splice(i, 1))
    saveList(next)
  }

  const save = (key: string) => async (value: string) => {
    await editCtx?.onFieldUpdate(key, value)
  }

  const eyebrow = tProp?.galleryEyebrow ?? 'Behind the scenes'
  const title   = tProp?.galleryTitle   ?? 'Gallery'

  return (
    <div id="gallery" className="scroll-mt-[72px]" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1a2e 40%, #1a2a1a 100%)' }}>
      <ContainerStandard className="py-12 md:py-16">

        <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none text-center">
          <EditableText value={eyebrow} onSave={save('gallery.eyebrow')} editMode={editMode} as="span" />
        </p>
        <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-white leading-[1.1] tracking-[-1px] text-center">
          <span className="font-semibold italic text-brand-teal">
            <EditableText value={title} onSave={save('gallery.title')} editMode={editMode} as="span" />
          </span>
        </h2>
        <div className="w-12 h-px bg-white/15 mx-auto mt-5 mb-10" />

        {list.length > 0 || editMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {list.map((photo, i) => (
              <div key={`${photo.url}-${i}`} className="rounded-lg overflow-hidden aspect-[4/3] relative bg-brand-card-dark border border-brand-card-border">
                <EditableImage
                  src={getMediaDisplayUrl(photo.url)}
                  alt={photo.alt ?? ''}
                  className="w-full h-full object-cover"
                  editMode={editMode}
                  crop={photo.crop}
                  onSave={url => updateAt(i, { url })}
                  onCropSave={crop => updateAt(i, { crop })}
                  onDelete={() => removeAt(i)}
                />
                {editMode && (
                  <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 20, display: 'flex', gap: 6 }}>
                    <button onClick={() => move(i, -1)} disabled={i === 0} style={{ ...ctrlBtn, opacity: i === 0 ? 0.4 : 1 }} title="Move earlier">←</button>
                    <button onClick={() => move(i, 1)} disabled={i === list.length - 1} style={{ ...ctrlBtn, opacity: i === list.length - 1 ? 0.4 : 1 }} title="Move later">→</button>
                  </div>
                )}
              </div>
            ))}
            {editMode && (
              <button
                onClick={() => setShowPicker(true)}
                className="rounded-lg aspect-[4/3] border-2 border-dashed border-white/30 hover:border-brand-teal text-white/70 hover:text-brand-teal font-body text-sm flex items-center justify-center transition-colors"
              >
                + Add photo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-brand-card-dark border border-brand-card-border rounded-lg aspect-[4/3] flex items-center justify-center">
                <span className="font-body text-[11px] text-brand-muted tracking-[1.5px] uppercase">
                  Photo {i + 1}
                </span>
              </div>
            ))}
            <p className="col-span-full text-center mt-4 font-body text-[13px] text-brand-muted italic">
              Photos coming soon
            </p>
          </div>
        )}

      </ContainerStandard>

      {showPicker && (
        <MediaPicker
          onSelect={url => { setShowPicker(false); saveList([...list, { url }]) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
