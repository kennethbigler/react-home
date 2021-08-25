import React from 'react';
import { render } from '@testing-library/react';
import CarChart from '../CarChart';

describe('resume | cars | CarChart', () => {
  it('renders as expected', () => {
    const { container } = render(<CarChart hide={{}} showAnimation vw={435} />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});
