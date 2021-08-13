import React from 'react';
import { render, screen } from '@testing-library/react';
import Cars from '../Cars';
import cars from '../../../../constants/cars';

const demoCar = cars[0];

describe('resume | cars | Cars', () => {
  it('renders as expected', () => {
    const { container } = render(<Cars />);

    expect(screen.getAllByText('Ken\'s Cars')).toHaveLength(2);
    expect(screen.getByText(`(${demoCar.owned})`)).toBeInTheDocument();
    expect(screen.getAllByText(demoCar.title)).toHaveLength(2);
    expect(screen.getByText(`Horsepower: ${demoCar.horsepower}`)).toBeInTheDocument();
    expect(screen.getAllByText(`Transmission: ${demoCar.transmission}`)[0]).toBeInTheDocument();
    expect(screen.getByText(demoCar.story)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toHaveAttribute('src', demoCar.src);

    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
  });
});
