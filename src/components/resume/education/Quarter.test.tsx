import React from 'react';
import { render, screen } from '@testing-library/react';
import Quarter from './Quarter';

const quarter = {
  quarter: 'QuarterName',
  classes: [
    { name: 'ClassName', catalog: 'CLSS 101' },
  ],
};

describe('resume | education | Quarter', () => {
  it('renders as expected', () => {
    render(<Quarter quarter={quarter} />);

    expect(screen.getByText('QuarterName'));
    expect(screen.getByText('CLSS 101 -'));
    expect(screen.getByText('QuarterName'));
  });

  it('renders as expected', () => {
    quarter.classes.push({ name: 'Class 2', catalog: 'CLSS 202' });
    render(<Quarter quarter={quarter} />);

    expect(screen.getByText('QuarterName'));

    expect(screen.getByText('CLSS 101 -'));
    expect(screen.getByText('ClassName'));

    expect(screen.getByText('CLSS 202 -'));
    expect(screen.getByText('Class 2'));
  });
});
