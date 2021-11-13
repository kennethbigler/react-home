import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Profile from "./Profile";
import { setToken } from "../../../store/modules/gqlToken";
import Header from "./Header";
import NoToken from "./NoToken";
import { DBRootState } from "../../../store/types";

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
  const gqlToken = useSelector((state: DBRootState) => state.gqlToken);
  const dispatch = useDispatch();

  const [authToken, setAuthToken] = React.useState(gqlToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const token = e.target.value;
    dispatch(setToken(token));
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

export default GraphQL;
