import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';
import { Typography } from '@material-ui/core';

const Repository = ({ repository, onFetchMoreIssues, onStarRepository }) => (
  <div>
    <Typography>
      <strong>In Repository: </strong>
      <a href={repository.url}>{repository.name}</a>
    </Typography>

    <button
      type="button"
      onClick={() => onStarRepository(repository.id, repository.viewerHasStarred)}
    >
      {repository.stargazers.totalCount}
      {repository.viewerHasStarred ? 'Unstar' : 'Star'}
    </button>

    <ul>
      {map(repository.issues.edges, issue => (
        <Typography>
          <li key={issue.node.id}>
            <a href={issue.node.url}>{issue.node.title}</a>

            <ul>
              {map(issue.node.reactions.edges, reaction => (
                <li key={reaction.node.id}>{reaction.node.content}</li>
              ))}
            </ul>
          </li>
        </Typography>
      ))}
    </ul>

    <hr />

    {repository.issues.pageInfo.hasNextPage && <button type="button" onClick={onFetchMoreIssues}>More</button>}
  </div>
);

Repository.propTypes = {
  repository: types.shape({}).isRequired,
  onFetchMoreIssues: types.func.isRequired,
  onStarRepository: types.func.isRequired,
};

export default Repository;
