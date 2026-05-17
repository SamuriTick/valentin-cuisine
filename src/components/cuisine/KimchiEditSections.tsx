'use client'

import { useState } from 'react'
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
  // Recipe
  recipeEyebrow: string
  recipeTitle1: string
  recipeTitle2: string
  recipeBody1: string
  recipeBody2: string
  // Pairings
  pairingsTitle1: string
  pairingsTitle2: string
  pairings: { label: string; desc: string }[]
  // Storage
  storageEyebrow: string
  storageTitle1: string
  storageTitle2: string
  storageBody: string
  storageStages: { stage: string; note: string }[]
  storageTip1Title: string
  storageTip1Body: string
  storageTip2Title: string
  storageTip2Body: string
  // Order section
  orderEyebrow: string
  orderTitle: string
  orderSteps: { title: string; body: string }[]
  // FAQs
  faqs: { q: string; a: string }[]
}

interface Props { t: KimchiContent }

export function KimchiEditSections({ t }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false
  const save = (key: string) => async (val: string) => { await editCtx?.onFieldUpdate(key, val) }
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set())
  function toggleFaq(i: number) {
    setFaqOpen(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next })
  }

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

      {/* Recipe */}
      <div className="bg-brand-green-light border-b border-brand-border">
        <ContainerStandard className="py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
              <EditableText value={t.recipeEyebrow} onSave={save('kimchi.recipe.eyebrow')} editMode={editMode} as="span" />
            </p>
            <h2 className="font-display font-light text-[clamp(26px,4vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-5">
              <EditableText value={t.recipeTitle1} onSave={save('kimchi.recipe.title1')} editMode={editMode} as="span" />
              <br />
              <span className="font-semibold italic text-brand-teal">
                <EditableText value={t.recipeTitle2} onSave={save('kimchi.recipe.title2')} editMode={editMode} as="span" />
              </span>
            </h2>
            <div className="w-10 h-px bg-brand-border mb-6" />
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-4">
              <EditableText value={t.recipeBody1} onSave={save('kimchi.recipe.body1')} editMode={editMode} as="span" multiline />
            </p>
            <p className="font-body text-sm text-brand-muted leading-[1.85]">
              <EditableText value={t.recipeBody2} onSave={save('kimchi.recipe.body2')} editMode={editMode} as="span" multiline />
            </p>
          </div>
          <div className="bg-white border border-brand-border rounded-lg p-6">
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">What&rsquo;s in it (hardcoded — edit in code)</p>
            <p className="font-body text-[12px] text-brand-muted italic">Napa cabbage, gochugaru, garlic, ginger, onions, soy sauce, fish sauce, dried Vietnamese shrimp, vinegar</p>
          </div>
        </ContainerStandard>
      </div>

      {/* Pairings */}
      <div className="bg-white border-b border-brand-border">
        <ContainerStandard className="py-10">
          <h2 className="font-display font-light text-[clamp(26px,4vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0 text-center">
            <EditableText value={t.pairingsTitle1} onSave={save('kimchi.pairings.title1')} editMode={editMode} as="span" />
            {' '}<span className="font-semibold italic text-brand-teal">
              <EditableText value={t.pairingsTitle2} onSave={save('kimchi.pairings.title2')} editMode={editMode} as="span" />
            </span>
          </h2>
          <div className="w-10 h-px bg-brand-border mx-auto mt-5 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.pairings.map((item, i) => (
              <div key={i} className="bg-brand-light border border-brand-border rounded-lg p-5">
                <p className="font-body text-sm font-bold text-brand-dark mb-2">
                  <EditableText value={item.label} onSave={save(`kimchi.pairings.${i}.label`)} editMode={editMode} as="span" />
                </p>
                <div className="w-6 h-px bg-brand-border mb-2.5" />
                <p className="font-body text-sm text-brand-muted leading-[1.7]">
                  <EditableText value={item.desc} onSave={save(`kimchi.pairings.${i}.desc`)} editMode={editMode} as="span" multiline />
                </p>
              </div>
            ))}
          </div>
        </ContainerStandard>
      </div>

      {/* Storage */}
      <div className="bg-brand-green-light border-b border-brand-border">
        <ContainerStandard className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
                <EditableText value={t.storageEyebrow} onSave={save('kimchi.storage.eyebrow')} editMode={editMode} as="span" />
              </p>
              <h2 className="font-display font-light text-[clamp(24px,3.5vw,36px)] text-brand-dark leading-[1.1] tracking-[-1px]">
                <EditableText value={t.storageTitle1} onSave={save('kimchi.storage.title1')} editMode={editMode} as="span" />
                <br />
                <span className="font-semibold italic text-brand-teal">
                  <EditableText value={t.storageTitle2} onSave={save('kimchi.storage.title2')} editMode={editMode} as="span" />
                </span>
              </h2>
              <div className="w-10 h-px bg-brand-border mt-5 mb-5" />
              <p className="font-body text-sm text-brand-muted leading-[1.75]">
                <EditableText value={t.storageBody} onSave={save('kimchi.storage.body')} editMode={editMode} as="span" multiline />
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.storageStages.map((item, i) => (
                <div key={i} className="bg-brand-light border border-brand-border rounded-lg p-5">
                  <p className="font-body text-[11px] font-bold tracking-[1.5px] uppercase text-brand-teal mb-2">
                    <EditableText value={item.stage} onSave={save(`kimchi.storage.stage.${i}.stage`)} editMode={editMode} as="span" />
                  </p>
                  <p className="font-body text-sm text-brand-muted leading-[1.7]">
                    <EditableText value={item.note} onSave={save(`kimchi.storage.stage.${i}.note`)} editMode={editMode} as="span" multiline />
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-brand-light border border-brand-border rounded-lg px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-accent text-[clamp(18px,2.5vw,26px)] text-brand-teal mb-3 leading-none">
                <EditableText value={t.storageTip1Title} onSave={save('kimchi.storage.tip1.title')} editMode={editMode} as="span" />
              </p>
              <p className="font-body text-sm text-brand-muted leading-[1.75]">
                <EditableText value={t.storageTip1Body} onSave={save('kimchi.storage.tip1.body')} editMode={editMode} as="span" multiline />
              </p>
            </div>
            <div>
              <p className="font-accent text-[clamp(18px,2.5vw,26px)] text-brand-teal mb-3 leading-none">
                <EditableText value={t.storageTip2Title} onSave={save('kimchi.storage.tip2.title')} editMode={editMode} as="span" />
              </p>
              <p className="font-body text-sm text-brand-muted leading-[1.75]">
                <EditableText value={t.storageTip2Body} onSave={save('kimchi.storage.tip2.body')} editMode={editMode} as="span" multiline />
              </p>
            </div>
          </div>
        </ContainerStandard>
      </div>

      {/* Order section */}
      <div className="bg-brand-light border-b border-brand-border">
        <ContainerStandard className="py-10">
          <p className="font-accent text-[clamp(22px,3vw,32px)] text-brand-teal mb-3 leading-none">
            <EditableText value={t.orderEyebrow} onSave={save('kimchi.order.eyebrow')} editMode={editMode} as="span" />
          </p>
          <h2 className="font-display font-light text-[clamp(26px,4vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            <span className="font-semibold italic text-brand-teal">
              <EditableText value={t.orderTitle} onSave={save('kimchi.order.title')} editMode={editMode} as="span" />
            </span>
          </h2>
          <div className="w-10 h-px bg-brand-border mt-5 mb-6" />
          <div className="space-y-5 max-w-xl">
            {t.orderSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-green-light border border-brand-border rounded flex items-center justify-center">
                  <span className="font-display text-xl font-normal text-brand-teal leading-none">{i + 1}</span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-brand-dark mb-1">
                    <EditableText value={step.title} onSave={save(`kimchi.order.step.${i}.title`)} editMode={editMode} as="span" />
                  </p>
                  <p className="font-body text-sm text-brand-muted leading-[1.7]">
                    <EditableText value={step.body} onSave={save(`kimchi.order.step.${i}.body`)} editMode={editMode} as="span" multiline />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ContainerStandard>
      </div>

      {/* FAQs */}
      <div className="bg-white border-b border-brand-border">
        <ContainerStandard className="py-10">
          <p className="font-accent text-[clamp(22px,3vw,32px)] text-brand-teal mb-3 leading-none">You ask, I answer</p>
          <div className="w-12 h-px bg-brand-border mb-6" />
          <div className="divide-y divide-brand-border">
            {t.faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left flex items-center justify-between gap-6 py-5 group"
                >
                  <span className="font-display font-light text-[clamp(18px,2.5vw,26px)] text-brand-dark leading-snug group-hover:text-brand-teal transition-colors duration-200">
                    <EditableText value={faq.q} onSave={save(`kimchi.faq.${i}.q`)} editMode={editMode} as="span" />
                  </span>
                  <span className="flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={`transition-transform duration-200 ${faqOpen.has(i) ? 'rotate-180' : ''}`}>
                      <path d="M5 7.5l5 5 5-5" stroke="#b03060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {(faqOpen.has(i) || editMode) && (
                  <p className="font-body text-sm text-brand-muted leading-[1.85] pb-5 max-w-[720px]">
                    <EditableText value={faq.a} onSave={save(`kimchi.faq.${i}.a`)} editMode={editMode} as="span" multiline />
                  </p>
                )}
              </div>
            ))}
          </div>
        </ContainerStandard>
      </div>

    </div>
  )
}
