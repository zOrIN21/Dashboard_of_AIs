import type { RunStatus } from '../../types/run';
import styles from './RunDetails.module.css';

const MISSING_RESULT_TEXT: Record<RunStatus, string> = {
  queued: 'The run has not started yet. The result will appear here when it finishes.',
  running: 'The agent is still working. The result will appear here when the run finishes.',
  succeeded: 'The run finished without a result summary.',
  failed: 'The run failed without a result summary. Check the logs below.',
};

type RunResultProps = {
  status: RunStatus;
  result?: string;
};

export const RunResult = ({ status, result }: RunResultProps) =>
  result ? (
    <p className={`${styles.result} ${styles[`result_${status}`] ?? ''}`}>{result}</p>
  ) : (
    <p className={styles.muted}>{MISSING_RESULT_TEXT[status]}</p>
  );
