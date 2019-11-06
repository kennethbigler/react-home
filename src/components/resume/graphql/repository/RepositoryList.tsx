import React from 'react';
import RepositoryItem from './item';
import FetchMore from './item/FetchMore';

interface PageInto {
  hasNextPage: boolean;
  endCursor: string;
}
interface Repository {
  edges: any[];
  pageInfo: PageInto;
}
interface RepositoryListProps {
  repositories: Repository;
  loading: boolean;
  fetchMore: Function;
}

const updateQuery = (previousResult: any, { fetchMoreResult }: any): any => {
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

const RepositoryList: React.FC<RepositoryListProps> = (props: RepositoryListProps) => {
  const { repositories, loading, fetchMore } = props;

  return (
    <>
      {repositories.edges.map(({ node }) => (
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
    </>
  );
};

export default RepositoryList;
