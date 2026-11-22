import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppLayout } from './AppLayout';

const renderLayout = () => {
  const user = userEvent.setup();
  render(
    <AppLayout>
      <p>Page content</p>
    </AppLayout>,
  );
  return { user, menuButton: screen.getByRole('button', { name: 'Open menu' }) };
};

describe('AppLayout navigation drawer', () => {
  it('opens the menu from the menu button and closes it with Escape', async () => {
    const { user, menuButton } = renderLayout();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveFocus();
  });

  it('closes the menu with the close button and keeps Tab inside while open', async () => {
    const { user, menuButton } = renderLayout();
    await user.click(menuButton);

    // Close button → Runs link → back to the close button, never to the page behind.
    await user.tab();
    expect(screen.getByRole('link', { name: 'Runs' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
