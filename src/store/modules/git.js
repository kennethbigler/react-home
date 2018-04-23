// initialState
import initialState from '../initialState';

// Actions
const SET_KEY = 'resume/git/SET_KEY';
const SET_BRANCH_PREFIX = 'resume/git/SET_BRANCH_PREFIX';
const SET_CASE_PREFERENCE = 'resume/git/SET_CASE_PREFERENCE';

// Action Creators
export function setKey(storyID = '') {
  return { type: SET_KEY, storyID: storyID };
}
export function setBranchPrefix(branchPrefix = '') {
  return { type: SET_BRANCH_PREFIX, branchPrefix: branchPrefix };
}
export function setCasePreference(casePreference = '') {
  return { type: SET_CASE_PREFERENCE, casePreference: casePreference };
}

// Reducer
export default function reducer(state = initialState.git, action) {
  switch (action.type) {
    case SET_KEY:
      return Object.assign({}, state, { storyID: action.storyID });
    case SET_BRANCH_PREFIX:
      return Object.assign({}, state, { branchPrefix: action.branchPrefix });
    case SET_CASE_PREFERENCE:
      return Object.assign({}, state, {
        casePreference: action.casePreference
      });
    default:
      return state;
  }
}
