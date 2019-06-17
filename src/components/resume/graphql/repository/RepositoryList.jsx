import React, { Fragment } from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import RepositoryItem from './RepositoryItem';
import FetchMore from '../FetchMore';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList = ({ repositories, loading, fetchMore }) => (
  <Fragment>
    {map(repositories.edges, ({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

RepositoryList.propTypes = {
  repositories: types.shape({
    edges: types.arrayOf(types.object).isRequired,
    pageInfo: types.shape({
      hasNextPage: types.bool.isRequired,
      endCursor: types.string.isRequired,
    }).isRequired,
  }).isRequired,
  loading: types.bool.isRequired,
  fetchMore: types.func.isRequired,
};

export default RepositoryList;
