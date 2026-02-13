import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Users, Shield, Zap, Heart, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'About Us - ToolForge AI',
  description: 'Learn about ToolForge AI, our mission to help you discover the best AI tools, and our commitment to honest, comprehensive reviews.',
  keywords: ['about toolforge', 'ai tools directory', 'our mission', 'ai tool reviews'],
};

export const revalidate = 3600;

async function getAboutStats() {
  const [toolsResult, postsResult, toolsForCategories] = await Promise.all([
    supabase
      .from('tools')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('tools')
      .select('category')
      .eq('status', 'published'),
  ]);

  const toolCount = toolsResult.count || 0;
  const postCount = postsResult.count || 0;
  const categories = new Set((toolsForCategories.data || []).map(t => t.category));
  const categoryCount = categories.size;

  return { toolCount, categoryCount, postCount };
}

export default async function AboutPage() {
  const stats = await getAboutStats();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="gradient-text">ToolForge AI</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're on a mission to help everyone discover, compare, and choose the best AI tools
            for their needs through honest reviews and comprehensive comparisons.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-8 md:p-12 text-white mb-16">
          <div className="flex items-start gap-4 mb-4">
            <Target className="w-8 h-8 flex-shrink-0" />
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-primary-100 leading-relaxed">
                In a rapidly evolving AI landscape, finding the right tools can be overwhelming.
                ToolForge AI cuts through the noise by providing curated, honest reviews and
                comprehensive comparisons of AI tools across every category. We believe everyone
                should have access to the best AI technology, and we're here to make that journey
                easier.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Honest Reviews</h3>
              <p className="text-gray-600">
                We provide unbiased, transparent reviews based on real testing and research.
                Our reputation depends on your trust.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User-Focused</h3>
              <p className="text-gray-600">
                Everything we do is designed to help you make informed decisions. Your success
                is our success.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Always Current</h3>
              <p className="text-gray-600">
                The AI landscape moves fast. We continuously update our directory with new tools
                and keep existing reviews fresh.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover New Tools</h3>
                <p className="text-gray-600">
                  We constantly scout the AI landscape to find and review new tools across every
                  category, from writing and design to coding and productivity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Test & Review</h3>
                <p className="text-gray-600">
                  Every tool in our directory is thoroughly tested and reviewed. We look at
                  features, pricing, ease of use, and real-world applications.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Compare & Recommend</h3>
                <p className="text-gray-600">
                  We create detailed comparisons and provide honest recommendations to help you
                  choose the right tool for your specific needs and budget.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">{stats.toolCount}+</div>
            <div className="text-gray-600">AI Tools Reviewed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-gray-600">Monthly Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">{stats.categoryCount}+</div>
            <div className="text-gray-600">Categories Covered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">Daily</div>
            <div className="text-gray-600">New Additions</div>
          </div>
        </div>

        {/* Team Note */}
        <div className="bg-primary-50 rounded-lg p-8 md:p-12 mb-16 text-center">
          <Heart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Built by AI Enthusiasts, For Everyone
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We're a team of developers, designers, and AI enthusiasts who are passionate about
            making AI technology accessible to everyone. We use these tools ourselves and
            understand the challenges of finding the right ones.
          </p>
        </div>

        {/* Transparency */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 mb-16">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Transparency</h2>
              <p className="text-gray-700 mb-4">
                We believe in full transparency about how we operate:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>
                    We may earn affiliate commissions when you purchase tools through our links.
                    This helps us keep the site running and continue providing free content.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>
                    Affiliate relationships never influence our reviews or ratings. We only
                    recommend tools we genuinely believe in.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span>
                    Sponsored placements are clearly labeled and separate from our editorial
                    content and recommendations.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-gray-700">
                Read our full{' '}
                <Link href="/disclaimer" className="text-primary-600 hover:text-primary-700 font-medium">
                  Affiliate Disclosure
                </Link>{' '}
                for more details.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Find Your Perfect AI Tool?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse our comprehensive directory and discover tools that will transform your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button variant="primary" size="lg">
                Browse All Tools
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
