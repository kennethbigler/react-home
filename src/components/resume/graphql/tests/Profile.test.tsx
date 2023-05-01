import { screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import render from "../../../../recoil-test-render";
import Profile, { GET_REPOSITORIES_OF_CURRENT_USER } from "../Profile";

describe("resume | graphql | Profile", () => {
  it("renders as loading if you don't wait for result", () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
            error: new Error("An error occurred"),
          },
        ]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>
    );

    expect(screen.getByText("Loading ...")).toBeInTheDocument();
  });

  it("has error", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
            error: new Error("An error occurred"),
          },
        ]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>
    );

    await waitFor(() => screen.getByText("ApolloError: An error occurred"));
    expect(
      screen.getByText("ApolloError: An error occurred")
    ).toBeInTheDocument();
  });

  it("has no data", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
            result: { data: undefined },
          },
        ]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>
    );

    await waitFor(() => screen.getByText("Something Went Wrong"));
    expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
  });

  it.skip("has data", async () => {
    // https://www.apollographql.com/docs/react/development-testing/testing/
    render(
      <MockedProvider
        mocks={[
          {
            request: { query: GET_REPOSITORIES_OF_CURRENT_USER },
            result: {
              data: {
                repositories: {
                  viewer: {
                    repositories: {
                      edges: [
                        {
                          node: {
                            id: "id",
                            name: "name",
                            url: "url",
                            descriptionHTML: "descriptionHTML",
                            primaryLanguage: {
                              name: "primaryLanguage - name",
                            },
                            owner: {
                              login: "owner - login",
                              url: "owner - url",
                            },
                            stargazers: {
                              totalCount: 69,
                            },
                            viewerHasStarred: true,
                            watchers: {
                              totalCount: 42,
                            },
                            viewerSubscription: "viewerSubscription",
                          },
                        },
                      ],
                      pageInfo: {
                        endCursor: "endCursor",
                        hasNextPage: false,
                      },
                    },
                  },
                },
              },
            },
          },
        ]}
        addTypename={false}
      >
        <Profile />
      </MockedProvider>
    );

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
  });
});
