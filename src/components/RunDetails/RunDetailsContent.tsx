import type { Run } from '../../types/run';
import { formatDateTime, formatDuration } from '../../utils/format';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { LogViewer } from './LogViewer';
import { RunResult } from './RunResult';
import styles from './RunDetails.module.css';

type RunDetailsContentProps = {
  run: Run;
  titleId: string;
};

export const RunDetailsContent = ({ run, titleId }: RunDetailsContentProps) => {
  const meta = [
    { label: 'Repository', value: run.repository },
    { label: 'Branch', value: run.branch, isCode: true },
    { label: 'Created', value: <time dateTime={run.createdAt}>{formatDateTime(run.createdAt)}</time> },
    {
      label: 'Duration',
      value:
        run.durationSeconds === undefined && run.status === 'running'
          ? 'In progress'
          : formatDuration(run.durationSeconds),
    },
  ];

  return (
    <div className={styles.content}>
      <header className={styles.heading}>
        <span className={styles.runId}>{run.id}</span>
        <h2 id={titleId} className={styles.title}>
          {run.name}
        </h2>
        <StatusBadge status={run.status} />
      </header>

      <dl className={styles.meta}>
        {meta.map(({ label, value, isCode }) => (
          <div key={label} className={styles.metaItem}>
            <dt>{label}</dt>
            <dd className={isCode ? styles.code : undefined}>{value}</dd>
          </div>
        ))}
      </dl>

      <section className={styles.section} aria-labelledby="run-result-heading">
        <h3 id="run-result-heading" className={styles.sectionTitle}>
          Result
        </h3>
        <RunResult status={run.status} result={run.result} />
      </section>

      <section className={styles.section} aria-labelledby="run-logs-heading">
        <h3 id="run-logs-heading" className={styles.sectionTitle}>
          Logs
          <span className={styles.sectionCount}>{run.logs.length}</span>
        </h3>
        <LogViewer lines={run.logs} />
      </section>
    </div>
  );
};
