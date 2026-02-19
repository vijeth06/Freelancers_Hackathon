export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const MEETING_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'standup', label: 'Daily Standup' },
  { value: 'sprint-planning', label: 'Sprint Planning' },
  { value: 'client-meeting', label: 'Client Meeting' },
  { value: 'academic', label: 'Academic' },
  { value: 'leadership', label: 'Leadership' },
];

export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
export const STATUS_OPTIONS = ['Pending', 'Completed'];

export const PRIORITY_COLORS = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
};

export const STATUS_COLORS = {
  Pending: 'bg-orange-100 text-orange-800',
  Completed: 'bg-emerald-100 text-emerald-800',
};

export const MEETING_TYPE_COLORS = {
  general: 'bg-gray-100 text-gray-700',
  standup: 'bg-blue-100 text-blue-700',
  'sprint-planning': 'bg-purple-100 text-purple-700',
  'client-meeting': 'bg-amber-100 text-amber-700',
  academic: 'bg-teal-100 text-teal-700',
  leadership: 'bg-rose-100 text-rose-700',
};
