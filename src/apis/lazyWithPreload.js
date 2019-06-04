import React from 'react';

export default function lazyWithPreload(ComponentPromise) {
  return React.lazy(() => ComponentPromise);
}
