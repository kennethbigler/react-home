import React from 'react';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { useMutation } from '@apollo/react-hooks';
import { MutationUpdaterFn } from 'apollo-client';
import REPOSITORY_FRAGMENT from '../fragments';
import { StarRepositoryProps } from './types';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const updateAddStar: MutationUpdaterFn = (cache, mutationResult): void => {
  const { data } = mutationResult;
  if (!data) {
    return;
  }
  const { addStar: { starrable: { id }}} = data;

  const repository: StarRepositoryProps | null = cache.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  if (!repository) {
    return;
  }

  const totalCount = repository.stargazers.totalCount + 1;

  cache.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

const StarRepository: React.FC<StarRepositoryProps> = (props: StarRepositoryProps) => {
  const { id, stargazers } = props;
  const [addStar] = useMutation(STAR_REPOSITORY, {
    variables: { id },
    update: updateAddStar,
    optimisticResponse: {
      addStar: {
        __typename: 'Mutation',
        starrable: { __typename: 'Repository', id, viewerHasStarred: true },
      },
    },
  });

  return (
    <Button
      className="RepositoryItem-title-action"
      onClick={addStar as React.MouseEventHandler}
      variant="outlined"
      color="primary"
    >
      {`Star (${stargazers.totalCount})`}
    </Button>
  );
};

export default StarRepository;
