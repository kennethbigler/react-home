import { AnyAction, Dispatch } from 'redux';
import { DBSlotDisplay } from '../types';
import initialState from '../initialState';
import SlotMachine from '../../apis/SlotMachine';
import { payout } from './players';

// --------------------     Actions     -------------------- //
const UPDATE = 'casino/slots/UPDATE';

// -------------------- Action Creators     -------------------- //
export const updateSlots = (reel: DBSlotDisplay[]): AnyAction => ({ type: UPDATE, reel });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBSlotDisplay[] = initialState.slots, action: AnyAction): DBSlotDisplay[] {
  switch (action.type) {
    case UPDATE:
      return [...action.reel];
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
export function updateDBSlotMachine(id: number, dealerId: number, bet: number) {
  return (dispatch: Function): Promise<[Dispatch, Dispatch, Dispatch]> => {
    const reel = SlotMachine.pullHandle();
    const exchange = SlotMachine.getPayout(reel, bet) - bet;

    const promise1 = dispatch(payout(id, 'win', exchange));
    const promise2 = dispatch(payout(dealerId, 'win', -exchange));
    const promise3 = dispatch(updateSlots(reel));
    return Promise.all([promise1, promise2, promise3]);
  };
}
