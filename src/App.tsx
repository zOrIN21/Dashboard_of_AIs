import { useState } from 'react';
import { createMockRunsService } from './api/runsService';
import { AppLayout } from './components/AppLayout/AppLayout';
import { RunsPage } from './pages/RunsPage/RunsPage';

/** Open the app with `?mock=error` to make the first request fail and check the error state. */
const shouldSimulateError = () => new URLSearchParams(window.location.search).get('mock') === 'error';

export const App = () => {
  const [loadRuns] = useState(() => createMockRunsService({ failFirstRequest: shouldSimulateError() }));

  return (
    <AppLayout>
      <RunsPage loadRuns={loadRuns} />
    </AppLayout>
  );
};
