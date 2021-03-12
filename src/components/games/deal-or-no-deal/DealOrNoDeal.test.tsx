import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import render from '../../../redux-test-render';
import DealOrNoDeal from './DealOrNoDeal';

describe('games | deal-or-no-deal | DealOrNoDeal', () => {
  it('renders as expected', () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText('Deal or No Deal')).toBeInTheDocument();
    expect(screen.getByText('Your Case: ?')).toBeInTheDocument();
    expect(screen.getByText('Number of Cases to Open: 6')).toBeInTheDocument();
    expect(screen.getByText('Ken: $100')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(26);
  });

  // CURRENTLY: we are running into an issue with testing and Redux Thunk, so this will have to wait.
  // it('selects a case', () => {
  //   const { debug } = render(<DealOrNoDeal />);

  //   expect(screen.getByText('Your Case: ?')).toBeInTheDocument();
  //   expect(screen.getByText('Number of Cases to Open: 6')).toBeInTheDocument();
  //   expect(screen.getByText('Ken: $100')).toBeInTheDocument();
  //   expect(screen.getAllByRole('button')).toHaveLength(26);

  //   // select case 7
  //   fireEvent.click(screen.getAllByRole('button')[6]);

  //   debug();
  //   expect(true);
  //   expect(screen.getByText('Your Case: 7')).toBeInTheDocument();
  //   expect(screen.getByText('Number of Cases to Open: 6')).toBeInTheDocument();
  //   expect(screen.getByText('Ken: -$15')).toBeInTheDocument();
  //   expect(screen.getAllByRole('button')).toHaveLength(26);
  // });
});
