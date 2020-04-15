import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ButtonPopover from './ButtonPopover';

describe('common | header | ButtonPopover', () => {
  it('renders as expected', () => {
    render(<ButtonPopover buttonText="Button Text"><span>Children Text</span></ButtonPopover>);
    expect(screen.getByText('Button Text')).toBeInTheDocument();
    expect(screen.queryByText('Children Text')).toBeNull();
    // click to open
    fireEvent.click(screen.getByText('Button Text'));
    expect(screen.getByText('Children Text')).toBeInTheDocument();
  });

  it('opens and closes as expected', () => {
    render(<ButtonPopover buttonText="Button Text"><span>Children Text</span></ButtonPopover>);
    expect(screen.queryByTitle('player-popover')).toBeNull();
    // click to open
    fireEvent.click(screen.getByText('Button Text'));
    expect(screen.getByTitle('player-popover')).not.toHaveAttribute('aria-hidden', 'true');
    // press escape to close
    fireEvent.keyDown(screen.getByRole('presentation'), {
      key: 'Escape',
      keyCode: 27,
      which: 27,
    });
    expect(screen.getByTitle('player-popover')).toHaveAttribute('aria-hidden', 'true');
  });
});
