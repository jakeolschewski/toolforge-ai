'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';

const categories = [
  { name: 'Writing', slug: 'writing' },
  { name: 'Image Generation', slug: 'image' },
  { name: 'Video', slug: 'video' },
  { name: 'Code', slug: 'code' },
  { name: 'Chat', slug: 'chat' },
  { name: 'Productivity', slug: 'productivity' },
  { name: 'Marketing', slug: 'marketing' },
  { name: 'Design', slug: 'design' },
  { name: 'Audio', slug: 'audio' },
  { name: 'Research', slug: 'research' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-xl font-bold text-white">T</span>
              </div>
              <span className="text-xl font-bold gradient-text">ToolForge AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/tools" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                All Tools
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 200)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-lg border bg-white shadow-lg p-2 grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Blog
              </Link>

              <Link href="/compare" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Compare
              </Link>

              <Link href="/collections" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Collections
              </Link>

              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/submit"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Submit Tool
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <Link href="/tools" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              All Tools
            </Link>

            <Link href="/blog" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>

            <Link href="/compare" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              Compare Tools
            </Link>

            <Link href="/collections" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              Collections
            </Link>

            <div className="px-4 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/about" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>

            <Link href="/submit" className="mx-4 block text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              Submit Tool
            </Link>
          </div>
        )}

        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white border-b shadow-lg p-4">
            <input
              type="search"
              placeholder="Search AI tools..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
          </div>
        )}
      </nav>
    </header>
  );
}
