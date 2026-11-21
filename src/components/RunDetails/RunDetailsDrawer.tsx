import { useEffect, useRef, type KeyboardEvent } from 'react';
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const TITLE_ID = 'run-details-title';

export const RunDetailsDrawer = ({ runId, run, onClose }: RunDetailsDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus into the drawer, lock page scroll, and give focus back to the row on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      const row = document.querySelector<HTMLElement>(`[data-run-id="${CSS.escape(runId)}"]`);
      (row ?? previouslyFocused)?.focus();
    };
  }, [runId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;

    // Keep keyboard focus inside the dialog while it is open.
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.root} onKeyDown={handleKeyDown}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
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
