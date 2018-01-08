/* --------------------------------------------------
 * Slot Machine
 * -------------------------------------------------- */

export const EMPTY = ' ';
export const CHERRY = 'C';
export const BAR = '—';
export const DOUBLE_BAR = '=';
export const TRIPLE_BAR = 'Ξ';
export const SEVEN = '7';
export const JACKPOT = 'J';

const settings = [
  { symbol: CHERRY, start: 1, stop: 2 },
  { symbol: EMPTY, start: 3, stop: 7 },
  { symbol: BAR, start: 8, stop: 12 },
  { symbol: EMPTY, start: 13, stop: 17 },
  { symbol: SEVEN, start: 18, stop: 25 },
  { symbol: EMPTY, start: 26, stop: 30 },
  { symbol: BAR, start: 31, stop: 35 },
  { symbol: EMPTY, start: 36, stop: 41 },
  { symbol: CHERRY, start: 42, stop: 43 },
  { symbol: EMPTY, start: 44, stop: 49 },
  { symbol: DOUBLE_BAR, start: 50, stop: 56 },
  { symbol: EMPTY, start: 57, stop: 62 },
  { symbol: CHERRY, start: 63, stop: 63 },
  { symbol: EMPTY, start: 64, stop: 69 },
  { symbol: DOUBLE_BAR, start: 70, stop: 75 },
  { symbol: EMPTY, start: 76, stop: 81 },
  { symbol: BAR, start: 82, stop: 87 },
  { symbol: EMPTY, start: 88, stop: 93 },
  { symbol: TRIPLE_BAR, start: 94, stop: 104 },
  { symbol: EMPTY, start: 105, stop: 115 },
  { symbol: JACKPOT, start: 116, stop: 117 },
  { symbol: EMPTY, start: 118, stop: 128 }
];

let machine = [];

settings.forEach(slot => {
  for (let i = slot.start; i <= slot.stop; i += 1) {
    machine.push(slot.symbol);
  }
});

export const SlotMachine = {
  // spin the slot machine and get a result
  spin: () => {
    return machine[Math.floor(Math.random() * machine.length)];
  }
};

// when switching to support multiple games, consider looking into https://facebook.github.io/react/docs/composition-vs-inheritance.html
// you could pass <Board><BlackJack /></Board>
