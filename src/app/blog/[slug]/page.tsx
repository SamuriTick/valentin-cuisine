
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';




export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  return (
    <>
      <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--cream)' }}>

        {/* Hero image */}
        {post.imageUrl && (
          <div style={{ height: 'clamp(200px, 40vw, 400px)', overflow: 'hidden' }}>
            <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(40px, 6vw, 56px) clamp(16px, 5vw, 40px) clamp(64px, 8vw, 96px)' }}>
          {/* Breadcrumb */}
          <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 32 }}>
            <Link href="/blog" style={{ color: 'var(--green)', textDecoration: 'none' }}>Blog</Link>
            {' → '}
            {post.category}
          </p>

          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 20, color: 'var(--gold)', marginBottom: 10 }}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--dark)', lineHeight: 1.2, marginBottom: 16 }}>
            {post.title}
          </h1>

          {post.publishedAt && (
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '24px 0 40px' }} />

          {post.excerpt && (
            <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 40, fontStyle: 'italic' }}>
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
          />

          {post.tags && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {post.tags.split(',').map(tag => (
                <span key={tag} style={{
                  padding: '4px 12px', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
                  background: 'var(--warm)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 2,
                }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 48 }}>
            <Link href="/blog" style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
              color: 'var(--green)', textDecoration: 'none',
            }}>
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>

    </>
  );
}
