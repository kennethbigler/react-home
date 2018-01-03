import { createStore } from 'redux';
import rootReducer from './';
import initialState from './initialState';

/**
 * funtion to read 'state' value from local storage and return it, or default state
 * @return {Object[]} - last saved application state
 */
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (!serializedState) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (e) {
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

export const configureStore = () => {
  return createStore(rootReducer, loadState());
};
