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
  { href: '/kimchi', label: 'Kimchi' },
  { href: '/contact', label: 'Contact' },
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
          <Link href="/kimchi" style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
            background: '#b03060', color: '#fff', padding: '6px 14px', borderRadius: 4,
            transition: 'opacity 0.2s',
          }}>
            Order Kimchi
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
          <Link href="/kimchi" onClick={() => setMenuOpen(false)} style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', color: '#fff',
            textDecoration: 'none', display: 'inline-block', marginTop: 20,
            background: '#b03060', padding: '10px 20px', borderRadius: 4,
            textAlign: 'center',
          }}>
            Order Kimchi
          </Link>
        </div>
      )}
    </nav>
  );
}
