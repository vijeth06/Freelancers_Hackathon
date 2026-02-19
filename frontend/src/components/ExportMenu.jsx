import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { copyToClipboard } from '../utils/helpers';

export default function ExportMenu({ meetingId, analysis }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJSON = async () => {
    try {
      const response = await api.export.json(meetingId);
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meeting-${meetingId}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('JSON exported successfully');
    } catch (error) {
      toast.error('Failed to export JSON');
    }
    setOpen(false);
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.export.pdf(meetingId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meeting-${meetingId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
    setOpen(false);
  };

  const handleCopyToClipboard = async () => {
    if (!analysis) {
      toast.error('No analysis to copy');
      return;
    }

    const text = [
      `Summary: ${analysis.summary}`,
      '',
      'Key Points:',
      ...analysis.keyPoints.map((kp) => `  - ${kp}`),
      '',
      'Action Items:',
      ...analysis.actionItems.map(
        (item) =>
          `  [${item.status}] ${item.task} (Owner: ${item.owner}, Deadline: ${item.deadline}, Priority: ${item.priority})`
      ),
    ].join('\n');

    try {
      await copyToClipboard(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={handleExportPDF}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Export as PDF
          </button>
          <button
            onClick={handleExportJSON}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Export as JSON
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
