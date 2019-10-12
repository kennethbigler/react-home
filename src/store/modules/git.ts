import assign from 'lodash/assign';
import { AnyAction } from 'redux';
import { DBGit } from '../types';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const SET_KEY = 'resume/git/SET_KEY';
const SET_BRANCH_MESSAGE = 'resume/git/SET_BRANCH_MESSAGE';
const SET_BRANCH_PREFIX = 'resume/git/SET_BRANCH_PREFIX';
const SET_CASE_PREFERENCE = 'resume/git/SET_CASE_PREFERENCE';
const SET_COMMIT_PREFIX = 'resume/git/SET_COMMIT_PREFIX';

// --------------------     Action Creators     -------------------- //
export function setKey(storyID = ''): AnyAction {
  return { type: SET_KEY, storyID };
}
export function setBranchMessage(branchMessage = ''): AnyAction {
  return { type: SET_BRANCH_MESSAGE, branchMessage };
}
export function setBranchPrefix(branchPrefix = ''): AnyAction {
  return { type: SET_BRANCH_PREFIX, branchPrefix };
}
export function setCasePreference(casePreference = ''): AnyAction {
  return { type: SET_CASE_PREFERENCE, casePreference };
}
export function setCommitPrefix(isSet = true): AnyAction {
  return { type: SET_COMMIT_PREFIX, commitPrefix: isSet };
}

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBGit = initialState.git, action: AnyAction): DBGit {
  switch (action.type) {
    case SET_KEY:
      return assign({}, state, { storyID: action.storyID });
    case SET_BRANCH_PREFIX:
      return assign({}, state, { branchPrefix: action.branchPrefix });
    case SET_BRANCH_MESSAGE:
      return assign({}, state, { branchMessage: action.branchMessage });
    case SET_CASE_PREFERENCE:
      return assign({}, state, {
        casePreference: action.casePreference,
      });
    case SET_COMMIT_PREFIX:
      return assign({}, state, { commitPrefix: action.commitPrefix });
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
