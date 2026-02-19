import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function TranscriptUpload({ onTranscriptLoaded, initialContent = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState(initialContent);

  const handleFile = async (file) => {
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Allowed file types
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.ms-word',
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|csv|doc|docx)$/i)) {
      toast.error('Supported formats: TXT, PDF, CSV, DOC, DOCX');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setContent(text);
        onTranscriptLoaded(text);
        toast.success(`Transcript loaded: ${file.name}`);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
      };
      reader.readAsText(file);
    } catch (err) {
      toast.error('Error processing file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearContent = () => {
    setContent('');
    onTranscriptLoaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Transcript cleared');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!content && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.csv,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />

          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 1110.233-2.33A3 3 0 0116.5 19.5H6.75z"
              />
            </svg>

            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop your transcript here or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: TXT, PDF, CSV, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  Processing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Choose File
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Content Display/Edit Area */}
      {content && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Meeting Transcript
            </label>
            <button
              type="button"
              onClick={clearContent}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Change File
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onTranscriptLoaded(e.target.value);
            }}
            placeholder="Your meeting transcript will appear here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
          />
          <p className="text-xs text-gray-500">
            {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      )}

      {/* Manual Input Option */}
      {!content && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or paste your transcript below</span>
          </div>
        </div>
      )}

      {!content && (
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Transcript *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onTranscriptLoaded(e.target.value);
            }}
            placeholder="Paste your meeting notes or transcript here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            {content.length} characters
          </p>
        </div>
      )}
    </div>
  );
}
