import { useMemo } from 'react';
import type { LoadRuns } from '../../api/runsService';
import { Button } from '../../components/Button/Button';
import { RunDetailsDrawer } from '../../components/RunDetails/RunDetailsDrawer';
import { RunList } from '../../components/RunList/RunList';
import { RunListSkeleton } from '../../components/RunList/RunListSkeleton';
import { RunsToolbar } from '../../components/RunsToolbar/RunsToolbar';
import { EmptyRunsState, RunsErrorState } from '../../components/StateMessage/RunsStates';
import { useRuns } from '../../hooks/useRuns';
import { useRunsUrlState } from '../../hooks/useRunsUrlState';
import { countByStatus, matchesSearch, selectVisibleRuns } from '../../utils/runQuery';
import styles from './RunsPage.module.css';

type RunsPageProps = {
  loadRuns: LoadRuns;
};

export const RunsPage = ({ loadRuns }: RunsPageProps) => {
  const { state, reload } = useRuns(loadRuns);
  const { search, status, sort, selectedRunId, setSearch, setStatus, setSort, resetFilters, openRun, closeRun } =
    useRunsUrlState();

  const runs = useMemo(() => (state.status === 'success' ? state.runs : []), [state]);
  const visibleRuns = useMemo(() => selectVisibleRuns(runs, { search, status, sort }), [runs, search, status, sort]);
  // Counts follow the search, so each status chip shows how many results it would give.
  const statusCounts = useMemo(() => countByStatus(runs.filter((run) => matchesSearch(run, search))), [runs, search]);

  const hasActiveFilters = search.trim() !== '' || status !== 'all';
  const selectedRun = runs.find((run) => run.id === selectedRunId);

  const renderList = () => {
    switch (state.status) {
      case 'loading':
        return <RunListSkeleton />;
      case 'error':
        return <RunsErrorState message={state.message} onRetry={reload} />;
      case 'success':
        return visibleRuns.length === 0 ? (
          <EmptyRunsState hasActiveFilters={hasActiveFilters} onReset={resetFilters} />
        ) : (
          <RunList runs={visibleRuns} selectedRunId={selectedRunId} onSelect={openRun} />
        );
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <p className={styles.eyebrow}>Project / web-platform</p>
          <h1 className={styles.title}>Runs</h1>
          <p className={styles.subtitle}>Agent runs across your repositories: status, logs and results.</p>
        </div>
        <Button onClick={reload} disabled={state.status === 'loading'}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <path d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 2.5v3h-3" />
          </svg>
          <span className={styles.refreshLabel}>Refresh</span>
        </Button>
      </header>

      <RunsToolbar
        search={search}
        status={status}
        sort={sort}
        counts={state.status === 'success' ? statusCounts : undefined}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      <section aria-label="Runs list" className={styles.results}>
        {state.status === 'success' && (
          <p className={styles.summary} role="status">
            Showing {visibleRuns.length} of {runs.length} runs
          </p>
        )}
        {renderList()}
      </section>

      {selectedRunId && state.status === 'success' && (
        <RunDetailsDrawer key={selectedRunId} runId={selectedRunId} run={selectedRun} onClose={closeRun} />
      )}
    </div>
  );
};
