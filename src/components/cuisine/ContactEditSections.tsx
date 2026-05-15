'use client'

import { ContainerStandard } from './ContainerStandard'
import { ContactForm } from './ContactForm'
import { useEditContext } from '@/components/admin/visual/EditContext'
import { EditableText } from '@/components/admin/visual/EditableText'

export interface ContactContent {
  heroEyebrow: string
  heroTitlePrefix: string
  heroTitle: string
  heroDesc: string
  foodItems: { label: string; body: string }[]
  mentorBody: string
}

interface Props { t: ContactContent }

export function ContactEditSections({ t }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false
  const save = (key: string) => async (val: string) => { await editCtx?.onFieldUpdate(key, val) }

  return (
    <div className="font-body">

      {/* Header */}
      <div className="bg-white border-b border-brand-border">
        <ContainerStandard className="py-16 md:py-20">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
            <EditableText value={t.heroEyebrow} onSave={save('contact.hero.eyebrow')} editMode={editMode} as="span" />
          </p>
          <h1 className="font-display font-light text-[clamp(36px,5vw,60px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4">
            <EditableText value={t.heroTitlePrefix} onSave={save('contact.hero.title_prefix')} editMode={editMode} as="span" />{' '}
            <span className="font-semibold italic text-brand-teal">
              <EditableText value={t.heroTitle} onSave={save('contact.hero.title')} editMode={editMode} as="span" />
            </span>
          </h1>
          <div className="w-12 h-px bg-brand-border mb-5" />
          <p className="font-body text-sm text-brand-muted leading-[1.85] max-w-[480px]">
            <EditableText value={t.heroDesc} onSave={save('contact.hero.desc')} editMode={editMode} as="span" multiline />
          </p>
        </ContainerStandard>
      </div>

      {/* Info + form */}
      <div className="bg-brand-light border-b border-brand-border">
        <ContainerStandard className="py-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left: info cards */}
          <div>
            <div className="mb-10">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">About food</p>
              <div className="space-y-4">
                {t.foodItems.map((item, i) => (
                  <div key={i} className="bg-white border border-brand-border rounded-lg px-5 py-4">
                    <p className="font-body text-sm font-semibold text-brand-dark mb-1">
                      <EditableText value={item.label} onSave={save(`contact.food.${i}.label`)} editMode={editMode} as="span" />
                    </p>
                    <p className="font-body text-sm text-brand-muted leading-[1.7]">
                      <EditableText value={item.body} onSave={save(`contact.food.${i}.body`)} editMode={editMode} as="span" multiline />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">About mentoring</p>
              <div className="bg-brand-green-light border border-brand-border rounded-lg px-5 py-5">
                <p className="font-body text-sm text-brand-muted leading-[1.8]">
                  <EditableText value={t.mentorBody} onSave={save('contact.mentor.body')} editMode={editMode} as="span" multiline />
                </p>
              </div>
            </div>
          </div>

          {/* Right: real form (non-interactive in edit mode) */}
          <div>
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-5">Send a message</p>
            <div style={{ position: 'relative' }}>
              <ContactForm />
              {editMode && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'default' }} />
              )}
            </div>
          </div>

        </ContainerStandard>
      </div>

    </div>
  )
}
