import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import RepositoryItem, { RepositoryItemProps } from "../RepositoryItem";

const node: RepositoryItemProps = {
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
};

describe("resume | graphql | RepositoryItem", () => {
  it("renders as expected", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RepositoryItem {...node} />
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
  });

  it("renders without the user star", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RepositoryItem {...node} viewerHasStarred={false} />
      </MockedProvider>
    );

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Star (69)")).toBeInTheDocument();
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
  });
});
