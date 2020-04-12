import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ButtonPopover from './ButtonPopover';

describe('common | header | ButtonPopover', () => {
  it('renders as expected', () => {
    render(<ButtonPopover buttonText="Button Text"><span>Children Text</span></ButtonPopover>);
    expect(screen.getByText('Button Text')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Button Text'));
    expect(screen.getByText('Children Text')).toBeInTheDocument();
  });
});
