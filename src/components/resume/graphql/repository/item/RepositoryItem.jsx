import React, { Fragment } from 'react';
import types from 'prop-types';
import { Typography } from '@material-ui/core';
import Link from '../../Link';
import Description from './Description';
import WatchRepository from './WatchRepository';
import StarRepository from './StarRepository';
import UnstarRepository from './UnstarRepository';

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
    <>
      <div className="RepositoryItem-title">
        <Typography variant="h3">
          <Link href={url}>{name}</Link>
        </Typography>
        {!viewerHasStarred
          ? (<StarRepository id={id} stargazers={stargazers} />)
          : (<UnstarRepository id={id} stargazers={stargazers} />)}
        <WatchRepository id={id} watchers={watchers} viewerSubscription={viewerSubscription} />
      </div>

      <Description descriptionHTML={descriptionHTML} primaryLanguage={primaryLanguage} owner={owner} />
    </>
  );
};

RepositoryItem.propTypes = {
  id: types.string.isRequired,
  name: types.string.isRequired,
  url: types.string.isRequired,
  descriptionHTML: types.string.isRequired,
  primaryLanguage: types.shape({
    name: types.string.isRequired,
  }),
  owner: types.shape({
    url: types.string,
    login: types.string,
  }),
  stargazers: types.shape({
    totalCount: types.number,
  }).isRequired,
  watchers: types.shape({
    totalCount: types.number,
  }).isRequired,
  viewerSubscription: types.string.isRequired,
  viewerHasStarred: types.bool.isRequired,
};

export default RepositoryItem;
