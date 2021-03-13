import React from 'react';
import { screen } from '@testing-library/react';
import render from '../../../redux-test-render';
import Blackjack from './Blackjack';

describe('games | blackjack | Blackjack', () => {
  it('renders as expected', () => {
    render(<Blackjack />);

    expect(screen.getByText('Blackjack (21)')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
    expect(screen.getByText('Ken: $100')).toBeInTheDocument();
    expect(screen.getAllByText('Bet: $5')).toHaveLength(6);
    expect(screen.getAllByText('Bot: $100')).toHaveLength(5);
    expect(screen.getByText('Dealer: $100')).toBeInTheDocument();
    expect(screen.getByText('Finish Betting')).toBeInTheDocument();
  });

  // TODO: We aren't done, keep adding tests here, just had to leave for a hike

  // CURRENTLY: we are running into an issue with testing and Redux Thunk, so full coverage will have to wait.
});
