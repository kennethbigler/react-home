import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import forEach from 'lodash/forEach';
import rootReducer from '.';
import initialState from './initialState';

/**
 * funtion to read 'state' value from local storage and return it, or default state
 * @return {Object[]} - last saved application state
 */
const loadState = () => {
  try {
    // get state from local storage
    const serializedState = localStorage.getItem('state');
    // set to defaults if no local storage
    if (!serializedState) {
      return initialState;
    }
    const savedState = JSON.parse(serializedState);
    // validate that we have all keys
    forEach(initialState, (item, key) => {
      // if local storage is only partial, fill with default state
      if (!savedState[key]) {
        savedState[key] = item;
      }
    });
    return savedState;
  } catch (e) {
    // if there are any issues, just load default state
    return initialState;
  }
};

/**
 * funtion to save 'state' value to local storage
 * @param {Object[]} state - current application state
 */
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore the error and skip the save
  }
};

export const configureStore = () => createStore(
  rootReducer,
  loadState(),
  composeWithDevTools(applyMiddleware()),
);
