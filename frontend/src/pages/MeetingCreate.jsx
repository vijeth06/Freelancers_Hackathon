import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import Layout from '../components/Layout';
import ErrorBanner from '../components/ErrorBanner';
import TranscriptUpload from '../components/TranscriptUpload';
import { MEETING_TYPES } from '../utils/constants';

export default function MeetingCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: 'general',
    rawContent: '',
    date: new Date().toISOString().split('T')[0],
    participants: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Meeting title is required');
      return;
    }
    if (!form.rawContent.trim()) {
      setError('Meeting content is required');
      return;
    }

    setLoading(true);
    try {
      const data = {
        title: form.title.trim(),
        type: form.type,
        rawContent: form.rawContent,
        date: form.date || undefined,
        participants: form.participants
          ? form.participants.split(',').map((p) => p.trim()).filter(Boolean)
          : [],
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
          : [],
      };

      const response = await api.meetings.create(data);
      toast.success('Meeting created successfully!');
      navigate(`/meetings/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Meeting</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload a transcript file or paste your meeting notes. AI will analyze and extract summaries, key points, and action items.
          </p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Meeting Details</h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Sprint 14 Planning, Q1 Strategy Review"
              />
            </div>

            {/* Type and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {MEETING_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                Participants
              </label>
              <input
                id="participants"
                type="text"
                value={form.participants}
                onChange={(e) => setForm({ ...form, participants: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Alice Smith, Bob Johnson, Charlie Brown (comma-separated)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Names will help identify action item owners
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <input
                id="tags"
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="sprint-planning, backend, urgent, client (comma-separated)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tags help organize and filter your meetings
              </p>
            </div>
          </div>

          {/* Transcript Upload Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Transcript</h2>
            <TranscriptUpload
              onTranscriptLoaded={(content) => setForm({ ...form, rawContent: content })}
              initialContent={form.rawContent}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim() || !form.rawContent.trim()}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Meeting...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
