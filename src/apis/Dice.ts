export default {
  // randomize order of the cards
  roll() {
    return Math.floor(Math.random() * 6) + 1;
  },
};

// Dice as a react hook, seems kind of like an anti-pattern
export function useDice() {
  function rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  return rollDice;
}
