import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import Layout from '../components/Layout';
import ActionItemRow from '../components/ActionItemRow';
import ActionItemFilters from '../components/ActionItemFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

export default function ActionItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    status: undefined,
    priority: undefined,
    owner: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value;
        }
      });

      const res = await api.actionItems.listAll(params);
      setItems(res.data.data.actionItems);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load action items');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpdate = async (analysisId, actionItemId, data) => {
    try {
      await api.actionItems.update(analysisId, actionItemId, data);
      setItems((prev) =>
        prev.map((item) => {
          if (item.analysisId === analysisId && item.actionItem._id === actionItemId) {
            return {
              ...item,
              actionItem: { ...item.actionItem, ...data },
            };
          }
          return item;
        })
      );
      toast.success('Action item updated');
    } catch (err) {
      toast.error('Failed to update action item');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Action Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all action items across your meetings
          </p>
        </div>

        <ActionItemFilters filters={filters} onFilterChange={handleFilterChange} />

        <ErrorBanner message={error} onRetry={fetchItems} onDismiss={() => setError(null)} />

        {loading ? (
          <LoadingSpinner size="lg" message="Loading action items..." />
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No action items found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {filters.status || filters.priority || filters.owner
                ? 'Try adjusting your filters'
                : 'Analyze a meeting to generate action items'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <ActionItemRow
                key={`${item.analysisId}-${item.actionItem._id}-${index}`}
                item={item}
                onUpdate={handleUpdate}
                showMeeting
              />
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
              disabled={filters.page <= 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, filters.page + 1) })}
              disabled={filters.page >= pagination.pages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
