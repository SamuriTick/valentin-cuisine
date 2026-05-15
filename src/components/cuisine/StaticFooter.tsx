import Link from 'next/link';

export function StaticFooter() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #ece8df',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
    }}>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px, 5vw, 60px)' }}>
        <div style={{ padding: '36px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>

          <Link href="/" style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20, fontWeight: 400, fontStyle: 'italic',
            color: '#b03060', textDecoration: 'none', letterSpacing: 0.5,
          }}>
            Valentin&rsquo;s Cuisine
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/contact', label: 'Contact' },
              { href: '/kimchi', label: 'Order Kimchi' },
              { href: '/privacy', label: 'Privacy policy' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 13,
                letterSpacing: 0.2, textDecoration: 'none',
                color: 'rgba(26,26,26,0.5)',
              }}>
                {label}
              </Link>
            ))}
          </div>

        </div>
      </div>

      <div style={{ borderTop: '1px solid #ece8df' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px, 5vw, 60px)' }}>
          <p style={{
            padding: '16px 0', margin: 0,
            fontFamily: "'Nunito', sans-serif", fontSize: 11,
            letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'rgba(26,26,26,0.35)', textAlign: 'center',
          }}>
            Valentin&rsquo;s Cuisine &middot; Putney, London &middot; Made with love
          </p>
        </div>
      </div>

    </footer>
  );
}
