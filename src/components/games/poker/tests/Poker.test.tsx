import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
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

  it('plays a game', async () => {
    render(<Poker />);

    fireEvent.click(screen.getByText('Start Game'));
    await waitFor(() => screen.getAllByText(/♣|♦|♥|♠/i));
    const cardToDiscard = screen.getAllByText(/♣|♦|♥|♠/i)[0];
    fireEvent.click(cardToDiscard);
    expect(cardToDiscard.innerHTML).toEqual(screen.getAllByText(/♣|♦|♥|♠/i)[0].innerHTML);
    fireEvent.click(screen.getByText('Discard Cards'));
    await waitFor(() => screen.getByText('End Turn'));
    // ensure we got a new card
    expect(cardToDiscard.innerHTML).not.toEqual(screen.getAllByText(/♣|♦|♥|♠/i)[0].innerHTML);
    fireEvent.click(screen.getByText('End Turn'));
    await waitFor(() => screen.getByText('New Game'));
    fireEvent.click(screen.getByText('New Game'));
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });
});
