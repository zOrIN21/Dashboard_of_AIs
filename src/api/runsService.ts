import type { Run } from '../types/run';
import { MOCK_RUNS } from './mockRuns';

export type LoadRunsOptions = {
  signal?: AbortSignal;
};

export type LoadRuns = (options?: LoadRunsOptions) => Promise<Run[]>;

type MockServiceConfig = {
  delayMs?: number;
  /** Fail the first completed request — lets you see the error state and check "Retry". */
  failFirstRequest?: boolean;
};

const DEFAULT_DELAY_MS = 900;

const createAbortError = () => new DOMException('The request was aborted', 'AbortError');

/**
 * Pretends to be `GET /api/runs`: resolves with a copy of the mock data after a delay.
 * The failure is decided only when a request finishes, so a request cancelled by
 * React StrictMode's double effect does not consume it.
 */
export const createMockRunsService = ({
  delayMs = DEFAULT_DELAY_MS,
  failFirstRequest = false,
}: MockServiceConfig = {}): LoadRuns => {
  let shouldFail = failFirstRequest;

  return ({ signal } = {}) =>
    new Promise<Run[]>((resolve, reject) => {
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }

      const timerId = setTimeout(() => {
        signal?.removeEventListener('abort', handleAbort);
        if (shouldFail) {
          shouldFail = false;
          reject(new Error('Could not load runs: the server responded with 503 Service Unavailable.'));
          return;
        }
        resolve(structuredClone(MOCK_RUNS));
      }, delayMs);

      function handleAbort() {
        clearTimeout(timerId);
        reject(createAbortError());
      }

      signal?.addEventListener('abort', handleAbort, { once: true });
    });
};
