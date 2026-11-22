import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_RUNS } from '../../api/mockRuns';
import { createMockRunsService, type LoadRuns } from '../../api/runsService';
import { RunsPage } from './RunsPage';

const renderRunsPage = (loadRuns: LoadRuns = createMockRunsService({ delayMs: 0 })) => {
  const user = userEvent.setup();
  render(<RunsPage loadRuns={loadRuns} />);
  return { user };
};

/** Names of the runs currently shown in the list, in display order. */
const getVisibleRunNames = () => {
  const list = screen.getByRole('list', { name: 'Runs' });
  return within(list)
    .getAllByRole('button')
    .map((row) => row.querySelector('[class*="nameText"]')?.textContent);
};

const waitForRuns = () => screen.findByRole('list', { name: 'Runs' });

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('RunsPage', () => {
  it('shows a loading state, then every run', async () => {
    renderRunsPage();

    expect(screen.getByText('Loading runs…')).toBeInTheDocument();
    await waitForRuns();
    expect(getVisibleRunNames()).toHaveLength(MOCK_RUNS.length);
    expect(screen.queryByText('Loading runs…')).not.toBeInTheDocument();
  });

  it('filters runs by status and marks the active filter', async () => {
    const { user } = renderRunsPage();
    await waitForRuns();

    const failedFilter = screen.getByRole('button', { name: /^failed/i });
    await user.click(failedFilter);

    expect(failedFilter).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /^all/i })).toHaveAttribute('aria-pressed', 'false');
    expect(getVisibleRunNames()).toEqual(['Migrate to Postgres 17', 'Fix N+1 query in orders']);
    expect(window.location.search).toBe('?status=failed');
  });

  it('searches by run name or repository and combines search with the status filter', async () => {
    const { user } = renderRunsPage();
    await waitForRuns();
    const searchInput = screen.getByRole('searchbox', { name: /search runs/i });

    await user.type(searchInput, 'PAYMENTS');
    expect(getVisibleRunNames()).toEqual(['Fix checkout tests', 'Fix N+1 query in orders']);

    await user.click(screen.getByRole('button', { name: /^succeeded/i }));
    expect(getVisibleRunNames()).toEqual(['Fix checkout tests']);

    await user.clear(searchInput);
    await user.type(searchInput, 'dark mode');
    expect(getVisibleRunNames()).toEqual(['Add dark mode toggle']);
  });

  it('opens run details with logs and result, and goes back to the list', async () => {
    const { user } = renderRunsPage();
    await waitForRuns();

    await user.click(screen.getByRole('button', { name: /migrate to postgres 17/i }));

    const dialog = screen.getByRole('dialog', { name: 'Migrate to Postgres 17' });
    expect(within(dialog).getByText('infra/pg17')).toBeInTheDocument();
    expect(within(dialog).getByText(/no changes were pushed/i)).toBeInTheDocument();
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(5);
    expect(window.location.search).toBe('?run=run_49e7f0');

    await user.click(within(dialog).getByRole('button', { name: /back to runs/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.location.search).toBe('');
  });

  it('closes the details with Escape and works when duration and result are missing', async () => {
    const { user } = renderRunsPage();
    await waitForRuns();

    await user.click(screen.getByRole('button', { name: /write onboarding e2e test/i }));
    const dialog = screen.getByRole('dialog', { name: 'Write onboarding e2e test' });
    expect(within(dialog).getByText(/has not started yet/i)).toBeInTheDocument();
    expect(within(dialog).getByText('No log output yet.')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes the details with Escape after a click on plain text moved focus away from the buttons', async () => {
    const { user } = renderRunsPage();
    await waitForRuns();

    await user.click(screen.getByRole('button', { name: /fix checkout tests/i }));
    const dialog = screen.getByRole('dialog', { name: 'Fix checkout tests' });

    await user.click(within(dialog).getByText(/flaky test fixed/i));
    // Worst case: focus ends up on <body>, outside the dialog.
    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.activeElement).toBe(document.body);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /fix checkout tests/i })).toHaveFocus();
  });

  it('shows an empty state and resets search and filters', async () => {
    const { user } = renderRunsPage();
    await waitForRuns();

    await user.type(screen.getByRole('searchbox'), 'no such run');
    expect(screen.getByText('No runs match your filters')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reset search and filters/i }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(getVisibleRunNames()).toHaveLength(MOCK_RUNS.length);
  });

  it('shows an error with a working Retry button', async () => {
    const { user } = renderRunsPage(createMockRunsService({ delayMs: 0, failFirstRequest: true }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/runs failed to load/i);

    await user.click(within(alert).getByRole('button', { name: /retry/i }));
    await waitForRuns();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('restores filters and the opened run from the URL', async () => {
    window.history.replaceState(null, '', '/?status=succeeded&sort=longest&run=run_7c11de');
    renderRunsPage();
    await waitForRuns();

    expect(getVisibleRunNames()).toEqual(['Add dark mode toggle', 'Fix checkout tests', 'Generate API docs']);
    expect(screen.getByRole('dialog', { name: 'Fix checkout tests' })).toBeInTheDocument();
  });
});
