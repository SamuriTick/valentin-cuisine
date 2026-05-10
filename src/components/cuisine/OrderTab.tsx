'use client';

import { useState } from 'react';
import { Translations } from './translations';

interface Props { t: Translations }

export function OrderTab({ t }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', occasion: '', details: '' })
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: 'var(--white)',
    border: '1px solid var(--border)', fontSize: 14, color: 'var(--dark)',
    outline: 'none', fontFamily: "'Nunito', sans-serif", boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, letterSpacing: 1.5,
    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8,
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 40px' }}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>{t.orderEyebrow}</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>{t.orderTitle}</h2>
        <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0' }} />
        <p style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 40 }}>{t.orderBody}</p>

        {status === 'sent' ? (
          <div style={{ padding: '32px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 4, textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#166534', marginBottom: 8 }}>Message sent!</p>
            <p style={{ fontSize: 14, color: '#15803D' }}>Thanks {form.name} — Valentin will be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {status === 'error' && (
              <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 13, borderRadius: 4 }}>
                Something went wrong. Please try emailing directly at valentin.thang@gmail.com
              </div>
            )}

            {([
              [t.formName, 'text', 'name', true],
              [t.formEmail, 'email', 'email', true],
              [t.formPhone, 'tel', 'phone', false],
              [t.formOccasion, 'text', 'occasion', false],
            ] as [string, string, string, boolean][]).map(([label, type, key, required]) => (
              <div key={key}>
                <label style={labelStyle}>{label}{required && ' *'}</label>
                <input
                  type={type} required={required}
                  value={(form as any)[key]}
                  onChange={e => set(key, e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}

            <div>
              <label style={labelStyle}>{t.formDetails}</label>
              <textarea rows={5} value={form.details} onChange={e => set('details', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={status === 'sending'} style={{
              background: status === 'sending' ? 'var(--muted)' : 'var(--green)',
              color: '#fff', fontSize: 11, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 32px',
              border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start', borderRadius: 2,
            }}>
              {status === 'sending' ? 'Sending…' : t.formSend}
            </button>
          </form>
        )}

        <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--dark)', marginBottom: 16 }}>{t.contactTitle}</p>
          <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 2 }}>
            📧 <a href="mailto:valentin.thang@gmail.com" style={{ color: 'var(--green)' }}>valentin.thang@gmail.com</a><br />
            📞 <a href="tel:+447903964441" style={{ color: 'var(--green)' }}>+44 7903 964 441</a><br />
            📍 Putney, London
          </p>
        </div>
      </div>
    </div>
  )
}
