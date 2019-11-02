import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Profile from './Profile';
import { setToken } from '../../../store/modules/gqlToken';
import Header from './Header';
import NoToken from './NoToken';
import { DBRootState } from '../../../store/types';

interface StateActions {
  setToken: Function;
}
interface GraphQLProps {
  gqlToken: string;
  stateActions: StateActions;
}

const GITHUB_BASE_URL = 'https://api.github.com/graphql';
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) { /* do something with graphql error */ }
  if (networkError) { /* do something with network error */ }
});
const cache = new InMemoryCache();

/* GraphQL  ->  Header
 *         |->  NoToken
 *         |->  Profile  ->  Repository
 *            Loading  <-|->  ErrorMessage */
const GraphQL: React.FC<GraphQLProps> = React.memo((props: GraphQLProps) => {
  const { gqlToken, stateActions } = props;
  const [authToken, setAuthToken] = useState(gqlToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const token = e.target.value;
    stateActions.setToken(token);
    setAuthToken(token);
  };

  if (!gqlToken) {
    return (
      <>
        <Header authToken={authToken} onChange={handleChange} />
        <NoToken />
      </>
    );
  }

  const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
      authorization: `Bearer ${gqlToken}`,
    },
  });
  const link = ApolloLink.from([errorLink, httpLink]);
  const client = new ApolloClient({ link, cache });

  return (
    <ApolloProvider client={client}>
      <Header authToken={authToken} onChange={handleChange} />
      <Profile />
    </ApolloProvider>
  );
});

// react-redux export
const mapStateToProps = (state: DBRootState): { gqlToken: string } => ({
  gqlToken: state.gqlToken,
});
const mapDispatchToProps = (dispatch: Dispatch): { stateActions: StateActions } => ({
  stateActions: bindActionCreators({ setToken }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphQL);
