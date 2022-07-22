import React from "react";
import gql from "graphql-tag";
import Button from "@mui/material/Button";
import { useMutation, MutationUpdaterFn } from "@apollo/client";
import REPOSITORY_FRAGMENT from "../fragments";
import { Watchers } from "./types";

interface WatchRepositoryProps {
  id: string;
  watchers: Watchers;
  viewerSubscription: string;
}

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
  SUBSCRIBED: "SUBSCRIBED",
  UNSUBSCRIBED: "UNSUBSCRIBED",
};

const isWatch = (viewerSubscription: string): boolean =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

export const updateWatch: MutationUpdaterFn = (cache, mutationResult) => {
  const { data } = mutationResult;
  if (!data) {
    return;
  }

  const {
    updateSubscription: {
      subscribable: { id, viewerSubscription },
    },
  } = data;

  const repository: WatchRepositoryProps | null = cache.readFragment({
    id: `Repository:${id as string}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  if (!repository) {
    return;
  }

  let { totalCount } = repository.watchers;
  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
      ? totalCount + 1
      : totalCount - 1;

  cache.writeFragment({
    id: `Repository:${id as string}`,
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

const WatchRepository: React.FC<WatchRepositoryProps> = (
  props: WatchRepositoryProps
) => {
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
        __typename: "Mutation",
        subscribable: {
          __typename: "Repository",
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
      onClick={updateSubscription as React.MouseEventHandler}
      variant="outlined"
      color="secondary"
    >
      {`${isWatch(viewerSubscription) ? "Unwatch" : "Watch"} (${
        watchers.totalCount
      })`}
    </Button>
  );
};

export default WatchRepository;
