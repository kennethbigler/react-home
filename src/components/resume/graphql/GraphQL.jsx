import React, { useState } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Profile from './Profile';
import { setToken } from '../../../store/modules/graphql';
import Header from './Header';
import NoToken from './NoToken';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // do something with graphql error
  }
  if (networkError) {
    // do something with network error
  }
});
const cache = new InMemoryCache();

const GraphQL = (props) => {
  const { graphQLToken, stateActions } = props;
  const [authToken, setAuthToken] = useState(graphQLToken);

  const handleChange = (e) => {
    const token = e.target.value;
    stateActions.setToken(token);
    setAuthToken(token);
  };

  if (!graphQLToken) {
    return (
      <div>
        <Header authToken={authToken} onChange={handleChange} />
        <NoToken />
      </div>
    );
  }

  const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
      authorization: `Bearer ${graphQLToken}`,
    },
  });
  const link = ApolloLink.from([errorLink, httpLink]);
  const client = new ApolloClient({ link, cache });

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Header authToken={authToken} onChange={handleChange} />
        <Profile />
      </ApolloHooksProvider>
    </ApolloProvider>
  );
};

GraphQL.propTypes = {
  graphQLToken: types.string,
  stateActions: types.shape({
    setToken: types.func.isRequired,
  }).isRequired,
};

// react-redux export
const mapStateToProps = (state) => ({ graphQLToken: state.graphql.token });
const mapDispatchToProps = (dispatch) => ({
  stateActions: bindActionCreators({ setToken }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphQL);
