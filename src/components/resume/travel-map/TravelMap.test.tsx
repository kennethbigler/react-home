import React from 'react';
import { render, screen } from '@testing-library/react';
import TravelMap from './TravelMap';

describe('resume | travel-map | TravelMap', () => {
  it('renders as expected', () => {
    const { container } = render(<TravelMap />);

    expect(screen.getByText('My Travel Map')).toBeInTheDocument();
    expect(container.querySelector('.rsm-svg')).toBeInTheDocument();
    expect(container.querySelector('.rsm-zoomable-group')).toBeInTheDocument();
    expect(container.querySelector('#rsm-sphere')).toBeInTheDocument();
    expect(container.querySelector('.rsm-geographies')).toBeInTheDocument();
    expect(screen.getByText('I have been to 32 countries:')).toBeInTheDocument();
    expect(screen.getByText('North America')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Bahamas 🇧🇸')).toBeInTheDocument();
  });
});
