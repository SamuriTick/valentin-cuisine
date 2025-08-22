import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import Link from 'next/link'

interface NewsPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  category: string
  tags: string | null
  author: string | null
  featured: boolean
  published: boolean
  publishedAt: string | null
  displayOrder: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

async function getNewsPost(slug: string): Promise<NewsPost | null> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const post = await prisma.newsPost.findUnique({
      where: { slug }
    })
    
    if (!post) {
      return null
    }
    
    // Increment view count
    await prisma.newsPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })
    
    // Convert dates to strings for serialization
    return {
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    } as NewsPost
  } catch (error) {
    console.error('Error fetching news post:', error)
    return null
  }
}

async function getRelatedNews(category: string, currentSlug: string): Promise<NewsPost[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const news = await prisma.newsPost.findMany({
      where: {
        published: true,
        category,
        slug: { not: currentSlug }
      },
      orderBy: { publishedAt: 'desc' },
      take: 3
    })
    
    // Convert dates to strings for serialization
    return news.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    })) as NewsPost[]
  } catch (error) {
    console.error('Error fetching related news:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getNewsPost(params.slug)
  
  if (!post) {
    return {
      title: 'News Post Not Found | West Acton Community Centre',
    }
  }
  
  return {
    title: `${post.title} | West Acton Community Centre`,
    description: post.excerpt || post.content.substring(0, 160),
  }
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'general': 'bg-gray-100 text-gray-800',
    'announcement': 'bg-blue-100 text-blue-800',
    'event': 'bg-purple-100 text-purple-800',
    'update': 'bg-green-100 text-green-800',
    'notice': 'bg-yellow-100 text-yellow-800',
    'community': 'bg-indigo-100 text-indigo-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = await getNewsPost(params.slug)
  
  if (!post || !post.published) {
    notFound()
  }
  
  const relatedNews = await getRelatedNews(post.category, post.slug)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Image */}
      {post.imageUrl && (
        <div className="relative h-64 md:h-96 bg-gray-900">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      
      <Container>
        <div className="py-8 md:py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/news" className="text-gray-500 hover:text-gray-700">
                  News
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{post.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
              {/* Post Header */}
              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                  {post.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-4 border-b">
                  {post.author && (
                    <span>By <strong className="text-gray-700">{post.author}</strong></span>
                  )}
                  {post.publishedAt && (
                    <span>{formatDate(post.publishedAt)}</span>
                  )}
                  <span>{post.viewCount} views</span>
                </div>
              </header>

              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.split(',').map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Related News</h2>
                  <div className="space-y-4">
                    {relatedNews.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/news/${relatedPost.slug}`}
                        className="block group"
                      >
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                          {relatedPost.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {relatedPost.publishedAt && formatDate(relatedPost.publishedAt)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to News */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <Link
                  href="/news"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to all news
                </Link>
              </div>

              {/* Contact Info */}
              <div className="bg-primary-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Don't miss any important updates from West Acton Community Centre.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  )
}