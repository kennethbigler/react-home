import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import localForage from 'localforage';
import forEach from 'lodash/forEach';
import rootReducer from '.';
import initialState from './initialState';

/** funtion to read 'state' value from local storage and return it, or default state
 * @return {Object[]} - last saved application state
 */
export const loadState = async () => localForage
  .getItem('state')
  .then((state) => {
    // set to defaults if no local storage
    if (!state) {
      return initialState;
    }
    // validate that we have all keys
    forEach(initialState, (item, key) => {
      // if local storage is only partial, fill with default state
      if (!state[key]) {
        state[key] = item;
      }
    });
    return state;
  })
  // if there are any issues, just load default state
  .catch(() => initialState);

/** funtion to save 'state' value to local storage
 * @param {Object[]} state - current application state
 */
export const saveState = (state) => localForage
  .setItem('state', state)
  .catch((e) => {
    // ignore the error and skip the save
    console.log(e);
  });

export const configureStore = (state) => createStore(
  rootReducer,
  state,
  composeWithDevTools(applyMiddleware(thunk)),
);
