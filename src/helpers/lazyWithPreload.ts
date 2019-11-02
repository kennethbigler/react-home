import React from 'react';

type Props = {};
type ReactComponent = React.ComponentType<Props>;
type ImportPromise = Promise<{ default: ReactComponent }>;
type LazyComponent = React.LazyExoticComponent<ReactComponent>;

export default function lazyWithPreload(ComponentPromise: ImportPromise): LazyComponent {
  return React.lazy(() => ComponentPromise);
}
