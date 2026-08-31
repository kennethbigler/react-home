import { atom } from "jotai";
import persistentAtom from "./storage";
import shuffleArray from "../apis/shuffleArray";
import playerAtom, { patchPlayerAtom } from "./player-atom";

export interface Briefcase {
  on: boolean;
  loc: number;
  val: number;
}
export interface DNDState {
  board: Briefcase[];
  turn: number;
  playerChoice?: Briefcase;
  casesToOpen: number;
  isOver: number;
}
export const briefcasesToOpen = 6;

const BRIEFCASE_VALUES = [
  1, 2, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750, 1000, 5000, 10000,
  25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000,
];

/** function to get a new game state with values randomly assigned to cases */
export const newDNDGame = (): DNDState => ({
  board: shuffleArray(BRIEFCASE_VALUES).map((val, i) => ({
    val,
    loc: i + 1,
    on: true,
  })),
  turn: 1,
  playerChoice: undefined,
  casesToOpen: briefcasesToOpen,
  isOver: 0,
});

const dealOrNoDealAtom = persistentAtom("dealOrNoDealAtom", newDNDGame());

/** Whether the banker-offer dialog is showing; deliberately not persisted. */
export const dndOpenAtom = atom(false);
dndOpenAtom.debugLabel = "dndOpenAtom";

export const dealOrNoDealRead = atom((get) => {
  // access state
  const { board, turn } = get(dealOrNoDealAtom);
  const { name } = get(playerAtom)[0];
  // compute iterated variables
  let numCases = 0;
  let sum = 0;
  board.forEach((bc) => {
    if (bc.on) {
      numCases += 1;
      sum += bc.val;
    }
  });
  // get the new offer
  const offer = Math.round((sum / numCases) * (turn / 10));
  // return state
  return { numCases, offer, name };
});
dealOrNoDealRead.debugLabel = "dealOrNoDealRead";

interface DNDGameState {
  dnd: DNDState;
  money?: number;
  status?: string;
}

const dealOrNoDealState = atom(
  (get) => {
    const dnd = get(dealOrNoDealAtom);
    const { money, status } = get(playerAtom)[0];

    return { dnd, money, status };
  },
  (_get, set, { dnd, money, status }: DNDGameState) => {
    set(dealOrNoDealAtom, dnd);

    if (money !== undefined && status !== undefined) {
      set(patchPlayerAtom, 0, { money, status });
    }
  },
);
dealOrNoDealState.debugLabel = "dealOrNoDealState";

export default dealOrNoDealState;
