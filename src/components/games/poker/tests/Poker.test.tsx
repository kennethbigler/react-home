import React from 'react';
import { screen } from '@testing-library/react';
import render from '../../../../redux-test-render';
import Poker from '../Poker';

describe('games | poker | Poker', () => {
  it('renders as expected', () => {
    render(<Poker />);

    expect(screen.getByText('5 Card Draw Poker')).toBeInTheDocument();
    expect(screen.getByText('Ken: $100')).toBeInTheDocument();
    expect(screen.getAllByText('Bot: $100')).toHaveLength(5);
    expect(screen.getByText('Dealer: $100')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  // CURRENTLY: we are running into an issue with testing and Redux Thunk, so full coverage will have to wait.
});
