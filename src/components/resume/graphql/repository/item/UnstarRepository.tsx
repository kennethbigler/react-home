import React from 'react';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { useMutation, MutationUpdaterFn } from '@apollo/client';
import REPOSITORY_FRAGMENT from '../fragments';
import { StarRepositoryProps } from './types';

const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const updateRemoveStar: MutationUpdaterFn = (cache, mutationResult) => {
  const { data } = mutationResult;
  if (!data) {
    return;
  }

  const { removeStar: { starrable: { id }}} = data;
  const repository: StarRepositoryProps | null = cache.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  if (!repository) {
    return;
  }

  const totalCount = repository.stargazers.totalCount - 1;

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

const UnstarRepository: React.FC<StarRepositoryProps> = (props: StarRepositoryProps) => {
  const { id, stargazers } = props;
  const [removeStar] = useMutation(UNSTAR_REPOSITORY, {
    variables: { id },
    optimisticResponse: {
      removeStar: {
        __typename: 'Mutation',
        starrable: {
          __typename: 'Repository',
          id,
          viewerHasStarred: false,
        },
      },
    },
    update: updateRemoveStar,
  });

  return (
    <Button
      className="RepositoryItem-title-action"
      onClick={removeStar as React.MouseEventHandler}
      variant="outlined"
      color="primary"
    >
      {`UnStar (${stargazers.totalCount})`}
    </Button>
  );
};

export default UnstarRepository;
