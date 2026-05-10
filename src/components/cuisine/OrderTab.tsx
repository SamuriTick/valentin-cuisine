'use client';

import { Translations } from './translations';

interface Props { t: Translations }

export function OrderTab({ t }: Props) {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 40px' }}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>{t.orderEyebrow}</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>{t.orderTitle}</h2>
        <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0' }} />
        <p style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 40 }}>{t.orderBody}</p>

        <form action="mailto:valentin.thang@gmail.com" method="get" encType="text/plain"
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {([
            [t.formName, 'text', 'name'],
            [t.formEmail, 'email', 'email'],
            [t.formPhone, 'tel', 'phone'],
            [t.formOccasion, 'text', 'occasion'],
          ] as [string, string, string][]).map(([label, type, name]) => (
            <div key={name}>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                {label}
              </label>
              <input type={type} name={name} style={{
                width: '100%', padding: '12px 16px', background: 'var(--white)',
                border: '1px solid var(--border)', fontSize: 14, color: 'var(--dark)',
                outline: 'none', fontFamily: "'Nunito', sans-serif",
              }} />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
              {t.formDetails}
            </label>
            <textarea name="details" rows={5} style={{
              width: '100%', padding: '12px 16px', background: 'var(--white)',
              border: '1px solid var(--border)', fontSize: 14, color: 'var(--dark)',
              outline: 'none', fontFamily: "'Nunito', sans-serif", resize: 'vertical',
            }} />
          </div>

          <button type="submit" style={{
            background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 32px',
            border: 'none', cursor: 'pointer', alignSelf: 'flex-start', borderRadius: 2,
          }}>
            {t.formSend}
          </button>
        </form>

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
  );
}
