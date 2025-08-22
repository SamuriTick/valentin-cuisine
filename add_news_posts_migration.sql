-- Create news_posts table
CREATE TABLE IF NOT EXISTS news_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'general',
    tags TEXT,
    author VARCHAR(255),
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    display_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_posts_slug ON news_posts(slug);

-- Create index on published and published_at for listing queries
CREATE INDEX IF NOT EXISTS idx_news_posts_published ON news_posts(published, published_at DESC);

-- Create index on category
CREATE INDEX IF NOT EXISTS idx_news_posts_category ON news_posts(category);

-- Create index on featured
CREATE INDEX IF NOT EXISTS idx_news_posts_featured ON news_posts(featured);