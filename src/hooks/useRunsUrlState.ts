import { useCallback, useEffect, useState } from 'react';
import type { SortOrder, StatusFilter } from '../types/run';
import { isRunStatus } from '../utils/runQuery';

/**
 * Keeps search, status filter, sort order and the opened run in the URL,
 * so a filtered view or a single run can be shared by link and survives a reload:
 *
 *   /?status=failed&q=payments&sort=longest&run=run_1f4e07
 */
export type RunsUrlState = {
  search: string;
  status: StatusFilter;
  sort: SortOrder;
  selectedRunId: string | null;
};

const SORT_ORDERS: SortOrder[] = ['newest', 'oldest', 'longest', 'shortest'];
const DEFAULT_SORT: SortOrder = 'newest';

/** Marks history entries created by opening a run, so closing it can step back instead of piling up entries. */
const DETAILS_HISTORY_MARKER = 'runforge:details';

const isSortOrder = (value: string | null): value is SortOrder =>
  SORT_ORDERS.includes(value as SortOrder);

const readStateFromUrl = (): RunsUrlState => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const sort = params.get('sort');

  return {
    search: params.get('q') ?? '',
    status: isRunStatus(status) ? status : 'all',
    sort: isSortOrder(sort) ? sort : DEFAULT_SORT,
    selectedRunId: params.get('run'),
  };
};

const buildUrl = (state: RunsUrlState) => {
  const params = new URLSearchParams(window.location.search);
  const setParam = (key: string, value: string, isDefault: boolean) => {
    if (isDefault) params.delete(key);
    else params.set(key, value);
  };

  setParam('q', state.search, state.search === '');
  setParam('status', state.status, state.status === 'all');
  setParam('sort', state.sort, state.sort === DEFAULT_SORT);
  setParam('run', state.selectedRunId ?? '', state.selectedRunId === null);

  const query = params.toString();
  return `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
};

export const useRunsUrlState = () => {
  const [state, setState] = useState<RunsUrlState>(readStateFromUrl);

  useEffect(() => {
    const syncFromUrl = () => setState(readStateFromUrl());
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const updateState = useCallback(
    (patch: Partial<RunsUrlState>, mode: 'replace' | 'push' = 'replace') => {
      const next = { ...state, ...patch };
      if (mode === 'push') window.history.pushState(DETAILS_HISTORY_MARKER, '', buildUrl(next));
      else window.history.replaceState(window.history.state, '', buildUrl(next));
      setState(next);
    },
    [state],
  );

  const setSearch = useCallback((search: string) => updateState({ search }), [updateState]);
  const setStatus = useCallback((status: StatusFilter) => updateState({ status }), [updateState]);
  const setSort = useCallback((sort: SortOrder) => updateState({ sort }), [updateState]);
  const resetFilters = useCallback(() => updateState({ search: '', status: 'all' }), [updateState]);
  const openRun = useCallback((runId: string) => updateState({ selectedRunId: runId }, 'push'), [updateState]);

  const closeRun = useCallback(() => {
    if (window.history.state === DETAILS_HISTORY_MARKER) {
      // This entry was added by openRun: stepping back restores the list URL,
      // and popstate syncs the state. The Back button then behaves the same way.
      window.history.back();
      return;
    }
    // Opened from a shared link: there is no entry to go back to.
    updateState({ selectedRunId: null });
  }, [updateState]);

  return { ...state, setSearch, setStatus, setSort, resetFilters, openRun, closeRun };
};
