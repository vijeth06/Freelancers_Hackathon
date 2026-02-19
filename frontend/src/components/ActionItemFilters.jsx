import React from 'react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';

export default function ActionItemFilters({ filters, onFilterChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Owner</label>
          <input
            type="text"
            value={filters.owner || ''}
            onChange={(e) => onFilterChange({ ...filters, owner: e.target.value || undefined })}
            placeholder="Filter by owner..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="createdAt">Date Created</option>
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>
  );
}
