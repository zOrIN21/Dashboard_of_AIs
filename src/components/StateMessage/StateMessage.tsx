import type { ReactNode } from 'react';
import styles from './StateMessage.module.css';

type StateMessageProps = {
  tone?: 'neutral' | 'error';
  icon: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
};

/** Shared layout for the empty and error states of the runs list. */
export const StateMessage = ({ tone = 'neutral', icon, title, description, action }: StateMessageProps) => (
  <div className={`${styles.state} ${styles[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
    <div className={styles.icon} aria-hidden="true">
      {icon}
    </div>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.description}>{description}</p>
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
