import { atomWithStorage } from "jotai/utils";

export const PIECE = 0;
export const STREAK = 1;
export const MAX = 2;

export enum C4Turn {
  EMPTY = 0,
  RED = 1,
  BLACK = 2,
}
export interface Connect4State {
  board: number[][];
  winner?: number;
  turn: C4Turn;
}

const NEW_BOARD = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

export const immutableBoardCopy = (acc: number[][], row: number[]) => {
  acc.push([...row]);
  return acc;
};

export const newConnect4Game = (): Connect4State => ({
  board: NEW_BOARD.reduce(immutableBoardCopy, []),
  winner: undefined,
  turn: C4Turn.RED,
});

const connect4Atom = atomWithStorage("connect4Atom", newConnect4Game());

export default connect4Atom;
