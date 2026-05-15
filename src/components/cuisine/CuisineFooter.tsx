import Link from 'next/link';
import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';

interface Props { t: Translations }

export function CuisineFooter({ t }: Props) {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid #ece8df' }}>

      {/* Main footer row */}
      <ContainerStandard>
        <div style={{ padding: '32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20, fontWeight: 400, fontStyle: 'italic',
            color: '#b03060', textDecoration: 'none', letterSpacing: 0.5,
          }}>
            Valentin&rsquo;s Cuisine
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/contact', label: 'Contact' },
              { href: '/kimchi', label: 'Order Kimchi' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 11,
                letterSpacing: 1.5, textTransform: 'uppercase', textDecoration: 'none',
                color: 'rgba(26,26,26,0.5)', transition: 'color 0.2s',
              }}>
                {label}
              </Link>
            ))}
          </div>

        </div>
      </ContainerStandard>

      {/* Copyright bar */}
      <div style={{ borderTop: '1px solid #ece8df' }}>
        <ContainerStandard>
          <p style={{
            padding: '16px 0', margin: 0,
            fontFamily: "'Nunito', sans-serif", fontSize: 11,
            letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'rgba(26,26,26,0.35)', textAlign: 'center',
          }}>
            &copy; 2025 Valentin&rsquo;s Cuisine &middot; Putney, London &middot; Made with love
          </p>
        </ContainerStandard>
      </div>

    </footer>
  );
}
