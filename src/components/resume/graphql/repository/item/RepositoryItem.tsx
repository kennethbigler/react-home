import React from "react";
import Typography from "@mui/material/Typography";
import Link from "./Link";
import Description from "./Description";
import WatchRepository from "./WatchRepository";
import StarRepository from "./StarRepository";
import UnstarRepository from "./UnstarRepository";
import { Owner, PrimaryLanguage, StarGazers, Watchers } from "./types";

export interface RepositoryItemProps {
  id: string;
  name: string;
  url: string;
  descriptionHTML: string;
  primaryLanguage: PrimaryLanguage;
  owner: Owner;
  stargazers: StarGazers;
  watchers: Watchers;
  viewerSubscription: string;
  viewerHasStarred: boolean;
}

/* RepositoryItem  ->  StarRepository
 *                |->  UnstarRepository
 *                | -> WatchRepository
 *                | -> Description */
const RepositoryItem: React.FC<RepositoryItemProps> = (
  props: RepositoryItemProps
) => {
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
    <>
      <div className="RepositoryItem-title">
        <Typography variant="h3">
          <Link href={url}>{name}</Link>
        </Typography>
        {!viewerHasStarred ? (
          <StarRepository id={id} stargazers={stargazers} />
        ) : (
          <UnstarRepository id={id} stargazers={stargazers} />
        )}
        <WatchRepository
          id={id}
          watchers={watchers}
          viewerSubscription={viewerSubscription}
        />
      </div>

      <Description
        descriptionHTML={descriptionHTML}
        primaryLanguage={primaryLanguage}
        owner={owner}
      />
    </>
  );
};

export default RepositoryItem;
