import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import BlogViewer from './BlogViewer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Psychology of Hair: How Your Hairstyle Affects Your Confidence',
    excerpt: 'Discover the fascinating connection between your hairstyle and self-confidence, backed by psychological research.',
    content: 'Research shows that changing your hairstyle can significantly impact your self-perception and confidence levels...',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Psychology',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=250&fit=crop',
    tags: ['confidence', 'psychology', 'self-image']
  },
  {
    id: '2',
    title: 'AI in Beauty: How Technology is Revolutionizing Hair Styling',
    excerpt: 'Explore how artificial intelligence is transforming the beauty industry and making personalized styling accessible to everyone.',
    content: 'Artificial intelligence has revolutionized many industries, and beauty is no exception...',
    author: 'Tech Team',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
    tags: ['AI', 'technology', 'beauty-tech']
  },
  {
    id: '3',
    title: '2024 Hair Trends: What Styles Are Taking Over This Year',
    excerpt: 'Stay ahead of the curve with the hottest hairstyle trends that are defining 2024.',
    content: 'As we move through 2024, several exciting hair trends have emerged that are capturing attention...',
    author: 'Emma Rodriguez',
    date: '2024-01-05',
    readTime: '4 min read',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=250&fit=crop',
    tags: ['trends', '2024', 'hairstyles']
  },
  {
    id: '4',
    title: 'Face Shape Guide: Finding Your Perfect Hairstyle Match',
    excerpt: 'Learn how to choose the most flattering hairstyle based on your unique face shape.',
    content: 'Understanding your face shape is crucial for selecting a hairstyle that enhances your natural features...',
    author: 'Maria Santos',
    date: '2023-12-28',
    readTime: '6 min read',
    category: 'Guide',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=250&fit=crop',
    tags: ['face-shape', 'guide', 'styling-tips']
  },
  {
    id: '5',
    title: 'Hair Care Essentials: Maintaining Healthy Hair for Any Style',
    excerpt: 'Essential tips and products for keeping your hair healthy, regardless of your chosen hairstyle.',
    content: 'Healthy hair is the foundation of any great hairstyle. Here are the essential care tips...',
    author: 'Dr. Michael Chen',
    date: '2023-12-20',
    readTime: '8 min read',
    category: 'Hair Care',
    image: 'https://images.unsplash.com/photo-1595475038665-8de2559af9b3?w=400&h=250&fit=crop',
    tags: ['hair-care', 'health', 'maintenance']
  },
  {
    id: '6',
    title: 'Color Theory in Hair: Understanding What Works Best',
    excerpt: 'Master the art of hair color selection with our comprehensive guide to color theory.',
    content: 'Choosing the right hair color involves understanding color theory and how different shades complement...',
    author: 'Lisa Park',
    date: '2023-12-15',
    readTime: '5 min read',
    category: 'Color',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=250&fit=crop',
    tags: ['color-theory', 'hair-color', 'styling']
  }
];

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <BlogViewer 
        post={selectedPost} 
        onBack={() => setSelectedPost(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hair & Style Blog
            </h1>
            <p className="text-xl text-gray-600">
              Expert insights, trends, and tips for your perfect hairstyle journey
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Featured Post */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div 
                className="md:flex"
                onClick={() => setSelectedPost(blogPosts[0])}
              >
                <div className="md:w-1/2">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4">{blogPosts[0].category}</Badge>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{blogPosts[0].readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-600 hover:text-purple-700">
                    <span className="font-medium">Read More</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Posts Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post) => (
                <Card 
                  key={post.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg leading-tight hover:text-purple-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}