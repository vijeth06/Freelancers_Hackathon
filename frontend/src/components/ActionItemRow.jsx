import React from 'react';
import { PRIORITY_COLORS, STATUS_COLORS, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

export default function ActionItemRow({ item, onUpdate, showMeeting = false }) {
  const handleStatusToggle = () => {
    const newStatus = item.actionItem.status === 'Pending' ? 'Completed' : 'Pending';
    onUpdate(item.analysisId, item.actionItem._id, { status: newStatus });
  };

  const handlePriorityChange = (e) => {
    onUpdate(item.analysisId, item.actionItem._id, { priority: e.target.value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start space-x-3">
        <button
          onClick={handleStatusToggle}
          className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
            item.actionItem.status === 'Completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          aria-label={`Mark as ${item.actionItem.status === 'Completed' ? 'pending' : 'completed'}`}
        >
          {item.actionItem.status === 'Completed' && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              item.actionItem.status === 'Completed'
                ? 'text-gray-400 line-through'
                : 'text-gray-900'
            }`}
          >
            {item.actionItem.task}
          </p>
          {showMeeting && item.meetingTitle && (
            <p className="mt-0.5 text-xs text-primary-600">{item.meetingTitle}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Owner: {item.actionItem.owner}</span>
            <span className="text-gray-300">|</span>
            <span>Deadline: {item.actionItem.deadline}</span>
            <span className="text-gray-300">|</span>
            <select
              value={item.actionItem.priority}
              onChange={handlePriorityChange}
              className={`px-2 py-0.5 rounded text-xs font-medium border cursor-pointer ${
                PRIORITY_COLORS[item.actionItem.priority]
              }`}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
