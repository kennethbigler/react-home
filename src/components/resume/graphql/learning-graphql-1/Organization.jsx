import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import Repository from './Repository';

const Organization = ({
  organization, errors, onFetchMoreIssues, onStarRepository,
}) => (errors
  ? (
    <p>
      <strong>Something went wrong: </strong>
      {map(errors, 'message').join(' ')}
    </p>
  ) : (
    <div>
      <p>
        <strong>Issues from Organization: </strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
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
  // types = [array, bool, func, number, object, string, symbol].isRequired
  organization: types.shape({}).isRequired,
  errors: types.arrayOf().isRequired,
  onFetchMoreIssues: types.func.isRequired,
  onStarRepository: types.func.isRequired,
};

export default Organization;
