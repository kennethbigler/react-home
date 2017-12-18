import { createStore } from 'redux';
import rootReducer from './';
// import { applyMiddleware } from 'redux';
//import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    //applyMiddleware(reduxImmutableStateInvariant())
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
