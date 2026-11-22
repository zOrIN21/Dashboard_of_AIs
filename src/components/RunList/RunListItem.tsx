import type { Run } from '../../types/run';
import { formatDateTime, formatDuration } from '../../utils/format';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './RunList.module.css';

type RunListItemProps = {
  run: Run;
  isSelected: boolean;
  onSelect: (runId: string) => void;
};

export const RunListItem = ({ run, isSelected, onSelect }: RunListItemProps) => (
  <li>
    <button
      type="button"
      className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
      // Lets the details drawer return focus to this row when it closes.
      data-run-id={run.id}
      onClick={() => onSelect(run.id)}
    >
      <span className={styles.name}>
        <span className={styles.nameText}>{run.name}</span>
        <span className={styles.runId}>{run.id}</span>
      </span>

      <span className={styles.repo}>
        <span className={styles.fieldLabel}>Repository</span>
        <span className={styles.repoName}>{run.repository}</span>
        <span className={styles.branch}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="5" cy="4" r="1.6" />
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="11" cy="6" r="1.6" />
            <path d="M5 5.6v4.8M11 7.6c0 2-2 2.4-4.6 3.4" />
          </svg>
          {run.branch}
        </span>
      </span>

      <span className={styles.status}>
        <StatusBadge status={run.status} />
      </span>

      {/* Field labels are hidden while the table header is visible and appear in the card layout */}
      <span className={styles.created}>
        <span className={styles.fieldLabel}>Created</span>
        <time dateTime={run.createdAt}>{formatDateTime(run.createdAt)}</time>
      </span>

      <span className={styles.duration}>
        <span className={styles.fieldLabel}>Duration</span>
        <span>
          {run.durationSeconds === undefined && run.status === 'running'
            ? 'In progress'
            : formatDuration(run.durationSeconds)}
        </span>
      </span>
    </button>
  </li>
);
