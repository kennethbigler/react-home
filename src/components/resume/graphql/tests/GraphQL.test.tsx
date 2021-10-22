import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import render from '../../../../redux-test-render';
import GraphQL from '../GraphQL';

describe('resume | graphql | GraphQL', () => {
  it('renders as expected', () => {
    render(<GraphQL />);

    expect(screen.getByText('GraphQL Demo')).toBeInTheDocument();
    expect(screen.getAllByText('Authorization Code')).toHaveLength(2);
    expect(screen.getByPlaceholderText('some 32 character string from github')).toBeInTheDocument();
    expect(screen.getByText('You need to generate a personal access token with "repo" and "admin:repo_hook" permissions.')).toBeInTheDocument();
    expect(screen.getByText('This can be done in the Developer settings on GitHub.')).toBeInTheDocument();
  });

  it('monitors field changes and displays error', () => {
    render(<GraphQL />);

    // will always be here
    expect(screen.getByPlaceholderText('some 32 character string from github')).toBeInTheDocument();

    // will be displayed because there is no token
    expect(screen.getByText('You need to generate a personal access token with "repo" and "admin:repo_hook" permissions.')).toBeInTheDocument();
    expect(screen.getByText('This can be done in the Developer settings on GitHub.')).toBeInTheDocument();

    // will be hidden for now
    expect(screen.queryByDisplayValue('1')).toBeNull();
    expect(screen.queryByText('Loading ...')).toBeNull();

    fireEvent.change(screen.getByPlaceholderText('some 32 character string from github'), { target: { value: '1' }});

    // will be hidden because there is a token now
    expect(screen.queryByText('You need to generate a personal access token with "repo" and "admin:repo_hook" permissions.')).toBeNull();
    expect(screen.queryByText('This can be done in the Developer settings on GitHub.')).toBeNull();

    // will be displayed because of an invalid token
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
  });
});
