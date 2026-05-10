'use client';

import { Translations } from './translations';

interface Props { t: Translations }

export function AboutTab({ t }: Props) {
  return (
    <div>
      {/* Hero grid */}
      <div style={{ background: 'var(--white)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ minHeight: 520, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{
              width: 220, height: 220, borderRadius: '50%', background: 'var(--border)',
              border: '4px solid var(--gold)', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 60, color: 'var(--green)' }}>V</span>
            </div>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--dark)' }}>Valentin Thang</p>
            <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>
              {t.taglineSub}
            </p>
          </div>
        </div>

        <div style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>
            {t.aboutEyebrow}
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 1.2, color: 'var(--dark)', marginBottom: 6 }}>
            {t.aboutTitle[0]}<br />
            <em style={{ fontStyle: 'italic', color: 'var(--green)' }}>{t.aboutTitle[1]}</em>
          </h2>
          <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0' }} />
          <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 16 }}>{t.aboutBody1}</p>
          <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8 }}>{t.aboutBody2}</p>
          <blockquote style={{ marginTop: 28, padding: '18px 24px', borderLeft: '2px solid var(--gold)', background: 'var(--warm)' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, fontStyle: 'italic', color: 'var(--mid)', lineHeight: 1.8 }}>
              {t.aboutQuote}
            </p>
            <cite style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8, fontStyle: 'normal' }}>
              {t.aboutQuoteCredit}
            </cite>
          </blockquote>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--border)' }}>
          {([
            [t.statsLabel1, t.statsDesc1],
            [t.statsLabel2, t.statsDesc2],
            [t.statsLabel3, t.statsDesc3],
          ] as [string, string][]).map(([label, desc]) => (
            <div key={label} style={{ background: 'var(--cream)', padding: '40px 36px' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--green)', lineHeight: 1, marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.7, marginTop: 10 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story blocks */}
      <div style={{ background: 'var(--warm)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {([
            [t.storyTitle1, t.storyBody1],
            [t.storyTitle2, t.storyBody2],
            [t.storyTitle3, t.storyBody3],
            [t.storyTitle4, t.storyBody4],
          ] as [string, string][]).map(([title, body]) => (
            <div key={title}>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 18, color: 'var(--gold)', marginBottom: 10 }}>Experience</p>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--dark)', marginBottom: 12, lineHeight: 1.3 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.9, fontWeight: 300 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
