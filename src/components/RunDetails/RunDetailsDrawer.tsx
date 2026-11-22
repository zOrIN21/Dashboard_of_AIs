import { useRef } from 'react';
import { useModalBehavior } from '../../hooks/useModalBehavior';
import type { Run } from '../../types/run';
import { Button } from '../Button/Button';
import { RunDetailsContent } from './RunDetailsContent';
import styles from './RunDetails.module.css';

type RunDetailsDrawerProps = {
  runId: string;
  /** `undefined` means the id from the URL does not match any run. */
  run: Run | undefined;
  onClose: () => void;
};

const TITLE_ID = 'run-details-title';

export const RunDetailsDrawer = ({ runId, run, onClose }: RunDetailsDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalBehavior({
    isActive: true,
    containerRef: panelRef,
    initialFocusRef: closeButtonRef,
    // Give focus back to the row the drawer was opened from.
    getReturnFocusTarget: () => document.querySelector<HTMLElement>(`[data-run-id="${CSS.escape(runId)}"]`),
    onClose,
  });

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
      >
        <div className={styles.topBar}>
          <Button ref={closeButtonRef} variant="ghost" onClick={onClose} className={styles.backButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3.5 5.5 8l4.5 4.5" />
            </svg>
            Back to runs
          </Button>
          <kbd className={styles.escHint} aria-hidden="true">
            Esc
          </kbd>
        </div>

        {run ? (
          <RunDetailsContent run={run} titleId={TITLE_ID} />
        ) : (
          <div className={styles.notFound}>
            <h2 id={TITLE_ID} className={styles.title}>
              Run not found
            </h2>
            <p className={styles.muted}>
              There is no run with id <code>{runId}</code>. It may have been removed, or the link is incorrect.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
