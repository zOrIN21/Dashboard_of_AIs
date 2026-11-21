import type { StatusFilter as StatusFilterValue } from '../../types/run';
import type { StatusCounts } from '../../utils/runQuery';
import styles from './RunsToolbar.module.css';

const FILTER_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'running', label: 'Running' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'failed', label: 'Failed' },
];

type StatusFilterProps = {
  value: StatusFilterValue;
  /** Omitted while runs are loading or failed to load: no numbers to show yet. */
  counts?: StatusCounts;
  onChange: (value: StatusFilterValue) => void;
};

export const StatusFilter = ({ value, counts, onChange }: StatusFilterProps) => (
  <div className={styles.filter} role="group" aria-label="Filter by status">
    {FILTER_OPTIONS.map((option) => {
      const isActive = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          className={`${styles.filterButton} ${isActive ? styles.filterButtonActive : ''}`}
          aria-pressed={isActive}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {counts && <span className={styles.filterCount}>{counts[option.value]}</span>}
        </button>
      );
    })}
  </div>
);
