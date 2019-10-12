import { AnyAction } from 'redux';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const SET_TOKEN = 'resume/graphql/SET_TOKEN';

// --------------------     Action Creators     -------------------- //
export const setToken = (gqlToken = ''): AnyAction => ({ type: SET_TOKEN, gqlToken });

// --------------------     Reducers     -------------------- //
export default function reducer(state: string = initialState.gqlToken, action: AnyAction): string {
  switch (action.type) {
    case SET_TOKEN:
      return action.gqlToken;
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
