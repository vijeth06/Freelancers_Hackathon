import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import AnalysisView from '../components/AnalysisView';
import AnalysisEditor from '../components/AnalysisEditor';
import ExportMenu from '../components/ExportMenu';
import { formatDateTime, getMeetingTypeLabel } from '../utils/helpers';
import { MEETING_TYPE_COLORS } from '../utils/constants';

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [error, setError] = useState(null);

  const fetchMeeting = useCallback(async () => {
    try {
      const res = await api.meetings.getById(id);
      setMeeting(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load meeting');
    }
  }, [id]);

  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await api.analyses.getLatest(id);
      setAnalysis(res.data.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to load analysis:', err);
      }
    }
  }, [id]);

  const fetchVersions = useCallback(async () => {
    try {
      const res = await api.analyses.getVersions(id);
      setVersions(res.data.data);
    } catch (err) {
      // Versions are non-critical
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMeeting(), fetchAnalysis(), fetchVersions()]);
      setLoading(false);
    };
    loadData();
  }, [fetchMeeting, fetchAnalysis, fetchVersions]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await api.analyses.generate(id);
      setAnalysis(res.data.data);
      await fetchVersions();
      toast.success('Analysis generated successfully!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveEdit = async (data) => {
    try {
      const res = await api.analyses.update(analysis._id, data);
      setAnalysis(res.data.data);
      setEditing(false);
      toast.success('Analysis updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save changes');
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await api.analyses.confirm(analysis._id);
      setAnalysis(res.data.data);
      toast.success('Analysis confirmed');
    } catch (err) {
      toast.error('Failed to confirm analysis');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this meeting? This cannot be undone.')) {
      return;
    }
    try {
      await api.meetings.delete(id);
      toast.success('Meeting deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to delete meeting');
    }
  };

  const handleToggleShare = async () => {
    try {
      const res = await api.meetings.toggleShare(id);
      setMeeting({ ...meeting, ...res.data.data });
      if (res.data.data.isShared) {
        const shareUrl = `${window.location.origin}/shared/${res.data.data.shareToken}`;
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Share link copied to clipboard!');
        } catch {
          toast.success('Sharing enabled');
        }
      } else {
        toast.success('Sharing disabled');
      }
    } catch (err) {
      toast.error('Failed to toggle sharing');
    }
  };

  const handleLoadVersion = async (version) => {
    try {
      const res = await api.analyses.getByVersion(id, version);
      setAnalysis(res.data.data);
    } catch (err) {
      toast.error('Failed to load version');
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" message="Loading meeting..." />
      </Layout>
    );
  }

  if (!meeting) {
    return (
      <Layout>
        <ErrorBanner message={error || 'Meeting not found'} />
      </Layout>
    );
  }

  const typeColor = MEETING_TYPE_COLORS[meeting.type] || MEETING_TYPE_COLORS.general;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                  {getMeetingTypeLabel(meeting.type)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(meeting.date)}
                </span>
                {meeting.participants?.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {meeting.participants.length} participant(s)
                  </span>
                )}
              </div>
              {meeting.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {meeting.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ExportMenu meetingId={id} analysis={analysis} />
              <button
                onClick={handleToggleShare}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  meeting.isShared
                    ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {meeting.isShared ? 'Shared' : 'Share'}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {/* Raw Content */}
        <div className="bg-white rounded-xl border border-gray-200">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="text-sm font-medium text-gray-700">Raw Meeting Notes</span>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${showRaw ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showRaw && (
            <div className="px-4 pb-4">
              <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                {meeting.rawContent}
              </pre>
            </div>
          )}
        </div>

        {/* Analysis Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 shadow-sm"
            >
              {analyzing ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {analysis ? 'Re-analyze' : 'Analyze with AI'}
                </>
              )}
            </button>
            {analysis && !analysis.confirmedAt && (
              <button
                onClick={handleConfirm}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100"
              >
                Confirm Analysis
              </button>
            )}
          </div>
          {versions.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Version:</span>
              <div className="flex space-x-1">
                {versions.map((v) => (
                  <button
                    key={v.version}
                    onClick={() => handleLoadVersion(v.version)}
                    className={`px-2 py-1 text-xs rounded ${
                      analysis?.version === v.version
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    v{v.version}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Analysis */}
        {analysis && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {editing ? (
              <AnalysisEditor
                analysis={analysis}
                onSave={handleSaveEdit}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <AnalysisView analysis={analysis} onEdit={() => setEditing(true)} />
            )}
          </div>
        )}

        {!analysis && !analyzing && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No analysis yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Click "Analyze with AI" to generate a structured summary, key points, and action items.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
