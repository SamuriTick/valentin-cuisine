
import Link from 'next/link';
import { prisma } from '@/lib/prisma';




const BLOG_CATEGORIES = ['recipe', 'news', 'update'];
const CATEGORY_LABELS: Record<string, string> = {
  recipe: 'Recipe',
  news: 'News',
  update: 'Update',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  
  const activeCategory = searchParams.category || 'all';

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      category: activeCategory === 'all'
        ? { in: BLOG_CATEGORIES }
        : activeCategory,
    },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <>
      <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--cream)' }}>

        {/* Header */}
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: 'clamp(40px, 6vw, 56px) clamp(16px, 5vw, 40px) 40px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>Cooking Diary</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--dark)', marginBottom: 6 }}>
              Blog
            </h1>
            <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 28px' }} />

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['all', ...BLOG_CATEGORIES].map(cat => (
                <Link key={cat} href={cat === 'all' ? '/blog' : `/blog?category=${cat}`} style={{
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

        {/* Posts grid */}
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(32px, 5vw, 48px) clamp(16px, 5vw, 40px) 80px' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--muted)' }}>
                Posts coming soon
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--white)', padding: 0, transition: 'background 0.2s' }}>
                    {post.imageUrl && (
                      <div style={{ overflow: 'hidden', aspectRatio: '16/9' }}>
                        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    )}
                    <div style={{ padding: '24px 28px 28px' }}>
                      <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>
                        {CATEGORY_LABELS[post.category] || post.category}
                        {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </p>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--dark)', marginBottom: 10, lineHeight: 1.3 }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
                      )}
                      <p style={{ marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--green)' }}>
                        Read →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
}
