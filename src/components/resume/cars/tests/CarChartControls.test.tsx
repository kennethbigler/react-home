import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CarChartControls from '../CarChartControls';

describe('resume | cars | CarChart', () => {
  it('renders as expected', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<CarChartControls hide={{}} onClick={handleClick} vw={435} />);

    expect(getByText('MPG')).toBeInTheDocument();
    expect(getByText('Horsepower')).toBeInTheDocument();
    expect(getByText('Weight')).toBeInTheDocument();
    expect(getByText('Power-to-Weight')).toBeInTheDocument();
    expect(getByText("Hide Family's")).toBeInTheDocument();
    expect(getByText("Hide Ken's")).toBeInTheDocument();

    fireEvent.click(getByText('Horsepower'));
    expect(handleClick).toHaveBeenCalledWith('horsepower');
  });

  it('renders as expected on smaller screens', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<CarChartControls hide={{}} onClick={handleClick} vw={434} />);

    expect(getByText('MPG')).toBeInTheDocument();
    expect(getByText('Horsepower')).toBeInTheDocument();
    expect(getByText('Weight')).toBeInTheDocument();
    expect(getByText('PTW')).toBeInTheDocument();
    expect(getByText('Fam')).toBeInTheDocument();
    expect(getByText('Ken')).toBeInTheDocument();

    fireEvent.click(getByText('Horsepower'));
    expect(handleClick).toHaveBeenCalledWith('horsepower');
  });
});
