import React from 'react';
import { ApolloError } from '@apollo/client/core/';

interface ErrorMessageProps {
  error?: ApolloError;
}

const ErrorMessage: React.FC<ErrorMessageProps> = (props: ErrorMessageProps) => {
  const { error } = props;

  return (
    <div>
      <small>{error ? error.toString() : 'Something Went Wrong'}</small>
    </div>
  );
};

export default ErrorMessage;
