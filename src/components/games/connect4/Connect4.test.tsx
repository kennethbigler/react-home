import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import render from '../../../redux-test-render';
import Connect4 from './Connect4';

describe('games | connect4 | Connect4', () => {
  it('renders as expected', () => {
    render(<Connect4 />);

    expect(screen.getByText("Welcome to Ken's Connect4 Game")).toBeInTheDocument();
    expect(screen.getByText('Turn:')).toBeInTheDocument();
    // button 0, should be red because they goes first
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    // button 1
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
    // button 2-8 are to play the game
    expect(screen.getAllByRole('button')[2]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[8]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    // 9-51 are for display
    expect(screen.getAllByRole('button')).toHaveLength(51);
  });
  it('plays a piece and can reset after', () => {
    render(<Connect4 />);

    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[2]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[8]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[44]).not.toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });

    fireEvent.click(screen.getAllByRole('button')[2]);
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'black' });
    expect(screen.getAllByRole('button')[2]).toHaveStyle({ backgroundColor: 'black' });
    expect(screen.getAllByRole('button')[8]).toHaveStyle({ backgroundColor: 'black' });
    expect(screen.getAllByRole('button')[44]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });

    fireEvent.click(screen.getByText('Reset Game'));
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[2]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[8]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[44]).not.toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
  });

  it('marks the winner', () => {
    render(<Connect4 />);

    expect(screen.getByText('Turn:')).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });

    fireEvent.click(screen.getByText('Reset Game'));

    fireEvent.click(screen.getAllByRole('button')[2]);
    fireEvent.click(screen.getAllByRole('button')[3]);
    fireEvent.click(screen.getAllByRole('button')[2]);
    fireEvent.click(screen.getAllByRole('button')[3]);
    fireEvent.click(screen.getAllByRole('button')[2]);
    fireEvent.click(screen.getAllByRole('button')[3]);
    expect(screen.getAllByRole('button')[44]).toHaveStyle('background-color: rgb(244, 67, 54)');
    fireEvent.click(screen.getAllByRole('button')[2]);

    expect(screen.getByText('Winner:')).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[44]).toHaveStyle('background-color: rgb(124, 179, 66);');
  });
  it('recognizes 5 in a row', () => {
    render(<Connect4 />);

    expect(screen.getByText('Turn:')).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });

    fireEvent.click(screen.getByText('Reset Game'));

    fireEvent.click(screen.getAllByRole('button')[2]);
    fireEvent.click(screen.getAllByRole('button')[2]);
    fireEvent.click(screen.getAllByRole('button')[3]);
    fireEvent.click(screen.getAllByRole('button')[3]);
    fireEvent.click(screen.getAllByRole('button')[4]);
    fireEvent.click(screen.getAllByRole('button')[4]);
    fireEvent.click(screen.getAllByRole('button')[6]);
    fireEvent.click(screen.getAllByRole('button')[6]);
    expect(screen.getAllByRole('button')[44]).toHaveStyle('background-color: rgb(244, 67, 54)');
    fireEvent.click(screen.getAllByRole('button')[5]);

    expect(screen.getByText('Winner:')).toBeInTheDocument();
    expect(screen.getAllByRole('button')[0]).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
    expect(screen.getAllByRole('button')[44]).toHaveStyle('background-color: rgb(124, 179, 66);');
  });
});
