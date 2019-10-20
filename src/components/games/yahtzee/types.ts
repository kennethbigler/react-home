export const ADD_DICE = 'Sum of Dice';
type AddDice = 'Sum of Dice';

export type Dice = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Scores = number[];
export interface TopGameScore {
  name: string;
  score: number;
}
export interface BottomGameScore {
  name: string;
  score: number;
  hint: string;
  points: number | AddDice;
}

export default ADD_DICE;
