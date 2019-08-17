import React from 'react';
import types from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
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

const updateRemoveStar = (
  client,
  { data: { removeStar: { starrable: { id }}}},
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
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

  /* eslint-disable no-unused-vars */

  return (
    <Mutation
      mutation={UNSTAR_REPOSITORY}
      variables={{ id }}
      optimisticResponse={{
        removeStar: {
          __typename: 'Mutation',
          starrable: {
            __typename: 'Repository',
            id,
            viewerHasStarred: false,
          },
        },
      }}
      update={updateRemoveStar}
    >
      {(removeStar, { data, loading, error }) => (
        <Button
          className="RepositoryItem-title-action"
          onClick={removeStar}
          variant="outlined"
          color="primary"
        >
          UnStar (
          {stargazers.totalCount}
          )
        </Button>
      )}
    </Mutation>
  );
};

/* eslint-enable no-unused-vars */

UnstarRepository.propTypes = {
  id: types.string.isRequired,
  stargazers: types.shape({
    totalCount: types.number,
  }).isRequired,
};

export default UnstarRepository;
