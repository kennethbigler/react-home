import { Action } from 'redux';
import { DBGit } from '../types';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const SET_KEY = '@resume/git/SET_KEY';
const SET_BRANCH_MESSAGE = '@resume/git/SET_BRANCH_MESSAGE';
const SET_BRANCH_PREFIX = '@resume/git/SET_BRANCH_PREFIX';
const SET_CASE_PREFERENCE = '@resume/git/SET_CASE_PREFERENCE';
const SET_COMMIT_PREFIX = '@resume/git/SET_COMMIT_PREFIX';

// --------------------     Action Creators     -------------------- //
interface SetKeyAction extends Action<typeof SET_KEY> { storyID: string }
/** update the story id in Git DB */
export function setKey(storyID = ''): SetKeyAction {
  return { type: SET_KEY, storyID };
}

interface SetBranchMessageAction extends Action<typeof SET_BRANCH_MESSAGE> { branchMessage: string }
/** update the branch message in Git DB */
export function setBranchMessage(branchMessage = ''): SetBranchMessageAction {
  return { type: SET_BRANCH_MESSAGE, branchMessage };
}

interface SetBranchPrefixAction extends Action<typeof SET_BRANCH_PREFIX> { branchPrefix: string }
/** update the branch prefix in Git DB */
export function setBranchPrefix(branchPrefix = ''): SetBranchPrefixAction {
  return { type: SET_BRANCH_PREFIX, branchPrefix };
}

interface SetCasePreferenceAction extends Action<typeof SET_CASE_PREFERENCE> { casePreference: string }
/** update the casing of the branch in Git DB */
export function setCasePreference(casePreference = ''): SetCasePreferenceAction {
  return { type: SET_CASE_PREFERENCE, casePreference };
}

interface SetCommitPrefixAction extends Action<typeof SET_COMMIT_PREFIX> { commitPrefix: boolean }
/** update commit text in Git DB */
export function setCommitPrefix(isSet = true): SetCommitPrefixAction {
  return { type: SET_COMMIT_PREFIX, commitPrefix: isSet };
}

// --------------------     Reducers     -------------------- //
type GitActions = SetKeyAction | SetBranchMessageAction | SetBranchPrefixAction | SetCasePreferenceAction | SetCommitPrefixAction;
export default function reducer(state: DBGit = initialState.git, action: GitActions): DBGit {
  switch (action.type) {
    case SET_KEY:
      return { ...state, ...{ storyID: action.storyID }};
    case SET_BRANCH_PREFIX:
      return { ...state, ...{ branchPrefix: action.branchPrefix }};
    case SET_BRANCH_MESSAGE:
      return { ...state, ...{ branchMessage: action.branchMessage }};
    case SET_CASE_PREFERENCE:
      return { ...state, ...{ casePreference: action.casePreference }};
    case SET_COMMIT_PREFIX:
      return { ...state, ...{ commitPrefix: action.commitPrefix }};
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
