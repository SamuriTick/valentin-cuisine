'use client'

import { ContainerStandard } from './ContainerStandard'
import { useEditContext } from '@/components/admin/visual/EditContext'
import { EditableText } from '@/components/admin/visual/EditableText'
import { EditableImage } from '@/components/admin/visual/EditableImage'

export interface KimchiContent {
  heroImage: string
  heroImageCrop?: { x: number; y: number; zoom: number }
  heroEyebrow: string
  heroTitle1: string
  heroTitle2: string
  heroDesc: string
  heroPrice: string
  heroPriceSub: string
  quote: string
  tasteEyebrow: string
  tasteTitle1: string
  tasteTitle2: string
  taste: { label: string; desc: string }[]
}

interface Props { t: KimchiContent }

export function KimchiEditSections({ t }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false
  const save = (key: string) => async (val: string) => { await editCtx?.onFieldUpdate(key, val) }

  return (
    <div className="font-body">

      {/* Hero */}
      <div className="bg-white border-b border-brand-border">
        <ContainerStandard className="py-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
          <div className="hidden md:flex relative overflow-hidden rounded-xl h-[260px] bg-brand-light border border-brand-border items-center justify-center">
            {t.heroImage ? (
              <EditableImage
                src={t.heroImage}
                alt="Kimchi hero"
                className="w-full h-full object-cover"
                editMode={editMode}
                crop={t.heroImageCrop}
                onSave={async url => { await editCtx?.onFieldUpdate('kimchi.hero.image', url) }}
                onCropSave={async crop => { await editCtx?.onFieldUpdate('kimchi.hero.image.crop', `${crop.x} ${crop.y} ${crop.zoom}`) }}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="font-display text-[80px] text-brand-teal leading-none">김치</p>
                  <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mt-3">Kimchi · 2kg · Glass jar</p>
                </div>
                {editMode && (
                  <EditableImage
                    src=""
                    alt="Kimchi hero"
                    className="w-full h-full object-cover"
                    editMode={editMode}
                    onSave={async url => { await editCtx?.onFieldUpdate('kimchi.hero.image', url) }}
                    onCropSave={async crop => { await editCtx?.onFieldUpdate('kimchi.hero.image.crop', `${crop.x} ${crop.y} ${crop.zoom}`) }}
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-accent text-[clamp(22px,3.5vw,32px)] text-brand-teal mb-3 leading-none">
              <EditableText value={t.heroEyebrow} onSave={save('kimchi.hero.eyebrow')} editMode={editMode} as="span" />
            </p>
            <h1 className="font-display font-light text-[clamp(36px,5vw,64px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4">
              <EditableText value={t.heroTitle1} onSave={save('kimchi.hero.title1')} editMode={editMode} as="span" />
              <br />
              <span className="font-semibold italic text-brand-teal">
                <EditableText value={t.heroTitle2} onSave={save('kimchi.hero.title2')} editMode={editMode} as="span" />
              </span>
            </h1>
            <div className="w-12 h-px bg-brand-border mb-5" />
            <p className="font-body text-base text-brand-muted leading-[1.85] mb-6 max-w-[420px]">
              <EditableText value={t.heroDesc} onSave={save('kimchi.hero.desc')} editMode={editMode} as="span" multiline />
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[clamp(32px,4vw,44px)] text-brand-dark leading-none">
                <EditableText value={t.heroPrice} onSave={save('kimchi.hero.price')} editMode={editMode} as="span" />
              </span>
              <span className="font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted">
                <EditableText value={t.heroPriceSub} onSave={save('kimchi.hero.price_sub')} editMode={editMode} as="span" />
              </span>
            </div>
          </div>
        </ContainerStandard>
      </div>

      {/* Valentin quote */}
      <div className="bg-brand-light border-b border-brand-border">
        <ContainerStandard className="py-10">
          <blockquote className="max-w-[680px] mx-auto text-center">
            <p className="font-display font-light text-[clamp(20px,3.5vw,30px)] text-brand-dark leading-[1.55] tracking-tight mb-6">
              &ldquo;<EditableText value={t.quote} onSave={save('kimchi.quote')} editMode={editMode} as="span" multiline />&rdquo;
            </p>
            <cite className="font-body text-[11px] tracking-[2px] uppercase text-brand-teal not-italic">
              Valentin Thang, aged 13 · Putney, London
            </cite>
          </blockquote>
        </ContainerStandard>
      </div>

      {/* Taste profile */}
      <div className="bg-white border-b border-brand-border">
        <ContainerStandard className="py-10">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
            <EditableText value={t.tasteEyebrow} onSave={save('kimchi.taste.eyebrow')} editMode={editMode} as="span" />
          </p>
          <h2 className="font-display font-light text-[clamp(28px,4vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            <EditableText value={t.tasteTitle1} onSave={save('kimchi.taste.title1')} editMode={editMode} as="span" />
            <br />
            <span className="font-semibold italic text-brand-teal">
              <EditableText value={t.tasteTitle2} onSave={save('kimchi.taste.title2')} editMode={editMode} as="span" />
            </span>
          </h2>
          <div className="w-10 h-px bg-brand-border mt-5 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.taste.map((item, i) => (
              <div key={i} className="bg-brand-light border border-brand-border rounded-lg p-6">
                <p className="font-body text-base font-bold text-brand-dark mb-2 tracking-tight">
                  <EditableText value={item.label} onSave={save(`kimchi.taste.${i}.label`)} editMode={editMode} as="span" />
                </p>
                <div className="w-6 h-px bg-brand-border mb-3" />
                <p className="font-body text-sm text-brand-muted leading-[1.7]">
                  <EditableText value={item.desc} onSave={save(`kimchi.taste.${i}.desc`)} editMode={editMode} as="span" multiline />
                </p>
              </div>
            ))}
          </div>
        </ContainerStandard>
      </div>

      {/* Static sections note */}
      <div className="bg-brand-light">
        <ContainerStandard className="py-8">
          <p className="font-body text-[12px] text-brand-muted italic text-center">
            The recipe, pairings, storage guide, order form, and FAQs sections below are not editable here — edit them directly in code.
          </p>
        </ContainerStandard>
      </div>

    </div>
  )
}
