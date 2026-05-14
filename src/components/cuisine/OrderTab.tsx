'use client';

import { useState } from 'react';
import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';

interface Props { t: Translations }

export function OrderTab({ t }: Props) {
  const [form, setForm] = useState({ name: '', email: '', occasion: '', details: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div id="order" className="bg-brand-light border-t border-brand-border scroll-mt-[72px]">
      <ContainerStandard className="py-12 md:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Left */}
          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">{t.orderEyebrow}</p>
            <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              <span className="font-semibold italic text-brand-teal">{t.orderTitle}</span>
            </h2>
            <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
            <p className="font-body text-sm text-brand-muted leading-[1.85]">{t.orderBody}</p>
          </div>

          {/* Right · form */}
          <div>
            {status === 'sent' ? (
              <div className="px-8 py-10 bg-white border border-brand-border rounded-lg text-center">
                <p className="font-display text-[26px] font-light text-brand-dark mb-2">Message sent!</p>
                <p className="font-body text-sm text-brand-muted">Thanks {form.name} — Valentin will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5">
                {status === 'error' && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-body text-[13px] rounded-md">
                    Something went wrong — please try again.
                  </div>
                )}

                {([
                  [t.formName, 'text', 'name', true],
                  [t.formEmail, 'email', 'email', true],
                  [t.formOccasion, 'text', 'occasion', false],
                ] as [string, string, string, boolean][]).map(([label, type, key, required]) => (
                  <div key={key}>
                    <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">
                      {label}{required && ' *'}
                    </label>
                    <input
                      type={type}
                      required={required}
                      value={(form as any)[key]}
                      onChange={e => set(key, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal"
                    />
                  </div>
                ))}

                <div>
                  <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">{t.formDetails}</label>
                  <textarea
                    rows={5}
                    value={form.details}
                    onChange={e => set('details', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`w-full font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white py-4 px-8 rounded transition-opacity duration-200 hover:opacity-85 ${status === 'sending' ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand-teal cursor-pointer'}`}
                >
                  {status === 'sending' ? 'Sending…' : t.formSend}
                </button>
              </form>
            )}
          </div>

        </div>
      </ContainerStandard>
    </div>
  )
}
