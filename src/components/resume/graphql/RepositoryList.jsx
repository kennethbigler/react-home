import React from 'react';
import map from 'lodash/map';
import RepositoryItem from './RepositoryItem';

const RepositoryList = ({ repositories }) => map(repositories.edges, ({ node }) => (
  <div key={node.id} className="RepositoryItem">
    <RepositoryItem {...node} />
  </div>
));

export default RepositoryList;
