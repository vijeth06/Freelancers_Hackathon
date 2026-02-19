import { format, parseISO, isValid } from 'date-fns';

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}

export function truncate(str, maxLength = 100) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}

export function getMeetingTypeLabel(type) {
  const labels = {
    general: 'General',
    standup: 'Daily Standup',
    'sprint-planning': 'Sprint Planning',
    'client-meeting': 'Client Meeting',
    academic: 'Academic',
    leadership: 'Leadership',
  };
  return labels[type] || type;
}
