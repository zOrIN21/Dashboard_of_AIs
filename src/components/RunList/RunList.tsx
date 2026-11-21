import type { Run } from '../../types/run';
import { RunListItem } from './RunListItem';
import styles from './RunList.module.css';

type RunListProps = {
  runs: Run[];
  selectedRunId: string | null;
  onSelect: (runId: string) => void;
};

export const ListHeader = () => (
  <div className={styles.header} aria-hidden="true">
    <span>Run</span>
    <span>Repository</span>
    <span>Status</span>
    <span>Created</span>
    <span className={styles.alignEnd}>Duration</span>
  </div>
);

export const RunList = ({ runs, selectedRunId, onSelect }: RunListProps) => (
  <div className={styles.list}>
    <ListHeader />
    <ul className={styles.items} aria-label="Runs">
      {runs.map((run) => (
        <RunListItem
          key={run.id}
          run={run}
          isSelected={run.id === selectedRunId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  </div>
);
