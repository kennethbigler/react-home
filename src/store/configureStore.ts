import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import localForage from 'localforage';

import { DBRootState } from './types';
import rootReducer from '.';
import initialState from './initialState';

/** funtion to read 'state' value from local storage and return it, or default state */
export const loadState = async (): Promise<DBRootState> => localForage
  .getItem('state')
  .then((state) => (state ? { ...initialState, ...state } : initialState) as DBRootState)
  // if there are any issues, just load default state
  .catch(() => initialState);

/** funtion to save 'state' value to local storage */
export const saveState = (state: DBRootState): Promise<any> => localForage
  .setItem('state', state)
  .catch((e) => console.log('state to db save failed: ', e));

export const configureStore = (state: DBRootState): Store => createStore(
  rootReducer,
  state,
  composeWithDevTools(applyMiddleware(thunk)),
);
