import { atom, DefaultValue, selector } from "recoil";
import turnAtom from "./turn-atom";
import playerAtom from "./player-atom";
import { DBCard } from "../apis/Deck";

export enum RegicideGameFunctions {
  NEW_GAME = "New Game",
  START = "Start",
  YIELD = "Yield",
  FIGHT = "Fight",
  DISCARD = "Discard",
  REDRAW = "Redraw",
}
export interface RegicideState {
  gameFunctions: RegicideGameFunctions[];
  castleDeck: DBCard[];
  tavernDeck: DBCard[];
  discardDeck: DBCard[];
  currentMonster?: DBCard;
  hideHands: boolean;
  gameOver: boolean;
  currentHealth: number;
  soloPlayRedraws: number;
  playerCount: number;
}

/** function to generate the state of a new game */
export const newRegicideGameState = (): Partial<RegicideState> => ({
  gameFunctions: [RegicideGameFunctions.START],
  castleDeck: [],
  tavernDeck: [],
  discardDeck: [],
  currentHealth: 0,
  soloPlayRedraws: 2,
  hideHands: true,
  gameOver: false,
});

export const regicideAtom = atom({
  key: "regicideAtom",
  default: (JSON.parse(
    localStorage.getItem("regicide-atom") || "null"
  ) as RegicideState) || { ...newRegicideGameState(), playerCount: 1 },
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("regicide-atom", JSON.stringify(state));
      });
    },
  ],
});

const regicideState = selector({
  key: "regicideState",
  get: ({ get }) => {
    const regicide = get(regicideAtom);
    const turn = get(turnAtom);
    const players = get(playerAtom).slice(0, regicide.playerCount);

    return { regicide, turn, players };
  },
  set: ({ get, set }, state) => {
    if (!(state instanceof DefaultValue)) {
      const { regicide, turn, players } = state;
      const dataPlayers = get(playerAtom);
      set(regicideAtom, regicide);
      set(turnAtom, turn);
      set(playerAtom, [
        ...players,
        ...dataPlayers.slice(regicide.playerCount, dataPlayers.length),
      ]);
    }
  },
});

export default regicideState;
