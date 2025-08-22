import { Metadata } from 'next'
import Container from '@/components/Container'
import SectionTitle from '@/components/SectionTitle'
import { TextOnlyHero } from '@/components/TextOnlyHero'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News & Announcements | West Acton Community Centre',
  description: 'Stay updated with the latest news, announcements, and notices from West Acton Community Centre',
}

async function getNews() {
  try {
    // Use prisma directly in server components for better performance
    const { prisma } = await import('@/lib/prisma')
    const news = await prisma.newsPost.findMany({
      where: {
        published: true
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    
    // Convert dates to strings for serialization
    return news.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

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

export default async function NewsPage() {
  const news = await getNews()
  const featuredNews = news.filter((post: NewsPost) => post.featured)
  const regularNews = news.filter((post: NewsPost) => !post.featured)

  return (
    <>
      <TextOnlyHero
        title="News & Announcements"
        subtitle="Stay updated with the latest news, events, and important notices from West Acton Community Centre"
      />
      
      <Container>
        <div className="py-16 space-y-16">
          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div className="space-y-8">
              <SectionTitle
                title="Featured News"
                pretitle="Important"
              />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredNews.map((post: NewsPost) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    {post.imageUrl && (
                      <div className="aspect-w-16 aspect-h-9 overflow-hidden bg-gray-200">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {post.publishedAt && (
                          <span>{formatDate(post.publishedAt)}</span>
                        )}
                        {post.author && (
                          <span>By {post.author}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular News */}
          {regularNews.length > 0 && (
            <div className="space-y-8">
              <SectionTitle
                title="Latest News"
                pretitle="Updates"
              />
              <div className="space-y-6">
                {regularNews.map((post: NewsPost) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {post.imageUrl && (
                        <div className="md:w-1/3 lg:w-1/4">
                          <div className="aspect-w-16 aspect-h-9 md:aspect-h-full overflow-hidden bg-gray-200 h-48 md:h-full">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}
                      <div className={`flex-1 p-6 ${post.imageUrl ? '' : 'md:col-span-full'}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                          {post.tags && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.split(',').slice(0, 3).map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            {post.publishedAt && (
                              <span>{formatDate(post.publishedAt)}</span>
                            )}
                            {post.author && (
                              <span>By {post.author}</span>
                            )}
                          </div>
                          <span className="text-primary-600 group-hover:text-primary-700 font-medium">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {news.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news posts available</h3>
              <p className="text-gray-600">Check back later for updates and announcements.</p>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}