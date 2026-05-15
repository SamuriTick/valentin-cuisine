'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';
import { EditableImage } from '@/components/admin/visual/EditableImage';
import { EditableTitleBlock } from '@/components/admin/visual/EditableTitleBlock';

interface Props {
  t: Translations
  heroImage?: string
  noNavOffset?: boolean
}

export function HeroSection({ t, heroImage = '/valentin-hero.jpg', noNavOffset = false }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false

  const save = (key: string) => async (value: string) => {
    await editCtx?.onFieldUpdate(key, value)
  }

  const titleRaw = [t.heroTitle[0] ?? '', t.heroTitle[1] ?? '', t.heroTitle[2] ?? ''].join('\n')

  return (
    <div className={`bg-white ${noNavOffset ? '' : 'pt-[72px]'}`}>
      <section id="hero" className="md:min-h-[calc(100vh-72px)] md:flex md:items-center">
        <ContainerStandard className="py-8 md:py-hero grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-col-gap items-center w-full">

          {/* Photo */}
          <div className="relative overflow-hidden rounded-xl h-[56vw] min-h-[240px] max-h-[360px] md:order-last md:h-auto md:min-h-[700px] md:max-h-none">
            {editMode ? (
              <EditableImage
                src={heroImage}
                alt="Valentin in the kitchen"
                className="absolute inset-0 w-full h-full object-cover object-center"
                editMode={editMode}
                onSave={async url => await editCtx?.onImageUpdate('hero.image', url)}
                onCropSave={async crop => await editCtx?.onFieldUpdate('hero.image.crop', `${crop.x} ${crop.y} ${crop.zoom}`)}
              />
            ) : (
              <img
                src={heroImage}
                alt="Valentin in the kitchen"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <p className="font-accent text-[clamp(14px,2.5vw,22px)] text-brand-teal mb-3 md:mb-4 leading-none">
              <EditableText value={t.heroEyebrow} onSave={save('hero.eyebrow')} editMode={editMode} as="span" />
            </p>

            <h1 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4 md:mb-6">
              <EditableTitleBlock
                rawText={titleRaw}
                editMode={editMode}
                onSave={async raw => {
                  const lines = raw.split('\n')
                  await Promise.all([
                    editCtx?.onFieldUpdate('hero.title1', lines[0] ?? ''),
                    editCtx?.onFieldUpdate('hero.title2', lines[1] ?? ''),
                    editCtx?.onFieldUpdate('hero.title3', lines[2] ?? ''),
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
            </h1>

            <div className="w-12 h-px bg-brand-border mb-4 md:mb-6" />

            <p className="font-body text-sm text-brand-muted leading-[1.85] max-w-[380px] mb-6 md:mb-10">
              <EditableText value={t.heroSub} onSave={save('hero.sub')} editMode={editMode} as="span" multiline />
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/kimchi"
                onClick={e => { if (editMode) e.preventDefault() }}
                className="font-body text-[11px] font-bold tracking-[2.5px] uppercase bg-brand-teal text-white px-8 py-4 rounded no-underline text-center"
              >
                <EditableText value={t.heroCta} onSave={save('hero.cta')} editMode={editMode} as="span" />
              </a>
              <a
                href="/contact"
                onClick={e => { if (editMode) e.preventDefault() }}
                className="font-body text-[11px] font-normal tracking-[2.5px] uppercase px-8 py-4 rounded no-underline text-center border border-brand-border text-brand-muted bg-transparent"
              >
                <EditableText value={t.heroLearn} onSave={save('hero.learn')} editMode={editMode} as="span" />
              </a>
            </div>
          </div>

        </ContainerStandard>
      </section>
    </div>
  );
}
