import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Layout from '../components/Layout';
import MeetingCard from '../components/MeetingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { MEETING_TYPES } from '../utils/constants';

export default function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    type: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      if (!params.type) delete params.type;
      if (!params.search) delete params.search;

      const [meetingsRes, statsRes] = await Promise.all([
        api.meetings.list(params),
        api.actionItems.getStats(),
      ]);

      setMeetings(meetingsRes.data.data.meetings);
      setPagination(meetingsRes.data.data.pagination);
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleTypeFilter = (type) => {
    setFilters({ ...filters, type: filters.type === type ? '' : type, page: 1 });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your meeting intelligence at a glance
            </p>
          </div>
          <Link
            to="/meetings/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Meeting
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMeetings}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.actionItems.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.actionItems.pending}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.actionItems.highPriority}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search meetings..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {MEETING_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeFilter(type.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    filters.type === type.value
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        <ErrorBanner message={error} onRetry={fetchData} onDismiss={() => setError(null)} />

        {/* Meetings Grid */}
        {loading ? (
          <LoadingSpinner size="lg" message="Loading meetings..." />
        ) : meetings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No meetings yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Create your first meeting to get started with AI-powered analysis.
            </p>
            <Link
              to="/meetings/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
            >
              Create Meeting
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting._id} meeting={meeting} />
            ))}
          </div>
        )}

        {/* Pagination */}
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
