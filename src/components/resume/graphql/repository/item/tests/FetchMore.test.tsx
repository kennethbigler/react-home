import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FetchMore from '../FetchMore';

describe('resume | graphql | FetchMore', () => {
  it('renders as expected when loading', () => {
    render(
      <FetchMore
        loading
        hasNextPage
        variables={{ cursor: 'cursor' }}
        updateQuery={jest.fn()}
        fetchMore={jest.fn()}
      >
        Children
      </FetchMore>,
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('renders as expected when loaded', () => {
    const handleFetchMore = jest.fn();
    render(
      <FetchMore
        hasNextPage
        loading={false}
        variables={{ cursor: 'cursor' }}
        updateQuery={jest.fn()}
        fetchMore={handleFetchMore}
      >
        Children
      </FetchMore>,
    );

    expect(handleFetchMore).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByText('More Children'));
    expect(handleFetchMore).toHaveBeenCalledTimes(1);
  });
});
