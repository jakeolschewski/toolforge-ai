'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Upload,
  Download,
  Activity,
  Wand2,
  BookOpen,
  GitCompare,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/utils/helpers';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Pending Drafts',
    href: '/admin/drafts',
    icon: FileText,
  },
  {
    title: 'Tools',
    href: '/admin/tools',
    icon: Package,
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Blog Posts',
    href: '/admin/blog',
    icon: BookOpen,
  },
  {
    title: 'Comparisons',
    href: '/admin/comparisons',
    icon: GitCompare,
  },
  {
    title: 'Collections',
    href: '/admin/collections',
    icon: FolderOpen,
  },
  {
    title: 'Batch Generate',
    href: '/admin/batch-generate',
    icon: Wand2,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Import Data',
    href: '/admin/import',
    icon: Upload,
  },
  {
    title: 'Export Data',
    href: '/admin/export',
    icon: Download,
  },
  {
    title: 'System Health',
    href: '/admin/health',
    icon: Activity,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/admin';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">ToolForge Admin</h2>
        <p className="text-sm text-gray-500 mt-1">Content Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
