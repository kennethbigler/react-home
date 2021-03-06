import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Loading from './common/Loading';
import RepositoryList, { REPOSITORY_FRAGMENT } from './repository';
import ErrorMessage from './ErrorMessage';

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
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

const Profile: React.FC = React.memo(() => {
  const {
    error, data, loading, fetchMore,
  } = useQuery(GET_REPOSITORIES_OF_CURRENT_USER);

  // check errors
  if (error || !data) {
    return <ErrorMessage error={error} />;
  }

  // check for data
  const { viewer } = data;
  if (loading && !viewer) {
    return <Loading />;
  }

  // display data
  return <RepositoryList loading={loading} repositories={viewer.repositories} fetchMore={fetchMore} />;
});

export default Profile;
