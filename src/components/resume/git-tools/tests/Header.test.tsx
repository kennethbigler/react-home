import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

describe('resume | git-tools | Header', () => {
  it('renders as expected', () => {
    const handleIdChange = jest.fn();
    render(<Header gitTheme="red" onIdChange={handleIdChange} storyID="KEN-1234" />);

    expect(screen.getByText('Git Tools')).toBeInTheDocument();
    expect(screen.getByText('User Story ID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('KEN-1234')).toBeInTheDocument();

    expect(screen.getByText('User Story ID')).toHaveStyle('color: red;');
  });

  it('handles id changes', () => {
    const handleIdChange = jest.fn();
    render(<Header gitTheme="red" onIdChange={handleIdChange} />);

    fireEvent.change(screen.getByText('User Story ID').nextSibling!.lastChild!, { target: { value: 'KEN-1234' }});
    expect(handleIdChange).toHaveBeenCalledTimes(1);
  });

  it('displays an error when ticket of the wrong format is provided', () => {
    const handleIdChange = jest.fn();
    render(<Header gitTheme="red" onIdChange={handleIdChange} storyID="1234" />);

    expect(screen.getByText('Git Tools')).toBeInTheDocument();
    expect(screen.getByText('User Story ID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234')).toBeInTheDocument();
    expect(screen.getByText('User Story ID').parentNode?.querySelector('.Mui-error')).toBeInTheDocument();
  });
});
