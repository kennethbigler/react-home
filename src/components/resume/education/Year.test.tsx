import React from 'react';
import { render, screen } from '@testing-library/react';
import Year from './Year';

const year = {
  year: 'YearName',
  quarters: [{
    quarter: 'QuarterName',
    classes: [
      { name: 'ClassName', catalog: 'CLSS 101' },
    ],
  }],
};

describe('resume | education | Year', () => {
  it('renders as expected', () => {
    render(<Year year={year} len={1} />);

    expect(screen.getByText('YearName'));
    expect(screen.getByText('QuarterName'));
    expect(screen.getByText('CLSS 101 -'));
    expect(screen.getByText('ClassName'));
  });

  it('renders as expected with multiple quarters', () => {
    year.quarters.push({
      quarter: 'Quarter 2',
      classes: [
        { name: 'Class 2', catalog: 'CLSS 202' },
      ],
    });
    render(<Year year={year} len={1} />);

    expect(screen.getByText('YearName'));

    expect(screen.getByText('QuarterName'));
    expect(screen.getByText('CLSS 101 -'));
    expect(screen.getByText('ClassName'));

    expect(screen.getByText('Quarter 2'));
    expect(screen.getByText('CLSS 202 -'));
    expect(screen.getByText('Class 2'));
  });
});
