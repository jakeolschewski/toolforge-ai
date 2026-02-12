// BlogGrid Component - Grid layout for blog posts

import type { BlogPost } from '@/types';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  featured?: BlogPost;
}

export default function BlogGrid({ posts, featured }: BlogGridProps) {
  return (
    <div className="space-y-12">
      {featured && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Post
          </h2>
          <BlogCard post={featured} featured />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No blog posts found.</p>
        </div>
      )}
    </div>
  );
}
