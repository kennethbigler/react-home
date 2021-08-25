import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CarChartControls from '../CarChartControls';

describe('resume | cars | CarChart', () => {
  it('renders as expected', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<CarChartControls hide={{}} onClick={handleClick} vw={435} />);

    expect(getByText('Displacement')).toBeInTheDocument();
    expect(getByText('Torque')).toBeInTheDocument();
    expect(getByText('MPG')).toBeInTheDocument();
    expect(getByText('Horsepower')).toBeInTheDocument();
    expect(getByText('Weight')).toBeInTheDocument();
    expect(getByText('Power-to-Weight')).toBeInTheDocument();

    fireEvent.click(getByText('Horsepower'));
    expect(handleClick).toHaveBeenCalledWith('horsepower');
  });
});
