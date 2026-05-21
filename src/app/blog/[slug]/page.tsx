import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';
import { getMediaDisplayUrl } from '@/lib/media-url';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, imageUrl: true, publishedAt: true },
  })

  if (!post) return { title: 'Post Not Found' }
  const imageUrl = post.imageUrl ? getMediaDisplayUrl(post.imageUrl) : null

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      ...(imageUrl && { images: [{ url: imageUrl, alt: post.title }] }),
      ...(post.publishedAt && { publishedTime: post.publishedAt.toISOString() }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();
  const imageUrl = post.imageUrl ? getMediaDisplayUrl(post.imageUrl) : null

  const CATEGORY_LABELS: Record<string, string> = { recipe: 'Recipe', news: 'News', update: 'Update' };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://valentincuisine.com'
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    author: { '@type': 'Person', name: 'Valentin Thang' },
    publisher: { '@type': 'Person', name: 'Valentin Thang' },
    url: `${BASE_URL}/blog/${post.slug}`,
    ...(imageUrl && { image: imageUrl }),
    ...(post.publishedAt && { datePublished: post.publishedAt.toISOString() }),
    ...(post.updatedAt && { dateModified: post.updatedAt.toISOString() }),
  }

  return (
    <div className="bg-brand-light min-h-screen font-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Hero image */}
      {imageUrl && (
        <div className="pt-[72px]" style={{ height: 'clamp(220px, 40vw, 420px)', overflow: 'hidden' }}>
          <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Article */}
      <div className={imageUrl ? '' : 'pt-[72px]'}>
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
