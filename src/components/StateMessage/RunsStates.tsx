import { Button } from '../Button/Button';
import { StateMessage } from './StateMessage';

type EmptyRunsStateProps = {
  hasActiveFilters: boolean;
  onReset: () => void;
};

export const EmptyRunsState = ({ hasActiveFilters, onReset }: EmptyRunsStateProps) => (
  <StateMessage
    icon={
      <svg viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4M8.5 11h5" />
      </svg>
    }
    title={hasActiveFilters ? 'No runs match your filters' : 'No runs yet'}
    description={
      hasActiveFilters
        ? 'Try a different search term or status, or reset the filters to see every run.'
        : 'Runs will appear here as soon as an agent starts working on a repository.'
    }
    action={
      hasActiveFilters && (
        <Button variant="primary" onClick={onReset}>
          Reset search and filters
        </Button>
      )
    }
  />
);

type RunsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const RunsErrorState = ({ message, onRetry }: RunsErrorStateProps) => (
  <StateMessage
    tone="error"
    icon={
      <svg viewBox="0 0 24 24">
        <path d="M12 4 21 19.5H3L12 4Z" />
        <path d="M12 10v4M12 17h.01" />
      </svg>
    }
    title="Runs failed to load"
    description={message}
    action={
      <Button variant="primary" onClick={onRetry}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          <path d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 2.5v3h-3" />
        </svg>
        Retry
      </Button>
    }
  />
);
