import React from 'react';

export default function lazyWithPreload(ComponentPromise: Promise<any>) {
  return React.lazy(() => ComponentPromise);
}
