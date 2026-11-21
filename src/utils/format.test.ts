import { formatDateTime, formatDuration } from './format';

describe('formatDuration', () => {
  it.each([
    [0, '0s'],
    [58, '58s'],
    [412, '6m 52s'],
    [3724, '1h 02m'],
  ])('formats %i seconds as %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  it('shows a dash when the duration is unknown or invalid', () => {
    expect(formatDuration(undefined)).toBe('—');
    expect(formatDuration(-5)).toBe('—');
    expect(formatDuration(Number.NaN)).toBe('—');
  });
});

describe('formatDateTime', () => {
  it('formats a valid ISO date with day, month and year', () => {
    expect(formatDateTime('2026-11-21T12:00:00Z')).toMatch(/21 Nov 2026/);
  });

  it('shows a dash for an invalid date instead of "Invalid Date"', () => {
    expect(formatDateTime('not-a-date')).toBe('—');
  });
});
