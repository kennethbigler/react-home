import React from 'react';
import Button from '@material-ui/core/Button';
import Loading from '../../common/Loading';

interface Variables {
  cursor: any;
}
interface FetchMoreProps {
  loading: boolean;
  hasNextPage: boolean;
  variables: Variables;
  updateQuery: Function;
  fetchMore: Function;
  children?: React.ReactNodeArray | string;
}

const FetchMore: React.FC<FetchMoreProps> = (props: FetchMoreProps) => {
  const {
    loading, hasNextPage, variables, updateQuery,
    fetchMore, children,
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
              onClick={(): void => fetchMore({ variables, updateQuery })}
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

export default FetchMore;
