import type { RunStatus } from '../../types/run';
import styles from './StatusBadge.module.css';

export const STATUS_LABELS: Record<RunStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Succeeded',
  failed: 'Failed',
};

const STATUS_ICON_PATHS: Record<RunStatus, string> = {
  queued: 'M8 4.5V8l2.5 1.5',
  running: 'M8 2a6 6 0 0 1 6 6',
  succeeded: 'M5 8.2 7 10.2 11 6',
  failed: 'M5.8 5.8l4.4 4.4m0-4.4-4.4 4.4',
};

/** Each status has its own icon and text label, so it is distinguishable without color. */
export const StatusBadge = ({ status }: { status: RunStatus }) => (
  <span className={`${styles.badge} ${styles[status]}`}>
    <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
      {status === 'running' ? (
        <circle cx="8" cy="8" r="6" className={styles.track} />
      ) : (
        <circle cx="8" cy="8" r="6.25" className={styles.ring} />
      )}
      <path d={STATUS_ICON_PATHS[status]} />
    </svg>
    {STATUS_LABELS[status]}
  </span>
);
