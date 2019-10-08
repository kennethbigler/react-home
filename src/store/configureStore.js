import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import localForage from 'localforage';
import rootReducer from '.';
import initialState from './initialState';

/** funtion to read 'state' value from local storage and return it, or default state
 * @return {Object[]} - last saved application state
 */
export const loadState = async () => localForage
  .getItem('state')
  .then((state) => (state ? { ...initialState, ...state } : initialState))
  // if there are any issues, just load default state
  .catch(() => initialState);

/** funtion to save 'state' value to local storage
 * @param {Object[]} state - current application state
 */
export const saveState = (state) => localForage
  .setItem('state', state)
  .catch((e) => console.log('state to db save failed: ', e));

export const configureStore = (state) => createStore(
  rootReducer,
  state,
  composeWithDevTools(applyMiddleware(thunk)),
);
