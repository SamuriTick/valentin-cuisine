import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  const CATEGORY_LABELS: Record<string, string> = { recipe: 'Recipe', news: 'News', update: 'Update' };

  return (
    <div className="bg-brand-light min-h-screen font-body">

      {/* Hero image */}
      {post.imageUrl && (
        <div className="pt-[72px]" style={{ height: 'clamp(220px, 40vw, 420px)', overflow: 'hidden' }}>
          <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Article */}
      <div className={post.imageUrl ? '' : 'pt-[72px]'}>
        <ContainerStandard className="py-12 md:py-16 max-w-[720px]">

          {/* Breadcrumb */}
          <p className="font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-8">
            <Link href="/blog" style={{ color: '#2a7c6f', textDecoration: 'none' }}>Blog</Link>
            <span className="mx-2">·</span>
            {CATEGORY_LABELS[post.category] || post.category}
          </p>

          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">
            {CATEGORY_LABELS[post.category] || post.category}
          </p>
          <h1 className="font-display font-light text-[clamp(28px,4vw,48px)] text-brand-dark leading-[1.15] tracking-[-1px] mb-4">
            {post.title}
          </h1>

          {post.publishedAt && (
            <p className="font-body text-[12px] text-brand-muted mb-2">
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}

          <div className="w-10 h-px bg-brand-border mt-5 mb-8" />

          {post.excerpt && (
            <p className="font-display font-light text-[clamp(18px,2vw,22px)] text-brand-dark leading-[1.6] italic mb-8">
              {post.excerpt}
            </p>
          )}

          {/* Body */}
          <div
            className="font-body text-sm text-brand-muted leading-[1.9] prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && (
            <div className="mt-12 pt-8 border-t border-brand-border flex gap-2 flex-wrap">
              {post.tags.split(',').map(tag => (
                <span key={tag} style={{
                  padding: '4px 12px', fontSize: 10, letterSpacing: '0.15em',
                  textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif", fontWeight: 600,
                  background: '#f4f1ed', color: '#7A7060',
                  border: '1px solid #e8e3dc', borderRadius: 99,
                }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Link href="/blog" style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#2a7c6f', textDecoration: 'none',
            }}>
              ← Back to Blog
            </Link>
          </div>

        </ContainerStandard>
      </div>
    </div>
  );
}
