import React from 'react';
import { screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import render from '../../../../redux-test-render';
import Profile, { GET_REPOSITORIES_OF_CURRENT_USER } from '../Profile';

describe('resume | graphql | Profile', () => {
  it("renders as loading if you don't wait for result", () => {
    render(
      <MockedProvider
        mocks={[{
          request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
          error: new Error('An error occurred'),
        }]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>,
    );

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });

  it('has error', async () => {
    render(
      <MockedProvider
        mocks={[{
          request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
          error: new Error('An error occurred'),
        }]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
  });

  it('has no data', async () => {
    render(
      <MockedProvider
        mocks={[{
          request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
          result: { data: undefined },
        }]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it.skip('has data', async () => {
    const { debug } = render(
      <MockedProvider
        mocks={[{
          request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
          result: {
            data: {
              repositories: {
                viewer: {
                  repositories: {
                    edges: [{
                      node: {
                        id: 'id',
                        name: 'name',
                        url: 'url',
                        descriptionHTML: 'descriptionHTML',
                        primaryLanguage: {
                          name: 'primaryLanguage - name',
                        },
                        owner: {
                          login: 'owner - login',
                          url: 'owner - url',
                        },
                        stargazers: {
                          totalCount: 69,
                        },
                        viewerHasStarred: true,
                        watchers: {
                          totalCount: 42,
                        },
                        viewerSubscription: 'viewerSubscription',
                      },
                    }],
                    pageInfo: {
                      endCursor: 'endCursor',
                      hasNextPage: false,
                    },
                  },
                },
              },
            },
          },
        }]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    debug();

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });
});
