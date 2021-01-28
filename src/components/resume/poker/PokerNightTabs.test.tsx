import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokerNightTabs from './PokerNightTabs';

describe('resume | poker | PokerNightTabs', () => {
  it('renders as expected', () => {
    render(<PokerNightTabs />);

    expect(screen.getByText('Penny Poker')).toBeInTheDocument();
    expect(screen.getByText('GigNow Poker')).toBeInTheDocument();
    expect(screen.getByText('Totals')).toBeInTheDocument();
    expect(screen.getByText('Ken')).toBeInTheDocument();
  });

  it('swaps tabs on tab click', () => {
    render(<PokerNightTabs />);

    expect(screen.getByText('Gus')).toBeInTheDocument();
    expect(screen.queryByText('Brady')).toBeNull();
    fireEvent.click(screen.getByText('GigNow Poker'));
    expect(screen.queryByText('Gus')).toBeNull();
    expect(screen.getByText('Brady')).toBeInTheDocument();
  });
});
