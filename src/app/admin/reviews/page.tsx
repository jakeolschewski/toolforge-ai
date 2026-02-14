'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ReviewEditor from '@/components/admin/ReviewEditor';
import type { Review } from '@/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadReviews = async () => {
    setLoading(true);

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch('/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load reviews');
      }

      const data = await response.json();

      if (data.success) {
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review deleted successfully');
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        toast.error(data.error || 'Failed to delete review');
      }
    } catch (error) {
      toast.error('Failed to delete review');
      console.error(error);
    }
  };

  const handlePublish = async (reviewId: string) => {
    try {
      const token = sessionStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'published', published_at: new Date().toISOString() }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review published successfully');
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? data.data : r))
        );
      } else {
        toast.error(data.error || 'Failed to publish review');
      }
    } catch (error) {
      toast.error('Failed to publish review');
      console.error(error);
    }
  };

  const handleSave = (updatedReview: Review) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
    setEditingReview(null);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (editingReview) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Review</h1>
          <p className="text-gray-600 mt-2">Update review content</p>
        </div>

        <ReviewEditor
          review={editingReview}
          onSave={handleSave}
          onCancel={() => setEditingReview(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Reviews</h1>
          <p className="text-gray-600 mt-2">Edit, publish, and delete reviews</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <Button onClick={loadReviews} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
          <div className="text-3xl font-bold text-gray-900">{reviews.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-3xl font-bold text-green-600">
            {reviews.filter((r) => r.status === 'published').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Drafts</div>
          <div className="text-3xl font-bold text-yellow-600">
            {reviews.filter((r) => r.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Views</div>
          <div className="text-3xl font-bold text-primary-600">
            {reviews.reduce((sum, r) => sum + (r.views || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="text-gray-600 mt-4">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No reviews found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {review.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          review.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : review.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {review.status}
                      </span>
                      {review.rating && (
                        <span className="text-sm text-gray-600">
                          ⭐ {review.rating}/5
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {review.content.substring(0, 200)}...
                    </p>

                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Author: {review.author}</span>
                      <span>Views: {review.views || 0}</span>
                      {review.read_time && <span>{review.read_time} min read</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {review.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handlePublish(review.id)}
                      >
                        Publish
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingReview(review)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
