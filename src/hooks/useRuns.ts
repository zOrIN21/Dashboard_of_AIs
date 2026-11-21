import { useCallback, useEffect, useState } from 'react';
import type { LoadRuns } from '../api/runsService';
import type { Run } from '../types/run';

export type RunsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; runs: Run[] };

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong while loading runs.';

export const useRuns = (loadRuns: LoadRuns) => {
  const [state, setState] = useState<RunsState>({ status: 'loading' });
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    loadRuns({ signal: controller.signal })
      .then((runs) => setState({ status: 'success', runs }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [loadRuns, requestId]);

  const reload = useCallback(() => {
    setState({ status: 'loading' });
    setRequestId((id) => id + 1);
  }, []);

  return { state, reload };
};
