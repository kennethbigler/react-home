import React from 'react';

type ImportPromise = Promise<{ default: React.ComponentType }>;
type LazyComponent = React.LazyExoticComponent<React.ComponentType>;

export default function lazyWithPreload(ComponentPromise: ImportPromise): LazyComponent {
  return React.lazy(() => ComponentPromise);
}
