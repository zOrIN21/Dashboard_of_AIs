import type { SortOrder } from '../../types/run';
import styles from './RunsToolbar.module.css';

const SORT_LABELS: Record<SortOrder, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  longest: 'Longest duration',
  shortest: 'Shortest duration',
};

type SortSelectProps = {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
};

export const SortSelect = ({ value, onChange }: SortSelectProps) => (
  <label className={styles.sort}>
    <span className={styles.sortLabel}>Sort</span>
    <select
      className={styles.sortSelect}
      value={value}
      onChange={(event) => onChange(event.target.value as SortOrder)}
    >
      {Object.entries(SORT_LABELS).map(([order, label]) => (
        <option key={order} value={order}>
          {label}
        </option>
      ))}
    </select>
  </label>
);
