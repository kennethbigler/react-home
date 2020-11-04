import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';

import reducer from './store';
import { DBRootState } from './store/types';

interface CustomRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialState?: DBRootState;
  store?: Store;
}

const render = (
  ui: React.ReactElement,
  { initialState, store = createStore(reducer, initialState), ...renderOptions }: CustomRenderOptions = {},
): RenderResult => {
  const Wrapper: React.ComponentType = ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>
      { children }
    </Provider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

// override render method
export { render };
