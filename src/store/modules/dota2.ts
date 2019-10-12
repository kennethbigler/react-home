import { AnyAction } from 'redux';
import { insertItem, updateArrayInArray, removeItemInArray } from '../immutableHelpers';
import { DBDota2Phase } from '../types';
import initialState, { newDota2Lineup } from '../initialState';

// --------------------     Actions     -------------------- //
const ADD = 'casino/dota2/ADD_LINEUP';
const REMOVE = 'casino/dota2/REMOVE_LINEUP';
const UPDATE_LINEUP = 'casino/dota2/UPDATE_LINEUP';
const RESET_LINEUP = 'casino/dota2/RESET_LINEUP';

// -------------------- Action Creators     -------------------- //
export function addLineup(): AnyAction {
  return { type: ADD, lineup: newDota2Lineup() };
}
export function removeLineup(idx: number): AnyAction {
  return { type: REMOVE, idx };
}
export function updateLineup(order: DBDota2Phase[], idx: number): AnyAction {
  return { type: UPDATE_LINEUP, order, idx };
}
export function resetLineup(idx: number): AnyAction {
  return { type: RESET_LINEUP, order: newDota2Lineup(), idx };
}

// --------------------     Reducer     -------------------- //
export default function reducer(state: DBDota2Phase[][] = initialState.dota2, action: AnyAction): DBDota2Phase[][] {
  switch (action.type) {
    case ADD:
      return insertItem(state, action.lineup);
    case REMOVE:
      return removeItemInArray(state, action.idx);
    case UPDATE_LINEUP:
    case RESET_LINEUP:
      return updateArrayInArray(state, action.order, action.idx);
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
