import React from 'react';
import { Provider } from 'react-redux';
import throttle from 'lodash/throttle';
import { configureStore, saveState } from './store/configureStore';
import WithTheme from './WithTheme';

// set state to previous or new state, and add watcher to save
const store = configureStore();
store.subscribe(throttle(() => saveState(store.getState()), 1000));

/** App class that wraps higher level components of the application */
const WithStore = () => (
  <Provider store={store}>
    <WithTheme />
  </Provider>
);

export default WithStore;
