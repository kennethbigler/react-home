import React from 'react';
import { render, screen } from '@testing-library/react';
import Row from './Row';

const segments = [
  { title: 'Title 1', width: 50 },
  { title: 'Title 2', width: 50 },
];

describe('common | timeline-card | Row', () => {
  describe('basic props tests', () => {
    it('renders segments as expected', () => {
      render(<Row segments={segments} />);
      expect(screen.getByTitle('timeline-row')).toBeInTheDocument();
      expect(screen.getByTitle('Title 1')).toBeInTheDocument();
      expect(screen.getByTitle('Title 2')).toBeInTheDocument();
    });

    it('adds styles for first', () => {
      const { rerender } = render(<Row segments={segments} />);
      expect(screen.getByTitle('timeline-row')).toBeInTheDocument();
      expect(screen.getByTitle('timeline-row')).toHaveStyle({ marginTop: '10px' });
      rerender(<Row segments={segments} first />);
      expect(screen.getByTitle('timeline-row')).toHaveStyle({ marginTop: '20px' });
    });

    it('adds styles for yearMarkers', () => {
      render(<Row segments={segments} yearMarkers />);
      expect(screen.getByTitle('timeline-row')).toBeInTheDocument();
      expect(screen.getByTitle('timeline-row')).toHaveStyle({ height: '0px' });
    });
  });
});
