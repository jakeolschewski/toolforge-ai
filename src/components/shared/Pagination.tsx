import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    // Copy over existing params, excluding undefined values
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });

    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12">
      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link href={buildUrl(currentPage - 1)}>
            <Button variant="outline" size="md">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="md" disabled>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum) => (
            <Link key={pageNum} href={buildUrl(pageNum)}>
              <Button
                variant={currentPage === pageNum ? 'primary' : 'outline'}
                size="sm"
              >
                {pageNum}
              </Button>
            </Link>
          ))}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link href={buildUrl(currentPage + 1)}>
            <Button variant="outline" size="md">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="md" disabled>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Page Info */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}
