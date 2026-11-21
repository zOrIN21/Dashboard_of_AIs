import styles from './RunDetails.module.css';

const isErrorLine = (line: string) => /\bERROR\b/.test(line);

export const LogViewer = ({ lines }: { lines: string[] }) => {
  if (lines.length === 0) {
    return <p className={styles.muted}>No log output yet.</p>;
  }

  return (
    <ol className={styles.logs} aria-label="Run logs">
      {lines.map((line, index) => (
        <li key={index} className={isErrorLine(line) ? styles.logError : undefined}>
          {line}
        </li>
      ))}
    </ol>
  );
};
