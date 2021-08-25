import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cars from '../Cars';
import cars from '../../../../constants/cars';

const demoCar = cars[0];

describe('resume | cars | Cars', () => {
  it('renders as expected', () => {
    const { container, debug } = render(<Cars />);

    expect(screen.getAllByText('Ken\'s Cars')).toHaveLength(2);
    expect(screen.getByText(`(${demoCar.owned})`)).toBeInTheDocument();
    expect(screen.getAllByText(demoCar.title)).toHaveLength(1);
    expect(screen.getByText(`Horsepower: ${demoCar.horsepower}`)).toBeInTheDocument();
    expect(screen.getAllByText(`Transmission: ${demoCar.transmission}`)[0]).toBeInTheDocument();
    expect(screen.getByText(demoCar.story)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toHaveAttribute('src', demoCar.src);

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });

  it('selects and deselects buttons', () => {
    const { container } = render(<Cars />);

    expect(container.querySelector('.MuiButton-contained')).toBeNull();
    fireEvent.click(screen.getByText('Horsepower'));
    expect(container.querySelector('.MuiButton-contained')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Horsepower'));
    expect(container.querySelector('.MuiButton-contained')).toBeNull();
  });

  it('re-enables animations', () => {
    const { container } = render(<Cars />);

    fireEvent.click(screen.getByText('Displacement'));
    fireEvent.click(screen.getByText('Torque'));
    fireEvent.click(screen.getByText('MPG'));
    fireEvent.click(screen.getByText('Horsepower'));
    fireEvent.click(screen.getByText('Weight'));
    fireEvent.click(screen.getByText('Power-to-Weight'));

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});
