import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render as rtlRender } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './store';

const render = (
  ui: any,
  { initialState, store = createStore(reducer, initialState), ...renderOptions }: any = {},
): any => {
  const Wrapper = ({ children }: { children: any }): any => (
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
