import { createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import localForage from "localforage";

import { DBRootState } from "./types";
import rootReducer from ".";
import initialState from "./initialState";

/** function to read 'state' value from local storage and return it, or default state */
export const loadState = async (): Promise<DBRootState> =>
  localForage
    .getItem("state")
    .then((state) =>
      state ? { ...initialState, ...(state as DBRootState) } : initialState
    )
    // if there are any issues, just load default state
    .catch(() => initialState);

/** function to save 'state' value to local storage */
export const saveState = (state: DBRootState): Promise<void | DBRootState> =>
  localForage
    .setItem("state", state)
    // eslint-disable-next-line no-console
    .catch((e) => console.error("state to db save failed: ", e));

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

export const configureStore = (state: DBRootState): Store =>
  createStore(rootReducer, state, composeEnhancers(applyMiddleware(thunk)));
