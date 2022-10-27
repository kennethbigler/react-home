import * as React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import Loading from "./common/Loading";
import RepositoryList, { REPOSITORY_FRAGMENT } from "./repository";
import ErrorMessage from "./ErrorMessage";
import { Repository } from "./repository/item/FetchMore";

export const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query ($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`;

interface ProfileData {
  viewer: {
    repositories: Repository;
  };
}

const Profile: React.FC = React.memo(() => {
  const { error, data, loading, fetchMore } = useQuery<ProfileData>(
    GET_REPOSITORIES_OF_CURRENT_USER
  );

  // check errors
  if (error || (!loading && !data)) {
    return <ErrorMessage error={error} />;
  }

  // check for data
  if (!data || !data.viewer || loading) {
    return <Loading />;
  }

  // display data
  return (
    <RepositoryList
      loading={loading}
      repositories={data.viewer.repositories}
      fetchMore={fetchMore}
    />
  );
});

export default Profile;
