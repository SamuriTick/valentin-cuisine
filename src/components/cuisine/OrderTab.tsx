'use client';

import { useState } from 'react';
import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';
import { useEditContext } from '@/components/admin/visual/EditContext';
import { EditableText } from '@/components/admin/visual/EditableText';

interface Props { t?: Translations }

export function OrderTab({ t: tProp }: Props = {}) {
  const editCtx = useEditContext()
  const editMode = editCtx?.editMode ?? false

  const save = (key: string) => async (value: string) => {
    await editCtx?.onFieldUpdate(key, value)
  }

  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    wantsToTry: '',
    optIn: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(k: string, v: string | boolean) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          occasion: `Waiting list signup${form.optIn ? ' (opted into updates)' : ''}`,
          details: `Location: ${form.location || 'not given'}\nWhat they want to try: ${form.wantsToTry || 'not given'}`,
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const eyebrow = tProp?.orderEyebrowAlt ?? 'Be first to know'
  const title   = tProp?.orderTitleAlt   ?? 'Join the list'
  const body    = tProp?.orderBodyAlt    ?? "I am 13 and still in school, so I can only take orders in school holidays. If you join the list, you will be the first to know when I have time to bake and when stock is ready. No spam, just a message when something is available."
  const bullet1 = tProp?.orderBullet1   ?? 'First in line when kimchi, cakes, or sourdough is ready'
  const bullet2 = tProp?.orderBullet2   ?? 'A heads-up when school holidays are coming'
  const bullet3 = tProp?.orderBullet3   ?? 'I only message when I actually have something ready'

  return (
    <div id="order" className="bg-brand-light border-t border-brand-border scroll-mt-[72px]">
      <ContainerStandard className="py-12 md:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Left */}
          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
              <EditableText value={eyebrow} onSave={save('order.eyebrow')} editMode={editMode} as="span" />
            </p>
            <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              <span className="font-semibold italic text-brand-teal">
                <EditableText value={title} onSave={save('order.title')} editMode={editMode} as="span" />
              </span>
            </h2>
            <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
            <p className="font-body text-sm text-brand-muted leading-[1.85]">
              <EditableText value={body} onSave={save('order.body')} editMode={editMode} as="span" multiline />
            </p>
            <div className="mt-6 space-y-3">
              {([
                [bullet1, 'order.bullet1'],
                [bullet2, 'order.bullet2'],
                [bullet3, 'order.bullet3'],
              ] as [string, string][]).map(([line, key]) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" />
                  <p className="font-body text-[13px] text-brand-muted leading-[1.7]">
                    <EditableText value={line} onSave={save(key)} editMode={editMode} as="span" multiline />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div>
            {status === 'sent' ? (
              <div className="px-8 py-10 bg-white border border-brand-border rounded-lg text-center">
                <p className="font-display text-[26px] font-light text-brand-dark mb-2">You are on the list!</p>
                <p className="font-body text-sm text-brand-muted">Thanks {form.name} - I will let you know as soon as something is ready.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5">
                {status === 'error' && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-body text-[13px] rounded-md">
                    Something went wrong - please try again.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Your name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Roughly where are you based?</label>
                  <input
                    type="text"
                    placeholder="Putney, SW London, anywhere in the UK..."
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50"
                  />
                </div>

                <div>
                  <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">What would you most like to try?</label>
                  <input
                    type="text"
                    placeholder="Kimchi, sourdough, a birthday cake..."
                    value={form.wantsToTry}
                    onChange={e => set('wantsToTry', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-[2px] flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={form.optIn}
                      onChange={e => set('optIn', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border-2 transition-colors duration-200 flex items-center justify-center ${
                      form.optIn ? 'bg-brand-teal border-brand-teal' : 'bg-brand-light border-brand-muted/40 group-hover:border-brand-teal'
                    }`}>
                      {form.optIn && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="font-body text-[12px] text-brand-muted leading-[1.6]">
                    Yes, send me a message when Valentin has something new ready - school holiday stock, new recipes, special batches.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  onClick={e => { if (editMode) e.preventDefault() }}
                  className={`w-full font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white py-4 px-8 rounded transition-opacity duration-200 hover:opacity-85 ${
                    status === 'sending' ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand-teal cursor-pointer'
                  }`}
                >
                  {status === 'sending' ? 'Joining...' : 'Join the List'}
                </button>

                <p className="font-body text-[12px] text-brand-muted text-center leading-[1.6]">
                  I won&apos;t spam you, I promise. I&apos;ll just message when I actually have something ready.
                </p>
              </form>
            )}
          </div>

        </div>
      </ContainerStandard>
    </div>
  );
}
