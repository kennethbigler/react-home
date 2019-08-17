import React from 'react';
import types from 'prop-types';
import Button from '@material-ui/core/Button';
import Loading from './Loading';

const FetchMore = (props) => {
  const {
    loading,
    hasNextPage,
    variables,
    updateQuery,
    fetchMore,
    children,
  } = props;

  return (
    <div className="FetchMore">
      {loading
        ? (
          <Loading />
        ) : (
          hasNextPage && (
            <Button
              className="FetchMore-button"
              onClick={() => fetchMore({ variables, updateQuery })}
              variant="outlined"
              color="primary"
            >
              More
              {' '}
              {children}
            </Button>
          )
        )}
    </div>
  );
};

FetchMore.propTypes = {
  loading: types.bool.isRequired,
  hasNextPage: types.bool.isRequired,
  variables: types.shape({
    cursor: types.shape.isRequired,
  }).isRequired,
  updateQuery: types.func.isRequired,
  fetchMore: types.func.isRequired,
  children: types.node,
};

export default FetchMore;
