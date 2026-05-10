'use client';

import { Translations } from './translations';

interface Props { t: Translations }

export function CuisineFooter({ t }: Props) {
  return (
    <footer style={{
      background: 'var(--green)', color: 'rgba(255,255,255,0.60)',
      padding: '32px 40px', textAlign: 'center',
      fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 1,
    }}>
      <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 8 }}>
        {t.tagline}
      </p>
      <p>{t.footerLine}</p>
    </footer>
  );
}
