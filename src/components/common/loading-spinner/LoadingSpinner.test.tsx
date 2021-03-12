import React from 'react';
import { screen } from '@testing-library/react';
import render from '../../../redux-test-render';
import LoadingSpinner from './LoadingSpinner';

describe('common | LoadingSpinner', () => {
  it('renders as expected', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTitle('Loading Spinner')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
