import { Action } from 'redux';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const SET_TOKEN = '@resume/graphql/SET_TOKEN';

// --------------------     Action Creators     -------------------- //
interface SetTokenAction extends Action<typeof SET_TOKEN> { gqlToken: string }
export const setToken = (gqlToken = ''): SetTokenAction => ({ type: SET_TOKEN, gqlToken });

// --------------------     Reducers     -------------------- //
type GQLActions = SetTokenAction;
export default function reducer(state: string = initialState.gqlToken, action: GQLActions): string {
  switch (action.type) {
    case SET_TOKEN:
      return action.gqlToken;
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
