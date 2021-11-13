import React from "react";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import RepositoryList from "./RepositoryList";
import { Repository } from "./item/FetchMore";

const repositories: Repository = {
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
};

describe("resume | graphql | RepositoryList", () => {
  it("renders as expected", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RepositoryList
          repositories={repositories}
          loading
          fetchMore={jest.fn()}
        />
      </MockedProvider>
    );

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("UnStar (69)")).toBeInTheDocument();
    expect(screen.getByText("Watch (42)")).toBeInTheDocument();
    expect(screen.getByText("descriptionHTML")).toBeInTheDocument();
    expect(
      screen.getByText("Language: primaryLanguage - name")
    ).toBeInTheDocument();
    expect(screen.getByText("Owner:")).toBeInTheDocument();
    expect(screen.getByText("owner - login")).toHaveAttribute(
      "href",
      "owner - url"
    );
    expect(screen.getByText("Loading ...")).toBeInTheDocument();
  });
});
