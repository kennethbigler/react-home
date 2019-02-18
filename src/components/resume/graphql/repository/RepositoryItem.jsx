import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import REPOSITORY_FRAGMENT from './fragments';
import Link from '../Link';

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

const updateRemoveStar = (
  client,
  { data: { removeStar: { starrable: { id } } } },
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

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription => viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription },
      },
    },
  },
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;
  totalCount = viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
    ? totalCount + 1
    : totalCount - 1;

  client.writeFragment({
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

const RepositoryItem = (props) => {
  const {
    id,
    name,
    url,
    descriptionHTML,
    primaryLanguage,
    owner,
    stargazers,
    watchers,
    viewerSubscription,
    viewerHasStarred,
  } = props;

  return (
    <div>
      <div className="RepositoryItem-title">
        <Typography variant="h3">
          <Link href={url}>{name}</Link>
        </Typography>

        {!viewerHasStarred
          ? (
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
          ) : (
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
          )}
        <Mutation
          mutation={WATCH_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
          optimisticResponse={{
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
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button
              className="RepositoryItem-title-action"
              onClick={updateSubscription}
              variant="outlined"
              color="primary"
            >
              {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
              {` (${watchers.totalCount})`}
            </Button>
          )}
        </Mutation>
      </div>

      <div className="RepositoryItem-description">
        <div
          className="RepositoryItem-description-info"
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />
        <div className="RepositoryItem-description-details">
          <div>
            {primaryLanguage && (
              <Typography inline>
                Language:
                {' '}
                {primaryLanguage.name}
              </Typography>
            )}
          </div>
          <div>
            {owner && (
              <Typography inline>
                Owner:
                {' '}
                <a href={owner.url}>{owner.login}</a>
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryItem;
