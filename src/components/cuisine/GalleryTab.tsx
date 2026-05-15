'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';
import { EditableImage } from '@/components/admin/visual/EditableImage';

interface Photo { url: string; alt: string }
interface Props { t?: Translations; photos?: Photo[] }

export function GalleryTab({ t: tProp, photos = [] }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false

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

        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-[4/3] relative bg-brand-card-dark border border-brand-card-border">
                <EditableImage
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  editMode={editMode}
                  onSave={async url => { await editCtx?.onFieldUpdate(`gallery.photo.${i}`, url) }}
                  onCropSave={async crop => { await editCtx?.onFieldUpdate(`gallery.photo.${i}.crop`, `${crop.x} ${crop.y} ${crop.zoom}`) }}
                />
              </div>
            ))}
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
    </div>
  );
}
