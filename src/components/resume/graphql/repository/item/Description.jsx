import React from 'react';
import types from 'prop-types';
import { Typography } from '@material-ui/core';

/* eslint-disable react/no-danger */

const Description = (props) => {
  const { descriptionHTML, primaryLanguage, owner } = props;

  return (
    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && (
            <Typography display="inline">
              Language:
              {' '}
              {primaryLanguage.name}
            </Typography>
          )}
        </div>
        <div>
          {owner && (
            <Typography display="inline">
              Owner:
              {' '}
              <a href={owner.url}>{owner.login}</a>
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

/* eslint-enable react/no-danger */

Description.propTypes = {
  descriptionHTML: types.string.isRequired,
  primaryLanguage: types.shape({
    name: types.string.isRequired,
  }),
  owner: types.shape({
    url: types.string,
    login: types.string,
  }),
};

export default Description;
