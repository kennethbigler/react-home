import { Dispatch, Action } from "redux";
import { DBSlotDisplay } from "../types";
import initialState from "../initialState";
import SlotMachine from "../../apis/SlotMachine";
import { payout, PlayerAction } from "./players";

// --------------------     Actions     -------------------- //
export const UPDATE = "@casino/slots/UPDATE";

// -------------------- Action Creators     -------------------- //
interface UpdateSlotsAction extends Action<typeof UPDATE> {
  reel: DBSlotDisplay[];
}
/** update the slot reel in Slots DB */
export const updateSlots = (reel: DBSlotDisplay[]): UpdateSlotsAction => ({
  type: UPDATE,
  reel,
});

// --------------------     Reducers     -------------------- //
type SlotsActions = UpdateSlotsAction;
export default function reducer(
  state: DBSlotDisplay[] = initialState.slots,
  action: SlotsActions
): DBSlotDisplay[] {
  switch (action.type) {
    case UPDATE:
      return [...action.reel];
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
/** play the slots game, updating the slots reel in Slots DB and player/dealer money in Player DB */
export function updateDBSlotMachine(id: number, dealerId: number, bet: number) {
  return (
    dispatch: Dispatch
  ): Promise<[UpdateSlotsAction, PlayerAction, PlayerAction]> => {
    const reel = SlotMachine.pullHandle();
    const exchange = SlotMachine.getPayout(reel, bet) - bet;

    const promise1 = dispatch(updateSlots(reel));
    const promise2 = dispatch(payout(id, "win", exchange));
    const promise3 = dispatch(payout(dealerId, "win", -exchange));
    return Promise.all([promise1, promise2, promise3]);
  };
}
