import persistentAtom from "./storage";

export interface TurnState {
  player: number;
  hand: number;
}

const initialState: TurnState = { player: 0, hand: 0 };

const turnAtom = persistentAtom("turnAtom", initialState);

export default turnAtom;
