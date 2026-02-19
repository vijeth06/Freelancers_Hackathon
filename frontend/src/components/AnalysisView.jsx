import React from 'react';
import { PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';

export default function AnalysisView({ analysis, onEdit }) {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Analysis (v{analysis.version})</h3>
        <div className="flex items-center space-x-3">
          {analysis.isEdited && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Edited</span>
          )}
          {analysis.confirmedAt && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Confirmed</span>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
        <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{analysis.summary}</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Key Points ({analysis.keyPoints.length})
        </h4>
        <ul className="space-y-2">
          {analysis.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-primary-500 mr-2 mt-0.5">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </span>
              <span className="text-gray-600">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {analysis.actionItems.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Action Items ({analysis.actionItems.length})
          </h4>
          <div className="space-y-3">
            {analysis.actionItems.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900 flex-1">{item.task}</p>
                  <div className="flex items-center space-x-2 ml-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        PRIORITY_COLORS[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        STATUS_COLORS[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Owner: {item.owner}</span>
                  <span>Deadline: {item.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
