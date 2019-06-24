import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';
import Repository from './Repository';

const Organization = ({
  organization, errors, onFetchMoreIssues, onStarRepository,
}) => (errors
  ? (
    <Typography>
      <strong>Something went wrong: </strong>
      {map(errors, 'message').join(' ')}
    </Typography>
  ) : (
    <div>
      <Typography>
        <strong>Issues from Organization: </strong>
        <a href={organization.url}>{organization.name}</a>
      </Typography>
      {organization.repository
        && (
          <Repository
            repository={organization.repository}
            onFetchMoreIssues={onFetchMoreIssues}
            onStarRepository={onStarRepository}
          />
        )
      }
    </div>
  ));

Organization.propTypes = {
  organization: types.shape({}).isRequired,
  errors: types.arrayOf().isRequired,
  onFetchMoreIssues: types.func.isRequired,
  onStarRepository: types.func.isRequired,
};

export default Organization;
