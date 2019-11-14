import { AnyAction } from 'redux';
import { SlotDisplay } from '../../apis/SlotMachine';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const UPDATE = 'casino/slots/UPDATE';

// -------------------- Action Creators     -------------------- //
export const pullHandle = (reel: SlotDisplay[]): AnyAction => ({ type: UPDATE });

// --------------------     Reducers     -------------------- //
export default function reducer(state: number[] = initialState.yahtzee, action: AnyAction): number[] {
  switch (action.type) {
    case UPDATE:
      return [...state, action.score];
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
export function updateSlotMachine(id: number, dealerId: number, bet: number) {
  return (dispatch: Function): Promise<void> => {
    // do something here
    const test = id;
    return new Promise();
  };
}
