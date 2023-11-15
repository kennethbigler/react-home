import { atom, DefaultValue, selector } from "recoil";
import playerAtom from "./player-atom";

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
  dndOpen: boolean;
  isOver: number;
}
export const briefcasesToOpen = 6;

const getNewState = (): DNDState => ({
  board: [
    { val: 1, loc: 1, on: true },
    { val: 2, loc: 2, on: true },
    { val: 5, loc: 3, on: true },
    { val: 10, loc: 4, on: true },
    { val: 25, loc: 5, on: true },
    { val: 50, loc: 6, on: true },
    { val: 75, loc: 7, on: true },
    { val: 100, loc: 8, on: true },
    { val: 200, loc: 9, on: true },
    { val: 300, loc: 10, on: true },
    { val: 400, loc: 11, on: true },
    { val: 500, loc: 12, on: true },
    { val: 750, loc: 13, on: true },
    { val: 1000, loc: 14, on: true },
    { val: 5000, loc: 15, on: true },
    { val: 10000, loc: 16, on: true },
    { val: 25000, loc: 17, on: true },
    { val: 50000, loc: 18, on: true },
    { val: 75000, loc: 19, on: true },
    { val: 100000, loc: 20, on: true },
    { val: 200000, loc: 21, on: true },
    { val: 300000, loc: 22, on: true },
    { val: 400000, loc: 23, on: true },
    { val: 500000, loc: 24, on: true },
    { val: 750000, loc: 25, on: true },
    { val: 1000000, loc: 26, on: true },
  ],
  turn: 1,
  playerChoice: undefined,
  casesToOpen: briefcasesToOpen,
  dndOpen: false,
  isOver: 0,
});
/** function that takes an array and shuffles it's elements */
const shuffle = (arr: Briefcase[]): void => {
  // shuffle values of briefcases
  for (let i = 0; i < 100; i += 1) {
    // get to random briefcases
    const j = Math.floor(Math.random() * arr.length);
    const k = Math.floor(Math.random() * arr.length);
    // swap the briefcases
    const temp = arr[j].loc;
    arr[j].loc = arr[k].loc;
    arr[k].loc = temp;
  }
};
/** function to get a new game state */
export const newDNDGame = (): DNDState => {
  const state = getNewState();
  // mix up board
  shuffle(state.board);
  // set all flags to un-touched
  state.board.forEach((bc) => {
    // reset opened flag
    bc.on = true;
  });
  // sort function for the briefcases
  state.board.sort((a, b) => a.loc - b.loc);
  return state;
};

export const dealOrNoDealAtom = atom({
  key: "dealOrNoDealAtom",
  default:
    (JSON.parse(
      localStorage.getItem("deal-or-no-deal-atom") || "null",
    ) as DNDState) || newDNDGame(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("deal-or-no-deal-atom", JSON.stringify(state));
      });
    },
  ],
});

export const dndHelperSelector = selector({
  key: "dndHelperSelector",
  get: ({ get }) => {
    // access state
    const { board, turn } = get(dealOrNoDealAtom);
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
    return { numCases, offer };
  },
});

const dealOrNoDealState = selector({
  key: "dealOrNoDealState",
  get: ({ get }) => {
    const dnd = get(dealOrNoDealAtom);
    const { name, money, status } = get(playerAtom)[0];

    return { dnd, name, money, status };
  },
  set: ({ get, set }, state) => {
    if (!(state instanceof DefaultValue)) {
      const { dnd, money, status } = state;
      set(dealOrNoDealAtom, dnd);

      const players = get(playerAtom);
      const newPlayers = [...players];
      newPlayers[0] = { ...players[0], money, status };
      set(playerAtom, newPlayers);
    }
  },
});

export default dealOrNoDealState;
