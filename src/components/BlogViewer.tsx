import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, MessageCircle } from 'lucide-react';

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

interface BlogViewerProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogViewer({ post, onBack }: BlogViewerProps) {
  const fullContent = `
    <p>Research shows that changing your hairstyle can significantly impact your self-perception and confidence levels. This fascinating connection between our appearance and psychological well-being has been studied extensively by psychologists and beauty experts alike.</p>
    
    <h3>The Science Behind Hair and Confidence</h3>
    <p>When we look good, we feel good - and this isn't just a saying. Studies have shown that people who are satisfied with their appearance, including their hairstyle, tend to have higher self-esteem and confidence levels. Your hairstyle is often the first thing people notice about you, making it a crucial element of your personal brand.</p>
    
    <h3>How Different Styles Affect Your Mood</h3>
    <p>Different hairstyles can evoke different feelings and personas:</p>
    <ul>
      <li><strong>Short, sleek cuts</strong> often make people feel more professional and confident</li>
      <li><strong>Long, flowing hair</strong> can enhance feelings of femininity and grace</li>
      <li><strong>Bold, edgy styles</strong> can boost creativity and self-expression</li>
      <li><strong>Classic styles</strong> provide a sense of timelessness and reliability</li>
    </ul>
    
    <h3>The Power of Change</h3>
    <p>Sometimes, all it takes is a new hairstyle to completely transform how you feel about yourself. Many people report feeling like a "new person" after a significant hair change. This psychological boost can have lasting effects on various aspects of life, from career performance to social interactions.</p>
    
    <h3>Finding Your Confidence Style</h3>
    <p>The key is finding a hairstyle that not only looks good but also makes you feel authentically yourself. Consider these factors:</p>
    <ul>
      <li>Your lifestyle and maintenance preferences</li>
      <li>Your face shape and features</li>
      <li>Your personal style and personality</li>
      <li>Your professional requirements</li>
    </ul>
    
    <p>Remember, confidence comes from within, but the right hairstyle can certainly help bring it to the surface. Whether you're looking for a subtle change or a dramatic transformation, the most important thing is that you feel comfortable and confident in your own skin.</p>
  `;

  const relatedPosts = [
    {
      id: '2',
      title: 'AI in Beauty: How Technology is Revolutionizing Hair Styling',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      title: '2024 Hair Trends: What Styles Are Taking Over This Year',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: fullContent }}
                />
              </div>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Actions */}
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Like (24)
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment (8)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author Info */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">About the Author</h4>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">{post.author}</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Hair psychology expert with over 10 years of research experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Related Articles</h4>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <h5 className="font-medium text-sm leading-tight">
                              {relatedPost.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Stay Updated</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get the latest hair trends and styling tips delivered to your inbox.
                    </p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Subscribe to Newsletter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}