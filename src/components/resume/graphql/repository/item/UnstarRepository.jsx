import React from 'react';
import types from 'prop-types';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { useMutation } from '@apollo/react-hooks';
import REPOSITORY_FRAGMENT from '../fragments';

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

const updateRemoveStar = (cache, mutationResult) => {
  const { data: { removeStar: { starrable: { id }}}} = mutationResult;
  const repository = cache.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

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

const UnstarRepository = (props) => {
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
      onClick={removeStar}
      variant="outlined"
      color="primary"
    >
      {`UnStar (${stargazers.totalCount})`}
    </Button>
  );
};

UnstarRepository.propTypes = {
  id: types.string.isRequired,
  stargazers: types.shape({
    totalCount: types.number,
  }).isRequired,
};

export default UnstarRepository;
