'use client';

import { Tab, Translations } from './translations';

interface Props {
  t: Translations;
  tab: Tab;
  setTab: (t: Tab) => void;
}

export function TabsBar({ t, tab, setTab }: Props) {
  const tabs: [Tab, string][] = [
    ['about', t.navAbout],
    ['specialties', t.navSpecialties],
    ['gallery', t.navGallery],
    ['order', t.navOrder],
  ];

  return (
    <div style={{
      position: 'sticky', top: 68, zIndex: 100,
      background: 'var(--white)', borderBottom: '1px solid var(--border)', overflowX: 'auto',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'flex' }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '16px 24px', fontFamily: "'Nunito', sans-serif", fontSize: 11,
            fontWeight: tab === key ? 600 : 400, letterSpacing: 1.5, textTransform: 'uppercase',
            color: tab === key ? 'var(--green)' : 'var(--muted)',
            background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === key ? 'var(--green)' : 'transparent'}`,
            cursor: 'pointer', marginBottom: -1, transition: 'all 0.2s',
          }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
