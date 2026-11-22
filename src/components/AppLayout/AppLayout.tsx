import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useModalBehavior } from '../../hooks/useModalBehavior';
import styles from './AppLayout.module.css';

const NAV_ITEMS = ['Runs', 'Projects', 'Devboxes', 'Previews', 'Snapshots', 'Settings'];
const ACTIVE_ITEM = 'Runs';
const SIDEBAR_ID = 'app-sidebar';
/** Must match the breakpoint in AppLayout.module.css where the sidebar becomes a drawer. */
const DESKTOP_MEDIA_QUERY = '(min-width: 901px)';

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

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeNav = useCallback(() => setIsNavOpen(false), []);

  useModalBehavior({
    isActive: isNavOpen,
    containerRef: sidebarRef,
    initialFocusRef: closeButtonRef,
    getReturnFocusTarget: () => menuButtonRef.current,
    onClose: closeNav,
  });

  // On a wide screen the sidebar is always visible, so an open drawer state makes no sense.
  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsNavOpen(false);
    };
    desktopQuery.addEventListener('change', handleChange);
    return () => desktopQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.iconButton}
          aria-label="Open menu"
          aria-expanded={isNavOpen}
          aria-controls={SIDEBAR_ID}
          onClick={() => setIsNavOpen(true)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" />
          </svg>
        </button>
        <Logo />
      </header>

      {isNavOpen && <div className={styles.backdrop} onClick={closeNav} aria-hidden="true" />}

      <aside
        ref={sidebarRef}
        id={SIDEBAR_ID}
        className={`${styles.sidebar} ${isNavOpen ? styles.sidebarOpen : ''}`}
        // While open on a narrow screen the sidebar works as a modal drawer.
        role={isNavOpen ? 'dialog' : undefined}
        aria-modal={isNavOpen ? true : undefined}
        aria-label="Navigation"
        tabIndex={-1}
      >
        <div className={styles.sidebarHeader}>
          <Logo />
          <button
            ref={closeButtonRef}
            type="button"
            className={`${styles.iconButton} ${styles.closeButton}`}
            aria-label="Close menu"
            onClick={closeNav}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m5.5 5.5 9 9m0-9-9 9" />
            </svg>
          </button>
        </div>

        <nav aria-label="Workspace">
          <p className={styles.navTitle}>Workspace</p>
          <ul className={styles.nav}>
            {NAV_ITEMS.map((item) =>
              item === ACTIVE_ITEM ? (
                <li key={item}>
                  <a
                    href="/"
                    className={`${styles.navItem} ${styles.navItemActive}`}
                    aria-current="page"
                    // Already on this page: keep the current filters instead of reloading.
                    onClick={(event) => {
                      event.preventDefault();
                      closeNav();
                    }}
                  >
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
};
