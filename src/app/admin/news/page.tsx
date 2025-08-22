"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import AdminAuth from "@/components/AdminAuth"
import FileUpload from "@/components/FileUpload"

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

export default function NewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterPublished, setFilterPublished] = useState("")
  
  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null)
  const [formData, setFormData] = useState<Partial<NewsPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'general',
    tags: '',
    author: '',
    featured: false,
    published: false,
    displayOrder: 0
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      setError('Failed to load news posts')
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')

    if (!formData.title?.trim()) {
      setFormError('Title is required')
      setFormLoading(false)
      return
    }

    if (!formData.content?.trim()) {
      setFormError('Content is required')
      setFormLoading(false)
      return
    }

    try {
      const url = editingPost 
        ? `/api/news/${editingPost.id}`
        : '/api/news'
      
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save news post')
      }

      await fetchNews()
      setShowForm(false)
      setEditingPost(null)
      resetForm()
    } catch (error) {
      console.error('Error saving news post:', error)
      setFormError(error instanceof Error ? error.message : 'Failed to save news post')
    } finally {
      setFormLoading(false)
    }
  }

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news post?')) return

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete news post')
      
      fetchNews()
    } catch (error) {
      console.error('Error deleting news post:', error)
      alert('Failed to delete news post')
    }
  }

  const editPost = (post: NewsPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      imageUrl: post.imageUrl || '',
      category: post.category,
      tags: post.tags || '',
      author: post.author || '',
      featured: post.featured,
      published: post.published,
      displayOrder: post.displayOrder
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      category: 'general',
      tags: '',
      author: '',
      featured: false,
      published: false,
      displayOrder: 0
    })
    setEditingPost(null)
    setFormError('')
  }

  const getCategoryColor = (category: string) => {
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

  // Filter news
  const filteredNews = news.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === '' || post.category === filterCategory
    
    const matchesPublished = filterPublished === '' || 
      (filterPublished === 'published' && post.published) ||
      (filterPublished === 'draft' && !post.published)
    
    return matchesSearch && matchesCategory && matchesPublished
  })

  if (loading) {
    return (
      <AdminAuth>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </AdminLayout>
      </AdminAuth>
    )
  }

  return (
    <AdminAuth>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">News & Announcements</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage news posts, announcements, and notices
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true)
                  resetForm()
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium uppercase"
              >
                Add News Post
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {!showForm ? (
            <>
              {/* Search and Filter */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search news posts..."
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="general">General</option>
                      <option value="announcement">Announcement</option>
                      <option value="event">Event</option>
                      <option value="update">Update</option>
                      <option value="notice">Notice</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filterPublished}
                      onChange={(e) => setFilterPublished(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">All</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* News List */}
              <div className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="grid gap-6">
                    {filteredNews.map((post) => (
                      <div key={post.id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                                {post.category}
                              </span>
                              {post.featured && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                              {post.published ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Draft
                                </span>
                              )}
                            </div>
                            {post.excerpt && (
                              <p className="text-gray-600 mb-2">{post.excerpt}</p>
                            )}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              {post.author && <span>By: {post.author}</span>}
                              <span>Views: {post.viewCount}</span>
                              {post.publishedAt && (
                                <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                              )}
                              <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            {post.tags && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-2">
                                  {post.tags.split(',').map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700">
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => editPost(post)}
                              className="text-primary-600 hover:text-primary-900 text-sm font-medium uppercase"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePost(post.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium uppercase"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredNews.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        No news posts found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* News Form */
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingPost ? 'Edit News Post' : 'Add News Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="text-sm text-red-600">{formError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL-friendly name)
                    </label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Auto-generated from title if empty"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt || ''}
                    onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief summary of the news post..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    rows={10}
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Full content of the news post..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category || 'general'}
                      onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="general">General</option>
                      <option value="announcement">Announcement</option>
                      <option value="event">Event</option>
                      <option value="update">Update</option>
                      <option value="notice">Notice</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author || ''}
                      onChange={(e) => setFormData(prev => ({...prev, author: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder || 0}
                      onChange={(e) => setFormData(prev => ({...prev, displayOrder: parseInt(e.target.value) || 0}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags || ''}
                    onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Comma-separated tags (e.g., community, event, update)"
                  />
                </div>

                <div>
                  <FileUpload
                    onFileSelect={(mediaItem) => {
                      if (mediaItem.filePath) {
                        setFormData(prev => ({...prev, imageUrl: mediaItem.filePath}))
                      } else {
                        setFormData(prev => ({...prev, imageUrl: ''}))
                      }
                    }}
                    currentImage={formData.imageUrl || ''}
                    label="Featured Image"
                    accept="image/*"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData(prev => ({...prev, featured: e.target.checked}))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                      Featured Post
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published || false}
                      onChange={(e) => setFormData(prev => ({...prev, published: e.target.checked}))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
                      Published
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  >
                    {formLoading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminAuth>
  )
}