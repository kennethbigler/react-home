enum SlotOptions {
  EMPTY = ' ',
  CHERRY = 'C',
  BAR = '—',
  DOUBLE_BAR = '=',
  TRIPLE_BAR = 'Ξ',
  SEVEN = '7',
  JACKPOT = 'J',
}
export type SlotDisplay = [SlotOptions, SlotOptions, SlotOptions];
interface Reel {
  symbol: SlotOptions;
  start: number;
  stop: number;
}

const NUM_REELS = 3;
// options

const reels: Reel[] = [
  { symbol: SlotOptions.CHERRY, start: 1, stop: 2 },
  { symbol: SlotOptions.EMPTY, start: 3, stop: 7 },
  { symbol: SlotOptions.BAR, start: 8, stop: 12 },
  { symbol: SlotOptions.EMPTY, start: 13, stop: 17 },
  { symbol: SlotOptions.SEVEN, start: 18, stop: 25 },
  { symbol: SlotOptions.EMPTY, start: 26, stop: 30 },
  { symbol: SlotOptions.BAR, start: 31, stop: 35 },
  { symbol: SlotOptions.EMPTY, start: 36, stop: 41 },
  { symbol: SlotOptions.CHERRY, start: 42, stop: 43 },
  { symbol: SlotOptions.EMPTY, start: 44, stop: 49 },
  { symbol: SlotOptions.DOUBLE_BAR, start: 50, stop: 56 },
  { symbol: SlotOptions.EMPTY, start: 57, stop: 62 },
  { symbol: SlotOptions.CHERRY, start: 63, stop: 63 },
  { symbol: SlotOptions.EMPTY, start: 64, stop: 69 },
  { symbol: SlotOptions.DOUBLE_BAR, start: 70, stop: 75 },
  { symbol: SlotOptions.EMPTY, start: 76, stop: 81 },
  { symbol: SlotOptions.BAR, start: 82, stop: 87 },
  { symbol: SlotOptions.EMPTY, start: 88, stop: 93 },
  { symbol: SlotOptions.TRIPLE_BAR, start: 94, stop: 104 },
  { symbol: SlotOptions.EMPTY, start: 105, stop: 115 },
  { symbol: SlotOptions.JACKPOT, start: 116, stop: 117 },
  { symbol: SlotOptions.EMPTY, start: 118, stop: 128 },
];

// prepare the slot machine
function prepareSlotMachine(): SlotDisplay[] {
  const machine: SlotDisplay[] = [];
  reels.forEach((reel: Reel, i: number) => {
    // wrap the reels
    const prev = i - 1 > 0 ? i - 1 : reels.length - 1;
    const next = i + 1 < reels.length ? i + 1 : 0;
    // create the machine
    for (let j = reel.start; j <= reel.stop; j += 1) {
      machine.push([reels[prev].symbol, reel.symbol, reels[next].symbol]);
    }
  });
  return machine;
}

const machine = prepareSlotMachine();

// spin the slot machine and get a result
function spin(): SlotDisplay {
  return machine[Math.floor(Math.random() * machine.length)];
}


// used to display the payout table
export const payoutTable = [
  { symbol: `${SlotOptions.JACKPOT} ${SlotOptions.JACKPOT} ${SlotOptions.JACKPOT}`, payout: 1666 },
  { symbol: `${SlotOptions.SEVEN} ${SlotOptions.SEVEN} ${SlotOptions.SEVEN}`, payout: 300 },
  { symbol: `${SlotOptions.TRIPLE_BAR} ${SlotOptions.TRIPLE_BAR} ${SlotOptions.TRIPLE_BAR}`, payout: 100 },
  { symbol: `${SlotOptions.DOUBLE_BAR} ${SlotOptions.DOUBLE_BAR} ${SlotOptions.DOUBLE_BAR}`, payout: 50 },
  { symbol: `${SlotOptions.BAR} ${SlotOptions.BAR} ${SlotOptions.BAR}`, payout: 25 },
  { symbol: '3 of any bar', payout: 12 },
  { symbol: `${SlotOptions.CHERRY} ${SlotOptions.CHERRY} ${SlotOptions.CHERRY}`, payout: 12 },
  { symbol: `${SlotOptions.CHERRY} ${SlotOptions.CHERRY}`, payout: 6 },
  { symbol: SlotOptions.CHERRY, payout: 3 },
];

export default {
  pullHandle: (): SlotDisplay[] => {
    const reel = [];
    for (let i = 0; i < NUM_REELS; i += 1) {
      reel[i] = spin();
    }
    return reel;
  },

  /** evaluate slot machine based of 3 reels */
  getPayout: (reel: SlotDisplay[], bet: number): number => {
    // for bar check
    const bars = [SlotOptions.BAR, SlotOptions.DOUBLE_BAR, SlotOptions.TRIPLE_BAR];
    // get reel values
    const r0 = reel[0][1];
    const r1 = reel[1][1];
    const r2 = reel[2][1];
    const fReel = [r0, r1, r2];
    // check if they match
    const m01 = r0 === r1;
    const m02 = r0 === r2;
    // if we have 3 of a kind
    if (m01 && m02) {
      switch (r0) {
        case SlotOptions.JACKPOT:
          return 1666 * bet;
        case SlotOptions.SEVEN:
          return 300 * bet;
        case SlotOptions.TRIPLE_BAR:
          return 100 * bet;
        case SlotOptions.DOUBLE_BAR:
          return 50 * bet;
        case SlotOptions.BAR:
          return 25 * bet;
        case SlotOptions.CHERRY:
          return 12 * bet;
        default:
          return 0;
      }
    } else if (bars.includes(r0) && bars.includes(r1) && bars.includes(r2)) {
      // if we have 3 of any bar
      return 12 * bet;
    } else if (fReel.includes(SlotOptions.CHERRY, fReel.indexOf(SlotOptions.CHERRY) + 1)) {
      // if we have 2 cherries
      return 6 * bet;
    } else if (fReel.includes(SlotOptions.CHERRY)) {
      // if we have 1 cherry
      return 3 * bet;
    }
    return 0;
  },
};

// when switching to support multiple games, consider looking into https://facebook.github.io/react/docs/composition-vs-inheritance.html
// you could pass <Board><BlackJack /></Board>
