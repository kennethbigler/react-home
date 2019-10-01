// functions
import assign from 'lodash/assign';
// initialState
import initialState from '../initialState';

// --------------------     Actions     -------------------- //

const SET_TOKEN = 'resume/graphql/SET_TOKEN';

// --------------------     Action Creators     -------------------- //

export function setToken(token = '') {
  return { type: SET_TOKEN, token };
}

// --------------------     Reducers     -------------------- //

export default function reducer(state = initialState.graphql, action) {
  switch (action.type) {
    case SET_TOKEN:
      return assign({}, state, { token: action.token });
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
