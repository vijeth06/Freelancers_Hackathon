import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import Layout from '../components/Layout';
import ErrorBanner from '../components/ErrorBanner';
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Meeting</h1>
          <p className="mt-1 text-sm text-gray-500">
            Paste your meeting notes and let AI analyze them
          </p>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Sprint 14 Planning, Client Sync with Acme Corp"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
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

            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              <input
                id="participants"
                type="text"
                value={form.participants}
                onChange={(e) => setForm({ ...form, participants: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Alice, Bob, Charlie (comma-separated)"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="sprint-14, backend, urgent (comma-separated)"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label htmlFor="rawContent" className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Notes *
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Paste raw meeting notes, transcripts, bullet points, or any format. The AI will
              analyze and structure the content.
            </p>
            <textarea
              id="rawContent"
              required
              rows={16}
              value={form.rawContent}
              onChange={(e) => setForm({ ...form, rawContent: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder={`Paste your meeting notes here...

Examples:
- Bullet point notes
- Speaker dialogue (John: We need to finish the API by Friday)
- Transcript with timestamps
- Paragraphs of notes
- Mixed formats

The AI will extract summaries, key points, and action items.`}
            />
            <p className="mt-2 text-xs text-gray-400 text-right">
              {form.rawContent.length.toLocaleString()} / 100,000 characters
            </p>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
