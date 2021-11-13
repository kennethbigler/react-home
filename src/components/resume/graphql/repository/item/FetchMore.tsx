import React from "react";
import Button from "@mui/material/Button";
import Loading from "../../common/Loading";
import type { RepositoryItemProps } from "./RepositoryItem";

interface Variables {
  cursor: unknown;
}
interface PageInto {
  hasNextPage: boolean;
  endCursor: string;
}
interface Edge {
  node: RepositoryItemProps;
}
export interface Repository {
  edges: Edge[];
  pageInfo: PageInto;
}
interface Result {
  viewer: {
    repositories: Repository;
    [props: string]: unknown;
  };
  [props: string]: unknown;
}
export type UpdateQueryType = (
  previousResult: Result,
  {
    fetchMoreResult,
  }: {
    fetchMoreResult: Result;
  }
) => Result;
interface FetchMoreProps {
  loading: boolean;
  hasNextPage: boolean;
  variables: Variables;
  updateQuery: UpdateQueryType;
  // eslint-disable-next-line @typescript-eslint/ban-types
  fetchMore: Function;
  children?: string;
}

const FetchMore: React.FC<FetchMoreProps> = (props: FetchMoreProps) => {
  const { loading, hasNextPage, variables, updateQuery, fetchMore, children } =
    props;

  return (
    <div className="FetchMore">
      {loading ? (
        <Loading />
      ) : (
        hasNextPage && (
          <Button
            className="FetchMore-button"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            onClick={(): void => fetchMore({ variables, updateQuery })}
            variant="outlined"
            color="primary"
          >
            {`More ${children || ""}`}
          </Button>
        )
      )}
    </div>
  );
};

export default FetchMore;
