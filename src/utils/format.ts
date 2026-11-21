const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const MISSING_VALUE = '—';

export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? MISSING_VALUE : dateFormatter.format(date);
};

export const formatDuration = (totalSeconds?: number): string => {
  if (totalSeconds === undefined || !Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return MISSING_VALUE;
  }

  const seconds = Math.round(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const restSeconds = seconds % 60;

  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  if (minutes > 0) return `${minutes}m ${String(restSeconds).padStart(2, '0')}s`;
  return `${restSeconds}s`;
};
