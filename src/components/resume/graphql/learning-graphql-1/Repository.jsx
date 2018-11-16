import React from 'react';
import types from 'prop-types';
import map from 'lodash/map';

const Repository = ({ repository, onFetchMoreIssues, onStarRepository }) => (
  <div>
    <p>
      <strong>In Repository: </strong>
      <a href={repository.url}>{repository.name}</a>
    </p>

    <button
      type="button"
      onClick={() => onStarRepository(repository.id, repository.viewerHasStarred)}
    >
      {repository.stargazers.totalCount}
      {repository.viewerHasStarred ? 'Unstar' : 'Star'}
    </button>

    <ul>
      {map(repository.issues.edges, issue => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>

          <ul>
            {map(issue.node.reactions.edges, reaction => (
              <li key={reaction.node.id}>{reaction.node.content}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>

    <hr />

    {repository.issues.pageInfo.hasNextPage && <button type="button" onClick={onFetchMoreIssues}>More</button>}
  </div>
);

Repository.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  repository: types.shape({}).isRequired,
  onFetchMoreIssues: types.func.isRequired,
  onStarRepository: types.func.isRequired,
};

export default Repository;
