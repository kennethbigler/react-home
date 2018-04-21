// initialState
import initialState from '../initialState';

// Actions
const SET_GIT_KEY = 'resume/git/SET_GIT_KEY';

// Action Creators
export function setGitToolsKey(storyID = '') {
  return { type: SET_GIT_KEY, storyID: storyID };
}

// Reducer
export default function reducer(state = initialState.git, action) {
  switch (action.type) {
    case SET_GIT_KEY:
      return Object.assign({}, state, { storyID: action.storyID });
    default:
      return state;
  }
}
