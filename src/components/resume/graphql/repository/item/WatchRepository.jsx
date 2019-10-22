import React from 'react';
import types from 'prop-types';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { useMutation } from '@apollo/react-hooks';
import REPOSITORY_FRAGMENT from '../fragments';

const WATCH_REPOSITORY = gql`
  mutation ($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = (viewerSubscription) => viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (cache, mutationResult) => {
  const { data: { updateSubscription: { subscribable: { id, viewerSubscription }}}} = mutationResult;

  const repository = cache.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;
  totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
    ? totalCount + 1
    : totalCount - 1;

  cache.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

const WatchRepository = (props) => {
  const { id, watchers, viewerSubscription } = props;
  const [updateSubscription] = useMutation(WATCH_REPOSITORY, {
    variables: {
      id,
      viewerSubscription: isWatch(viewerSubscription)
        ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
        : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
    },
    optimisticResponse: {
      updateSubscription: {
        __typename: 'Mutation',
        subscribable: {
          __typename: 'Repository',
          id,
          viewerSubscription: isWatch(viewerSubscription)
            ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
            : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
        },
      },
    },
    update: updateWatch,
  });

  return (
    <Button
      className="RepositoryItem-title-action"
      onClick={updateSubscription}
      variant="outlined"
      color="primary"
    >
      {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
      {` (${watchers.totalCount})`}
    </Button>
  );
};

WatchRepository.propTypes = {
  id: types.string.isRequired,
  watchers: types.shape({
    totalCount: types.number,
  }).isRequired,
  viewerSubscription: types.string.isRequired,
};

export default WatchRepository;
