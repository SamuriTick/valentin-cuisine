'use client';

import { Tab, Translations } from './translations';

interface Props {
  t: Translations;
  setTab: (t: Tab) => void;
}

export function HeroSection({ t, setTab }: Props) {
  return (
    <section id="hero" style={{
      height: '100vh', minHeight: 600, maxHeight: 820,
      background: 'linear-gradient(to bottom, rgba(24,24,24,0.15) 0%, rgba(24,24,24,0.70) 100%), url(/img/hero-valentin.jpg) center/cover no-repeat',
      display: 'flex', alignItems: 'flex-end', paddingTop: 68,
    }}>
      <div style={{ maxWidth: 1160, width: '100%', margin: '0 auto', padding: '0 40px 72px' }}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'rgba(255,255,255,0.80)', marginBottom: 16 }}>
          {t.heroEyebrow}
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 7vw, 62px)',
          color: '#fff', lineHeight: 1.1, letterSpacing: -1, marginBottom: 20,
        }}>
          {t.heroTitle[0]}<br />
          <em style={{ fontStyle: 'italic' }}>{t.heroTitle[1]}</em><br />
          {t.heroTitle[2]}
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', maxWidth: 420, lineHeight: 1.8, marginBottom: 32 }}>
          {t.heroSub}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setTab('order')} style={{
            background: '#fff', color: 'var(--dark)', fontSize: 11, fontWeight: 600,
            letterSpacing: 1.5, textTransform: 'uppercase', padding: '13px 28px', border: 'none', cursor: 'pointer',
          }}>
            {t.heroCta}
          </button>
          <button onClick={() => setTab('about')} style={{
            background: 'transparent', color: '#fff', fontSize: 11, fontWeight: 400,
            letterSpacing: 1.5, textTransform: 'uppercase', padding: '13px 28px',
            border: '1px solid rgba(255,255,255,0.40)', cursor: 'pointer',
          }}>
            {t.heroLearn}
          </button>
        </div>
      </div>
    </section>
  );
}
