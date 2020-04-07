import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './wrappers/WithStore';

it('renders without crashing', async () => {
  render(<App />);
  expect(screen.getByTitle('Loading Spinner')).toBeInTheDOM();
});
