'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';

interface Props { t: Translations }

export function SpecialtiesTab({ t }: Props) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false

  const save = (key: string) => async (value: string) => {
    await editCtx?.onFieldUpdate(key, value)
  }

  return (
    <div id="specialties" className="bg-white border-t border-brand-border scroll-mt-[72px]">
      <ContainerStandard className="py-12 md:py-16">

        <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none text-center">
          <EditableText value={t.specEyebrow} onSave={save('spec.eyebrow')} editMode={editMode} as="span" />
        </p>
        <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] text-center">
          <span className="font-semibold italic text-brand-teal">
            <EditableText value={t.specTitle} onSave={save('spec.title')} editMode={editMode} as="span" />
          </span>
        </h2>
        <div className="w-12 h-px bg-brand-border mx-auto mt-5 mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.dishes.map((dish, i) => (
            <div
              key={i}
              className="bg-brand-light border border-brand-border rounded-lg p-6 transition-colors duration-200 hover:bg-brand-green-light"
            >
              <h3 className="font-display font-semibold text-[18px] text-brand-dark mb-3 leading-snug">
                <EditableText value={dish.name} onSave={save(`dish.${i}.name`)} editMode={editMode} as="span" />
              </h3>
              <div className="w-7 h-px bg-brand-border mb-3" />
              <p className="font-body text-[13px] text-brand-muted leading-[1.75]">
                <EditableText value={dish.desc} onSave={save(`dish.${i}.desc`)} editMode={editMode} as="span" multiline />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center flex flex-wrap gap-3 justify-center">
          <a
            href="/kimchi"
            onClick={e => { if (editMode) e.preventDefault() }}
            className="inline-block font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white bg-brand-teal px-10 py-4 rounded no-underline transition-opacity duration-200 hover:opacity-85"
          >
            Order Kimchi
          </a>
          <a
            href="/contact"
            onClick={e => { if (editMode) e.preventDefault() }}
            className="inline-block font-body text-[11px] font-bold tracking-[2.5px] uppercase text-brand-teal bg-white border border-brand-teal px-10 py-4 rounded no-underline transition-opacity duration-200 hover:opacity-85"
          >
            Order anything else
          </a>
        </div>

      </ContainerStandard>
    </div>
  );
}
