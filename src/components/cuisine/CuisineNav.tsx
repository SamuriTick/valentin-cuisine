'use client';

import { Lang, Tab, Translations } from './translations';

interface Props {
  t: Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
  setTab: (t: Tab) => void;
}

export function CuisineNav({ t, lang, setLang, setTab }: Props) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'var(--white)', borderBottom: '2px solid var(--gold)',
      boxShadow: '0 2px 24px rgba(184,150,46,0.10)',
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '0 40px',
        height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#hero" style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--green)',
          textDecoration: 'none', letterSpacing: 2, textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', lineHeight: 1.1,
        }}>
          {t.tagline}
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontStyle: 'italic', color: 'var(--gold)', letterSpacing: 1, fontWeight: 400 }}>
            {t.taglineSub}
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', overflow: 'hidden', borderRadius: 2 }}>
            {(['en', 'fr', 'vi'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '5px 10px', fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase',
                background: lang === l ? 'var(--green)' : 'none',
                color: lang === l ? '#fff' : 'var(--muted)', border: 'none', cursor: 'pointer',
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setTab('order')} style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            textTransform: 'uppercase', color: 'var(--white)', background: 'var(--green)',
            border: 'none', padding: '8px 18px', borderRadius: 2, cursor: 'pointer',
          }}>
            {t.navOrder}
          </button>
        </div>
      </div>
    </nav>
  );
}
