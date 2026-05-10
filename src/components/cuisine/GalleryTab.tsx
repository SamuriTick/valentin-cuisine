'use client';

export function GalleryTab() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 40px' }}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>Behind the scenes</p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>Gallery</h2>
        <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 40px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{
              background: 'var(--warm)', aspectRatio: '1/1', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed var(--border)',
            }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: 'var(--muted)' }}>
                Photo {i + 1}
              </span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
          Photos coming soon — follow on Instagram for updates
        </p>
      </div>
    </div>
  );
}
