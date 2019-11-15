import { Dice } from '../store/types';

export default {
  // randomize order of the cards
  roll(): Dice {
    return Math.floor(Math.random() * 6) + 1 as Dice;
  },
};

// Dice as a react hook, seems kind of like an anti-pattern
export function useDice(): () => number {
  function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  return rollDice;
}
