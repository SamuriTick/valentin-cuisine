'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { T, Lang } from './translations';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
];

export function PageNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const t = T[lang];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-white border-b-2 border-brand-gold shadow-[0_2px_24px_rgba(184,150,46,0.10)]">
      <div className="max-w-[1160px] mx-auto px-[clamp(16px,4vw,40px)] h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-serif-display text-[clamp(18px,4vw,24px)] text-brand-teal no-underline tracking-[2px] uppercase flex flex-col leading-[1.1]">
          {t.tagline}
          <span className="font-body text-[11px] italic text-brand-gold tracking-[1px] font-normal">
            {t.taglineSub}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          <div className="flex gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-body text-[11px] tracking-[1.5px] uppercase no-underline px-3 py-[6px] border-b-2 transition-colors duration-200 ${
                  pathname === href
                    ? 'font-bold text-brand-teal border-brand-teal'
                    : 'font-medium text-brand-muted border-transparent'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex border border-brand-border overflow-hidden rounded-[2px]">
            {(['en', 'fr', 'vi'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-[10px] py-[5px] font-body text-[10px] font-bold tracking-[1.5px] uppercase border-0 cursor-pointer ${
                  lang === l ? 'bg-brand-teal text-white' : 'bg-transparent text-brand-muted'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <Link href="/kimchi" className="font-body text-[11px] font-bold tracking-[1.5px] uppercase text-white bg-brand-teal no-underline px-[18px] py-2 rounded-[2px]">
            Order Kim Chi
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col gap-[5px] p-2 bg-transparent border-0 cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-[22px] h-[2px] bg-brand-teal transition-all duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block w-[22px] h-[2px] bg-brand-teal transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-[22px] h-[2px] bg-brand-teal transition-all duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="flex md:hidden flex-col gap-1 bg-white border-t border-brand-border px-[clamp(16px,4vw,40px)] pt-4 pb-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`font-body text-[13px] tracking-[1.5px] uppercase no-underline py-[10px] border-b border-brand-border ${
                pathname === href ? 'font-bold text-brand-teal' : 'font-medium text-brand-muted'
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="flex items-center gap-3 mt-4">
            <div className="flex border border-brand-border overflow-hidden rounded-[2px]">
              {(['en', 'fr', 'vi'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-[10px] py-[5px] font-body text-[10px] font-bold tracking-[1.5px] uppercase border-0 cursor-pointer ${
                    lang === l ? 'bg-brand-teal text-white' : 'bg-transparent text-brand-muted'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="/kimchi"
              onClick={() => setMenuOpen(false)}
              className="font-body text-[11px] font-bold tracking-[1.5px] uppercase text-white bg-brand-teal no-underline px-[18px] py-2 rounded-[2px]"
            >
              Order Kim Chi
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
