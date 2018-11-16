import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import GraphQL from './GraphQL';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});

const cache = new InMemoryCache();

const client = new ApolloClient({ link: httpLink, cache });

const GraphQLWrapper = () => (
  <ApolloProvider client={client}>
    <GraphQL />
  </ApolloProvider>
);

export default GraphQLWrapper;
