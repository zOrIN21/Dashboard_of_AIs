import { ListHeader } from './RunList';
import styles from './RunList.module.css';

const SKELETON_ROWS = 5;

export const RunListSkeleton = () => (
  <div className={styles.list} role="status" aria-live="polite">
    <span className="visually-hidden">Loading runs…</span>
    <ListHeader />
    <ul className={styles.items} aria-hidden="true">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <li key={index} className={`${styles.row} ${styles.skeletonRow}`}>
          <span className={styles.name}>
            <span className={styles.bone} style={{ width: '70%' }} />
            <span className={styles.bone} style={{ width: '40%', height: 10 }} />
          </span>
          <span className={styles.repo}>
            <span className={styles.bone} style={{ width: '55%' }} />
            <span className={styles.bone} style={{ width: '75%', height: 10 }} />
          </span>
          <span className={styles.status}>
            <span className={styles.bone} style={{ width: 92, height: 22, borderRadius: 999 }} />
          </span>
          <span className={styles.created}>
            <span className={styles.bone} style={{ width: '80%' }} />
          </span>
          <span className={styles.duration}>
            <span className={styles.bone} style={{ width: 48, marginLeft: 'auto' }} />
          </span>
        </li>
      ))}
    </ul>
  </div>
);
