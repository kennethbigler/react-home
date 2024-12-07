import { atomWithStorage } from "jotai/utils";

export interface TurnState {
  player: number;
  hand: number;
}

const initialState: TurnState = { player: 0, hand: 0 };

const turnAtom = atomWithStorage("turnAtom", initialState);

export default turnAtom;
