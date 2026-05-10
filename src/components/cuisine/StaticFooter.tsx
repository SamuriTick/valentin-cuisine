export function StaticFooter() {
  return (
    <footer style={{
      background: 'var(--green)', color: 'rgba(255,255,255,0.60)',
      padding: '32px 40px', textAlign: 'center',
      fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 1,
    }}>
      <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 8 }}>
        Valentin&apos;s Cuisine
      </p>
      <p>© 2025 Valentin&apos;s Cuisine · Putney, London</p>
    </footer>
  );
}
