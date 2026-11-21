import { useEffect, useRef } from 'react';
import styles from './RunsToolbar.module.css';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search from anywhere on the page, like on GitHub.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.search}>
      <svg className={styles.searchIcon} viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" />
        <path d="m13.2 13.2 3.3 3.3" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        className={styles.searchInput}
        placeholder="Search by run or repository"
        aria-label="Search runs by name or repository"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.preventDefault();
            onChange('');
          }
        }}
      />
      <kbd className={styles.shortcut} aria-hidden="true">
        /
      </kbd>
    </div>
  );
};
