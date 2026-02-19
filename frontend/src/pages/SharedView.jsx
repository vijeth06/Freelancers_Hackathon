import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import AnalysisView from '../components/AnalysisView';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { formatDateTime } from '../utils/helpers';
import { MEETING_TYPE_COLORS } from '../utils/constants';

export default function SharedView() {
  const { shareToken } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.shared.get(shareToken);
        setMeeting(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('This shared meeting link is invalid or has expired.');
        } else {
          setError(err.response?.data?.error || 'Failed to load shared meeting');
        }
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchShared();
    }
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading shared meeting..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.768 3.768l4.242 4.242m0 0l3.768 3.768M6.11 6.11L3 3m3.11 3.11l4.242 4.242" />
          </svg>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Meeting Not Found</h1>
          <p className="mt-2 text-gray-500">{error}</p>
          <Link to="/login" className="mt-6 inline-block text-primary-600 hover:text-primary-700 text-sm font-medium">
            Go to Login &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  const typeColor = MEETING_TYPE_COLORS[meeting.type] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">MeetingAI</h1>
              <p className="text-xs text-gray-500">Shared Meeting View</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Meeting Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{meeting.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                    {meeting.type}
                  </span>
                  <span>{formatDateTime(meeting.date)}</span>
                </div>
              </div>
            </div>

            {meeting.participants && meeting.participants.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Participants</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {meeting.participants.map((p, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {meeting.tags && meeting.tags.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {meeting.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Raw Content */}
          {meeting.rawContent && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Meeting Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{meeting.rawContent}</pre>
              </div>
            </div>
          )}

          {/* Analysis */}
          {meeting.analysis ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <AnalysisView analysis={meeting.analysis} />
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
              <p>No analysis available for this meeting yet.</p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400">
          <p>Shared via MeetingAI &mdash; AI Meeting Notes & Action Item Intelligence Platform</p>
        </footer>
      </main>
    </div>
  );
}
