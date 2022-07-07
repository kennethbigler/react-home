import { Dice } from "../recoil/yahtzee-state";

export const diceRoller = (): Dice =>
  (Math.floor(Math.random() * 6) + 1) as Dice;

export default {
  // randomize order of the cards
  roll(): Dice {
    return diceRoller();
  },
};

// Dice as a react hook, seems kind of like an anti-pattern
export function useDice(): () => number {
  function rollDice(): number {
    return diceRoller();
  }

  return rollDice;
}
