import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncate, getMeetingTypeLabel } from '../utils/helpers';
import { MEETING_TYPE_COLORS } from '../utils/constants';

export default function MeetingCard({ meeting }) {
  const typeColor = MEETING_TYPE_COLORS[meeting.type] || MEETING_TYPE_COLORS.general;

  return (
    <Link
      to={`/meetings/${meeting._id}`}
      className="block bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{meeting.title}</h3>
          <div className="mt-1 flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
              {getMeetingTypeLabel(meeting.type)}
            </span>
            <span className="text-sm text-gray-500">{formatDate(meeting.date)}</span>
          </div>
        </div>
      </div>
      {meeting.latestAnalysis && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {truncate(meeting.latestAnalysis.summary, 150)}
        </p>
      )}
      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
        {meeting.tags && meeting.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            {meeting.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
            {meeting.tags.length > 3 && <span>+{meeting.tags.length - 3}</span>}
          </div>
        )}
        {typeof meeting.actionItemCount === 'number' && (
          <span>
            {meeting.pendingActions}/{meeting.actionItemCount} actions pending
          </span>
        )}
      </div>
    </Link>
  );
}
