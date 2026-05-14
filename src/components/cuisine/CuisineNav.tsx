'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Lang, Translations } from './translations';

interface Props {
  t: Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/shop', label: 'Shop' },
  { href: '/credentials', label: 'Credentials' },
];

export function CuisineNav({ t, lang, setLang }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: '#ffffff', borderBottom: '1px solid #ece8df',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 60px)',
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontWeight: 400, fontStyle: 'italic',
          color: '#b03060', textDecoration: 'none', letterSpacing: 0.5,
        }}>
          {t.tagline}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 36 }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 400,
              letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
              color: pathname === href ? '#1a1a1a' : 'rgba(26,26,26,0.5)',
              transition: 'color 0.2s',
            }}>
              {label}
            </Link>
          ))}
          <span style={{ width: 1, height: 16, background: '#ece8df', display: 'inline-block' }} />
          <Link href="/shop" style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
            color: '#b03060', transition: 'opacity 0.2s',
          }}>
            Order
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, padding: 6,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: '#1a1a1a', transition: 'transform 0.2s, opacity 0.2s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: '#1a1a1a', transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: '#1a1a1a', transition: 'transform 0.2s, opacity 0.2s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="flex md:hidden" style={{
          flexDirection: 'column', background: '#ffffff',
          borderTop: '1px solid #ece8df', padding: '8px clamp(16px, 5vw, 60px) 28px',
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: pathname === href ? 600 : 400,
              letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
              color: pathname === href ? '#1a1a1a' : 'rgba(26,26,26,0.55)',
              padding: '14px 0', borderBottom: '1px solid #f0ece4',
            }}>
              {label}
            </Link>
          ))}
          <Link href="/shop" onClick={() => setMenuOpen(false)} style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: 1.5, textTransform: 'uppercase', color: '#b03060',
            textDecoration: 'none', display: 'inline-block', marginTop: 20,
          }}>
            Order
          </Link>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {(['en', 'fr', 'vi'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '5px 12px', fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4,
                background: lang === l ? '#1a1a1a' : 'transparent',
                color: lang === l ? '#fff' : 'rgba(26,26,26,0.4)',
                border: `1px solid ${lang === l ? '#1a1a1a' : '#ece8df'}`,
                transition: 'all 0.2s',
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
