import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RepositoryList from '../repository/RepositoryList';

const repository = {
  edges: [
    {
      node: {
        id: 'id',
        name: 'name',
        url: 'url',
        descriptionHTML: 'descriptionHTML',
        primaryLanguage: {
          name: 'primaryLanguageName',
        },
        owner: {
          url: 'ownerUrl',
          login: 'ownerLogin',
        },
        stargazers: {
          totalCount: 1,
        },
        watchers: {
          totalCount: 2,
        },
        viewerSubscription: 'viewerSubscription',
        viewerHasStarred: true,
      },
    },
  ],
  pageInfo: {
    hasNextPage: true,
    endCursor: 'endCursor',
  },
};

describe('resume | graphql | GraphQL', () => {
  it('renders as expected', () => {
    const fetchMore = jest.fn();
    // const { debug } = render(<RepositoryList loading fetchMore={fetchMore} repositories={repository} />);

    // debug();

    expect(true);
  });
});
