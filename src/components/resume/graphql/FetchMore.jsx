import React from 'react';
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
        )
      }
    </div>
  );
};

export default FetchMore;
