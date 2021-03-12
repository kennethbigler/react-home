import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import render from '../../../redux-test-render';
import TicTacToe from './TicTacToe';

describe('games | tictactoe | TicTacToe', () => {
  it('renders as expected', () => {
    render(<TicTacToe />);

    expect(screen.getByText('Tic-Tac-Toe')).toBeInTheDocument();
    expect(screen.getByText('Turn: X')).toBeInTheDocument();
    // button 0
    expect(screen.getByText('Reset Game')).toBeInTheDocument();
    // button 1-9 are game buttons
    expect(screen.getAllByRole('button')).toHaveLength(12);
    // button 10
    expect(screen.getByText('Asc')).toBeInTheDocument();
    // button 11
    expect(screen.getByText('Game Start (Turn, Col, Row)')).toBeInTheDocument();
  });

  it('plays the game on button click', () => {
    render(<TicTacToe />);

    expect(screen.queryByText('X')).toBeNull();
    expect(screen.queryByText('Move #1 (X, 0, 0)')).toBeNull();

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Move #1 (X, 0, 0)')).toBeInTheDocument();
  });

  it('alternates players', () => {
    render(<TicTacToe />);

    expect(screen.queryByText('X')).toBeNull();
    expect(screen.queryByText('Move #1 (X, 0, 0)')).toBeNull();
    expect(screen.queryByText('O')).toBeNull();
    expect(screen.queryByText('Move #2 (O, 1, 0)')).toBeNull();

    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getAllByRole('button')[4]);

    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Move #1 (X, 0, 0)')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText('Move #2 (O, 1, 0)')).toBeInTheDocument();
  });

  it('ignores double clicks', () => {
    render(<TicTacToe />);

    expect(screen.queryByText('X')).toBeNull();
    expect(screen.queryByText('Move #1 (X, 0, 0)')).toBeNull();
    expect(screen.queryByText('O')).toBeNull();
    expect(screen.queryByText('Move #2 (O, 1, 0)')).toBeNull();

    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Move #1 (X, 0, 0)')).toBeInTheDocument();
    expect(screen.queryByText('O')).toBeNull();
    expect(screen.queryByText('Move #2 (O, 1, 0)')).toBeNull();
  });

  it('can end the game on win', () => {
    render(<TicTacToe />);

    expect(screen.getByText('Turn: X')).toBeInTheDocument();
    expect(screen.queryByText('Winner: X')).toBeNull();
    expect(screen.queryAllByText('X')).toHaveLength(0);
    expect(screen.queryAllByText('O')).toHaveLength(0);

    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getAllByRole('button')[2]);
    fireEvent.click(screen.getAllByRole('button')[5]);
    fireEvent.click(screen.getAllByRole('button')[3]);
    fireEvent.click(screen.getAllByRole('button')[9]);

    expect(screen.getByText('Winner: X')).toBeInTheDocument();
    expect(screen.queryByText('Turn: X')).toBeNull();
    expect(screen.getAllByText('X')).toHaveLength(3);
    expect(screen.getAllByText('O')).toHaveLength(2);
    expect(screen.getByText('Move #5 (X, 2, 2)')).toBeInTheDocument();

    // it won't allow clicks after victory
    fireEvent.click(screen.getAllByRole('button')[4]);
    expect(screen.getByText('Winner: X')).toBeInTheDocument();
    expect(screen.queryByText('Turn: X')).toBeNull();
    expect(screen.getAllByText('X')).toHaveLength(3);
    expect(screen.getAllByText('O')).toHaveLength(2);

    // it can reset to a new game
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('Turn: X')).toBeInTheDocument();
    expect(screen.queryByText('Winner: X')).toBeNull();
    expect(screen.queryAllByText('X')).toHaveLength(0);
    expect(screen.queryAllByText('O')).toHaveLength(0);
    expect(screen.queryByText('Move #5 (X, 2, 2)')).toBeNull();
  });

  it('Can Jump Steps', () => {
    render(<TicTacToe />);

    expect(screen.queryByText('X')).toBeNull();
    expect(screen.queryByText('Move #1 (X, 0, 0)')).toBeNull();
    expect(screen.queryByText('O')).toBeNull();
    expect(screen.queryByText('Move #2 (O, 1, 0)')).toBeNull();

    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getAllByRole('button')[4]);

    expect(screen.getByText('X')).toBeInTheDocument();
    // button index 12
    expect(screen.getByText('Move #1 (X, 0, 0)')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    // button index 13
    expect(screen.getByText('Move #2 (O, 1, 0)')).toBeInTheDocument();
    // with the 2 Move buttons available, we should be at 14 now
    expect(screen.getAllByRole('button')).toHaveLength(14);

    fireEvent.click(screen.getAllByRole('button')[12]);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Move #1 (X, 0, 0)')).toBeInTheDocument();
    // this is the only thing removed
    expect(screen.queryByText('O')).toBeNull();
    expect(screen.getByText('Move #2 (O, 1, 0)')).toBeInTheDocument();

    // double click will remove the ability to go forward in time
    fireEvent.click(screen.getAllByRole('button')[12]);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('Move #1 (X, 0, 0)')).toBeInTheDocument();
    expect(screen.queryByText('O')).toBeNull();
    // this is removed now too
    expect(screen.queryByText('Move #2 (O, 1, 0)')).toBeNull();
  });

  it('can change the displayed order of the history', () => {
    render(<TicTacToe />);

    // populate history
    fireEvent.click(screen.getAllByRole('button')[1]);
    fireEvent.click(screen.getAllByRole('button')[4]);

    // button 10
    expect(screen.getByText('Asc')).toBeInTheDocument();
    expect(screen.queryByText('Desc')).toBeNull();
    fireEvent.click(screen.getAllByRole('button')[10]);
    expect(screen.queryByText('Asc')).toBeNull();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});
