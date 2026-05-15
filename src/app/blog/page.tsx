import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';

const BLOG_CATEGORIES = ['recipe', 'news', 'update'];
const CATEGORY_LABELS: Record<string, string> = {
  recipe: 'Recipe',
  news: 'News',
  update: 'Update',
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: "Recipes, updates, and stories from Valentin's kitchen in Putney, London.",
  openGraph: {
    title: "Blog · Valentin's Cuisine",
    description: "Recipes, updates, and stories from Valentin's kitchen in Putney, London.",
    type: 'website',
  },
};

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
    <div className="bg-brand-light min-h-screen font-body">

      {/* Header */}
      <div className="bg-white pt-[72px] border-b border-brand-border">
        <ContainerStandard className="py-16 md:py-20">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">Cooking Diary</p>
          <h1 className="font-display font-light text-[clamp(36px,5vw,60px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4">
            From the <span className="font-semibold italic text-brand-teal">kitchen.</span>
          </h1>
          <div className="w-12 h-px bg-brand-border mb-6" />
          <div className="flex gap-2 flex-wrap">
            {['all', ...BLOG_CATEGORIES].map(cat => (
              <Link
                key={cat}
                href={cat === 'all' ? '/blog' : `/blog?category=${cat}`}
                style={{
                  display: 'inline-block', padding: '6px 16px', borderRadius: 99,
                  fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none',
                  background: activeCategory === cat ? '#1a1a1a' : '#fff',
                  color: activeCategory === cat ? '#fff' : 'rgba(26,26,26,0.5)',
                  border: activeCategory === cat ? '1px solid #1a1a1a' : '1px solid #e8e3dc',
                  transition: 'all 0.15s',
                }}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </ContainerStandard>
      </div>

      {/* Posts */}
      <ContainerStandard className="py-12 md:py-16">
        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display font-light text-[clamp(22px,3vw,32px)] text-brand-muted">Posts coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="bg-white border border-brand-border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                  {post.imageUrl && (
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                      <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="font-body text-[10px] tracking-[2px] uppercase text-brand-teal mb-3">
                      {CATEGORY_LABELS[post.category] || post.category}
                      {post.publishedAt && (
                        <span className="text-brand-muted ml-2">
                          · {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </p>
                    <h2 className="font-display font-light text-[clamp(20px,2vw,26px)] text-brand-dark leading-[1.25] mb-3 flex-1">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="font-body text-sm text-brand-muted leading-[1.75] mb-4">{post.excerpt}</p>
                    )}
                    <p className="font-body text-[11px] font-bold tracking-[1.5px] uppercase text-brand-teal mt-auto">
                      Read →
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </ContainerStandard>
    </div>
  );
}
