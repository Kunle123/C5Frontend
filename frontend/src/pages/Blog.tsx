import React from 'react';
import { Navigation } from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const Blog = () => {
  // Placeholder blog posts
  const posts = [
    {
      id: 1,
      title: "How to Write a CV That Gets Past ATS Systems",
      excerpt: "Learn the secrets to optimizing your CV for Applicant Tracking Systems while maintaining readability for human recruiters.",
      date: "2025-10-01",
      readTime: "5 min read",
      category: "CV Tips"
    },
    {
      id: 2,
      title: "The Power of Evidence-Based CV Writing",
      excerpt: "Why backing every statement with real evidence from your career makes you stand out to recruiters and hiring managers.",
      date: "2025-09-28",
      readTime: "4 min read",
      category: "Best Practices"
    },
    {
      id: 3,
      title: "Understanding RAG Keyword Analysis",
      excerpt: "A deep dive into our Red/Amber/Green keyword matching system and how it helps you target the right roles.",
      date: "2025-09-25",
      readTime: "6 min read",
      category: "Features"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tips, insights, and best practices for modern job seekers
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Button variant="link" className="p-0">
                  Read More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <Card className="mt-12 bg-muted/50">
          <CardContent className="py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">More Articles Coming Soon</h3>
            <p className="text-muted-foreground">
              We're working on more helpful content for job seekers. Check back soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
