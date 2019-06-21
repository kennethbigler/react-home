import React from 'react';
import types from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import REPOSITORY_FRAGMENT from '../fragments';

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

const updateAddStar = (
  client,
  { data: { addStar: { starrable: { id } } } },
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.stargazers.totalCount + 1;

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

const StarRepository = (props) => {
  const { id, stargazers } = props;

  /* eslint-disable no-unused-vars */

  return (
    <Mutation
      mutation={STAR_REPOSITORY}
      variables={{ id }}
      optimisticResponse={{
        addStar: {
          __typename: 'Mutation',
          starrable: {
            __typename: 'Repository',
            id,
            viewerHasStarred: true,
          },
        },
      }}
      update={updateAddStar}
    >
      {(addStar, { data, loading, error }) => (
        <Button
          className="RepositoryItem-title-action"
          onClick={addStar}
          variant="outlined"
          color="primary"
        >
          Star (
          {stargazers.totalCount}
          )
        </Button>
      )}
    </Mutation>
  );
};

/* eslint-enable no-unused-vars */

StarRepository.propTypes = {
  id: types.string.isRequired,
  stargazers: types.shape({
    totalCount: types.number,
  }).isRequired,
};

export default StarRepository;
