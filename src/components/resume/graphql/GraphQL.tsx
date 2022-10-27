import * as React from "react";
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useRecoilState } from "recoil";
import gqlTokenAtom from "../../../recoil/gql-token-atom";
import Profile from "./Profile";
import Header from "./Header";
import NoToken from "./NoToken";

const GITHUB_BASE_URL = "https://api.github.com/graphql";
const errorLink = onError((/* { graphQLErrors, networkError } */) => {
  /* if (graphQLErrors) { do something with graphql error } */
  /* if (networkError) { do something with network error } */
});
const cache = new InMemoryCache();

/* GraphQL  ->  Header
 *         |->  NoToken
 *         |->  Profile  ->  Repository
 *            Loading  <-|->  ErrorMessage */
const GraphQL: React.FC = React.memo(() => {
  const [authToken, setAuthToken] = useRecoilState(gqlTokenAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setAuthToken(e.target.value);

  if (!authToken) {
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
      authorization: `Bearer ${authToken}`,
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

export default GraphQL;
