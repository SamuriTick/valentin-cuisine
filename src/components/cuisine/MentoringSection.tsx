'use client';

import Link from 'next/link';
import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';

interface Props { t?: Translations }

export function MentoringSection({ t: tProp }: Props = {}) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false

  const save = (key: string) => async (value: string) => {
    await editCtx?.onFieldUpdate(key, value)
  }

  const eyebrow    = tProp?.mentorEyebrow    ?? 'Something different'
  const title1     = tProp?.mentorTitle1     ?? 'I would love a'
  const title2     = tProp?.mentorTitle2     ?? 'mentor.'
  const body1      = tProp?.mentorBody1      ?? "I am 13, I have run a cake business, worked in a restaurant, taught cooking to kids, and applied to Junior Bake Off. I love what I do. But I am still figuring a lot of things out."
  const body2      = tProp?.mentorBody2      ?? "If you work in food, hospitality, business, or anything creative and you are open to a conversation, I would genuinely love that. I am curious about everything and I ask a lot of questions."
  const item1Label = tProp?.mentorItem1Label ?? 'Someone to talk to'
  const item1Body  = tProp?.mentorItem1Body  ?? "I want to hear how people got to where they are. The path, the mistakes, the parts they did not expect."
  const item2Label = tProp?.mentorItem2Label ?? 'Honest feedback'
  const item2Body  = tProp?.mentorItem2Body  ?? "On my work, my ideas, my direction. I would rather hear something hard than something polite."
  const item3Label = tProp?.mentorItem3Label ?? 'Connections'
  const item3Body  = tProp?.mentorItem3Body  ?? "I am 13 and I do not know many people yet. I am trying to change that."

  return (
    <section className="bg-white border-t border-brand-border">
      <ContainerStandard className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
              <EditableText value={eyebrow} onSave={save('mentor.eyebrow')} editMode={editMode} as="span" />
            </p>
            <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              <EditableText value={title1} onSave={save('mentor.title1')} editMode={editMode} as="span" /><br />
              <span className="font-semibold italic text-brand-teal">
                <EditableText value={title2} onSave={save('mentor.title2')} editMode={editMode} as="span" />
              </span>
            </h2>
            <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-4">
              <EditableText value={body1} onSave={save('mentor.body1')} editMode={editMode} as="span" multiline />
            </p>
            <p className="font-body text-sm text-brand-muted leading-[1.85]">
              <EditableText value={body2} onSave={save('mentor.body2')} editMode={editMode} as="span" multiline />
            </p>
          </div>

          <div className="bg-brand-light border border-brand-border rounded-lg p-8">
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">What I am looking for</p>
            <div className="space-y-4 mb-8">
              {([
                [item1Label, item1Body, 'mentor.item1.label', 'mentor.item1.body'],
                [item2Label, item2Body, 'mentor.item2.label', 'mentor.item2.body'],
                [item3Label, item3Body, 'mentor.item3.label', 'mentor.item3.body'],
              ] as [string, string, string, string][]).map(([label, bodyText, lKey, bKey]) => (
                <div key={lKey} className="flex gap-4">
                  <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-brand-dark mb-1">
                      <EditableText value={label} onSave={save(lKey)} editMode={editMode} as="span" />
                    </p>
                    <p className="font-body text-[13px] text-brand-muted leading-[1.7]">
                      <EditableText value={bodyText} onSave={save(bKey)} editMode={editMode} as="span" multiline />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              onClick={e => { if (editMode) e.preventDefault() }}
              className="inline-block font-body text-[11px] font-bold tracking-[2px] uppercase text-white bg-brand-teal no-underline px-8 py-3 rounded hover:opacity-85 transition-opacity duration-200"
            >
              Mentor Me
            </Link>
          </div>

        </div>
      </ContainerStandard>
    </section>
  );
}
