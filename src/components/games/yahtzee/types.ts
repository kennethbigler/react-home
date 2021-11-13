export const ADD_DICE = "Sum of Dice";
type AddDice = "Sum of Dice";

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
