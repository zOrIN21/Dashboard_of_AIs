import { RUN_STATUSES, type Run, type RunStatus, type SortOrder, type StatusFilter } from '../types/run';

export const matchesSearch = (run: Run, query: string): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return (
    run.name.toLowerCase().includes(normalizedQuery) ||
    run.repository.toLowerCase().includes(normalizedQuery)
  );
};

export const matchesStatus = (run: Run, status: StatusFilter): boolean =>
  status === 'all' || run.status === status;

const timestamp = (run: Run) => new Date(run.createdAt).getTime() || 0;

/** Runs without a known duration always go to the end of the list. */
const compareDuration = (a: Run, b: Run, direction: 1 | -1) => {
  if (a.durationSeconds === undefined && b.durationSeconds === undefined) return 0;
  if (a.durationSeconds === undefined) return 1;
  if (b.durationSeconds === undefined) return -1;
  return (a.durationSeconds - b.durationSeconds) * direction;
};

const comparators: Record<SortOrder, (a: Run, b: Run) => number> = {
  newest: (a, b) => timestamp(b) - timestamp(a),
  oldest: (a, b) => timestamp(a) - timestamp(b),
  longest: (a, b) => compareDuration(a, b, -1),
  shortest: (a, b) => compareDuration(a, b, 1),
};

type RunQuery = {
  search: string;
  status: StatusFilter;
  sort: SortOrder;
};

export const selectVisibleRuns = (runs: Run[], { search, status, sort }: RunQuery): Run[] =>
  runs
    .filter((run) => matchesSearch(run, search) && matchesStatus(run, status))
    .sort(comparators[sort]);

export type StatusCounts = Record<StatusFilter, number>;

export const countByStatus = (runs: Run[]): StatusCounts => {
  const counts: StatusCounts = { all: runs.length, queued: 0, running: 0, succeeded: 0, failed: 0 };
  runs.forEach((run) => {
    counts[run.status] += 1;
  });
  return counts;
};

export const isRunStatus = (value: string | null): value is RunStatus =>
  RUN_STATUSES.includes(value as RunStatus);
