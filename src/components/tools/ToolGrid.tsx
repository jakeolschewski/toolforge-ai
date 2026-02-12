import type { Tool } from '@/types';
import ToolCard from './ToolCard';
import { cn } from '@/utils/helpers';

export interface ToolGridProps {
  tools: Tool[];
  columns?: 2 | 3 | 4;
  featured?: boolean;
  className?: string;
}

export default function ToolGrid({ tools, columns = 3, featured = false, className }: ToolGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No tools found.</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for new additions!</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} featured={featured && tool.is_featured} />
      ))}
    </div>
  );
}
