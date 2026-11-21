import type { ReactNode } from 'react';
import styles from './AppLayout.module.css';

const NAV_ITEMS = ['Runs', 'Projects', 'Devboxes', 'Previews', 'Snapshots', 'Settings'];
const ACTIVE_ITEM = 'Runs';

const Logo = () => (
  <div className={styles.logo}>
    <span className={styles.logoMark} aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <path d="M9 21.5h14M11 21.5l2-8h6l2 8M16 13.5V9m-3.5 1.5L14 12m5.5-1.5L18 12" />
      </svg>
    </span>
    Runforge
  </div>
);

export const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <Logo />
      <nav aria-label="Workspace">
        <p className={styles.navTitle}>Workspace</p>
        <ul className={styles.nav}>
          {NAV_ITEMS.map((item) =>
            item === ACTIVE_ITEM ? (
              <li key={item}>
                <a href="/" className={`${styles.navItem} ${styles.navItemActive}`} aria-current="page">
                  {item}
                </a>
              </li>
            ) : (
              // Only the Runs page is part of this task; the other sections are shown for context.
              <li key={item}>
                <span className={styles.navItem} aria-disabled="true" title="Not available in this demo">
                  {item}
                </span>
              </li>
            ),
          )}
        </ul>
      </nav>
      <p className={styles.project}>
        <span className={styles.projectLabel}>Project</span>
        web-platform
      </p>
    </aside>

    <main className={styles.main}>{children}</main>
  </div>
);
