import { PageNav } from '@/components/cuisine/PageNav';
import { StaticFooter } from '@/components/cuisine/StaticFooter';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';




const CATEGORIES = ['cake', 'pastry', 'bread', 'fermented', 'seasonal'];
const CATEGORY_LABELS: Record<string, string> = {
  cake: 'Cakes',
  pastry: 'Pastries',
  bread: 'Bread',
  fermented: 'Fermented',
  seasonal: 'Seasonal',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  
  const activeCategory = searchParams.category || 'all';

  const products = await prisma.product.findMany({
    where: {
      available: true,
      ...(activeCategory !== 'all' ? { category: activeCategory } : {}),
    },
    orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
  });

  return (
    <>
      <PageNav />
      <div style={{ paddingTop: 68, minHeight: '100vh', background: 'var(--cream)' }}>

        {/* Header */}
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '56px 40px 40px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>Order Online</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--dark)', marginBottom: 6 }}>Shop</h1>
            <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 16px' }} />
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.7 }}>
              Available weekends & school holidays · Orders confirmed within 24 hours
            </p>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', ...CATEGORIES].map(cat => (
                <Link key={cat} href={cat === 'all' ? '/shop' : `/shop?category=${cat}`} style={{
                  padding: '6px 16px', fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                  textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
                  background: activeCategory === cat ? 'var(--green)' : 'var(--warm)',
                  color: activeCategory === cat ? '#fff' : 'var(--muted)',
                  border: '1px solid var(--border)',
                }}>
                  {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 40px 80px' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--muted)' }}>
                Products coming soon
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 12 }}>
                In the meantime, <Link href="/#order" style={{ color: 'var(--green)' }}>send a custom order</Link>
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {products.map(product => (
                <div key={product.id} style={{ background: 'var(--white)' }}>
                  {product.imageUrl ? (
                    <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
                      <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '4/3', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: 'var(--border)' }}>V</span>
                    </div>
                  )}
                  <div style={{ padding: '20px 24px 24px' }}>
                    <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                      {CATEGORY_LABELS[product.category] || product.category}
                      {product.featured && ' · Featured'}
                    </p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--dark)', marginBottom: 8, lineHeight: 1.3 }}>
                      {product.name}
                    </h2>
                    {product.description && (
                      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>{product.description}</p>
                    )}
                    {product.orderNote && (
                      <p style={{ fontSize: 12, color: 'var(--mid)', fontStyle: 'italic', marginBottom: 16 }}>{product.orderNote}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: 'var(--green)' }}>
                        {product.price || 'Price on request'}
                      </span>
                      <Link href={`mailto:valentin.thang@gmail.com?subject=Order: ${encodeURIComponent(product.name)}`} style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                        color: 'var(--white)', background: 'var(--green)',
                        textDecoration: 'none', padding: '8px 14px', borderRadius: 2,
                      }}>
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <StaticFooter />
    </>
  );
}
