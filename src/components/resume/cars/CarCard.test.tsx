import React from 'react';
import { render, screen } from '@testing-library/react';
import CarCard, { Car } from './CarCard';

const demoCar: Car = {
  owned: '2020',
  story: 'Story',
  src: 'pathToImg',
  makeModel: '2018 Chevrolet Corvette',
  transmission: 'Manual',
  horsePower: 650,
};

describe('resume | cars | CarCard', () => {
  it('renders as expected', () => {
    render(<CarCard car={demoCar} />);
    expect(screen.getByText(`(${demoCar.owned})`)).toBeInTheDocument();
    expect(screen.getByText(demoCar.makeModel)).toBeInTheDocument();
    expect(screen.getByText(`Horsepower: ${demoCar.horsePower}`)).toBeInTheDocument();
    expect(screen.getByText(`Transmission: ${demoCar.transmission}`)).toBeInTheDocument();
    expect(screen.getByText(demoCar.story)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.makeModel)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.makeModel)).toHaveAttribute('src', demoCar.src);
  });
});
