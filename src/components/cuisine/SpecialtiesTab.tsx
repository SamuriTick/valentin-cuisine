'use client';

import { Tab, Translations } from './translations';

interface Props { t: Translations; setTab: (t: Tab) => void }

export function SpecialtiesTab({ t, setTab }: Props) {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 40px' }}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>{t.specEyebrow}</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>{t.specTitle}</h2>
        <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 40px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          {t.dishes.map((dish) => (
            <div key={dish.name} style={{ background: 'var(--white)', padding: '32px 28px' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--dark)', marginBottom: 12, lineHeight: 1.3 }}>{dish.name}</p>
              <div style={{ width: 24, height: 1, background: 'var(--gold)', marginBottom: 14 }} />
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{dish.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <button onClick={() => setTab('order')} style={{
            background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 32px',
            border: 'none', cursor: 'pointer', borderRadius: 2,
          }}>
            {t.heroCta}
          </button>
        </div>
      </div>
    </div>
  );
}
