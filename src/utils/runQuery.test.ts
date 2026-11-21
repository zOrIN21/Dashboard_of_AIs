import type { Run } from '../types/run';
import { countByStatus, selectVisibleRuns } from './runQuery';

const makeRun = (overrides: Partial<Run>): Run => ({
  id: 'run',
  name: 'Run',
  repository: 'repo',
  branch: 'main',
  status: 'succeeded',
  createdAt: '2026-11-20T10:00:00Z',
  logs: [],
  ...overrides,
});

const runs = [
  makeRun({ id: 'a', name: 'Alpha', createdAt: '2026-11-20T10:00:00Z', durationSeconds: 30 }),
  makeRun({ id: 'b', name: 'Beta', status: 'running', createdAt: '2026-11-21T10:00:00Z' }),
  makeRun({ id: 'c', name: 'Gamma', status: 'failed', createdAt: '2026-11-19T10:00:00Z', durationSeconds: 90 }),
];

const ids = (list: Run[]) => list.map((run) => run.id);

describe('selectVisibleRuns', () => {
  it('sorts by date in both directions', () => {
    expect(ids(selectVisibleRuns(runs, { search: '', status: 'all', sort: 'newest' }))).toEqual(['b', 'a', 'c']);
    expect(ids(selectVisibleRuns(runs, { search: '', status: 'all', sort: 'oldest' }))).toEqual(['c', 'a', 'b']);
  });

  it('sorts by duration and keeps runs without a duration last', () => {
    expect(ids(selectVisibleRuns(runs, { search: '', status: 'all', sort: 'longest' }))).toEqual(['c', 'a', 'b']);
    expect(ids(selectVisibleRuns(runs, { search: '', status: 'all', sort: 'shortest' }))).toEqual(['a', 'c', 'b']);
  });

  it('ignores surrounding whitespace and case in the search', () => {
    expect(ids(selectVisibleRuns(runs, { search: '  gAmMa ', status: 'all', sort: 'newest' }))).toEqual(['c']);
  });

  it('does not mutate the original array', () => {
    const copy = [...runs];
    selectVisibleRuns(runs, { search: '', status: 'all', sort: 'oldest' });
    expect(runs).toEqual(copy);
  });
});

describe('countByStatus', () => {
  it('counts runs for every status, including empty ones', () => {
    expect(countByStatus(runs)).toEqual({ all: 3, queued: 0, running: 1, succeeded: 1, failed: 1 });
  });
});
