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
export const NUMREELS = 3;

const reels = [
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

reels.forEach((slot, i) => {
  // wrap the reels
  const prev = i - 1 > 0 ? i - 1 : reels.length - 1;
  const next = i + 1 < reels.length ? i + 1 : 0;
  // create the machine
  for (let j = slot.start; j <= slot.stop; j += 1) {
    machine.push([reels[prev].symbol, slot.symbol, reels[next].symbol]);
  }
});

// spin the slot machine and get a result
function spin() {
  return machine[Math.floor(Math.random() * machine.length)];
}

export const SlotMachine = {
  // used to display the payout table
  payoutTable: [
    {
      win: '3x',
      symbol: JACKPOT,
      payout: 1666
    },
    {
      win: `${SEVEN} ${SEVEN}`,
      symbol: SEVEN,
      payout: 300
    },
    {
      win: `${TRIPLE_BAR} ${TRIPLE_BAR}`,
      symbol: TRIPLE_BAR,
      payout: 100
    },
    {
      win: `${DOUBLE_BAR} ${DOUBLE_BAR}`,
      symbol: DOUBLE_BAR,
      payout: 50
    },
    {
      win: `${BAR} ${BAR}`,
      symbol: BAR,
      payout: 25
    },
    {
      win: '3 of any',
      symbol: 'bar',
      payout: 12
    },
    {
      win: '3x',
      symbol: CHERRY,
      payout: 12
    },
    {
      win: '2x',
      symbol: CHERRY,
      payout: 6
    },
    {
      win: '1x',
      symbol: CHERRY,
      payout: 3
    }
  ],
  pullHandle: () => {
    let reel = [];
    for (let i = 0; i < NUMREELS; i += 1) {
      reel[i] = spin();
    }
    return reel;
  },
  // evaluate slot machine based of 3 reels
  getPayout: (reel, bet) => {
    // for bar check
    const bars = [BAR, DOUBLE_BAR, TRIPLE_BAR];
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
        case JACKPOT:
          return 1666 * bet;
        case SEVEN:
          return 300 * bet;
        case TRIPLE_BAR:
          return 100 * bet;
        case DOUBLE_BAR:
          return 50 * bet;
        case BAR:
          return 25 * bet;
        case CHERRY:
          return 12 * bet;
        default:
          return 0;
      }
    } else if (
      bars.indexOf(r0) !== -1 &&
      bars.indexOf(r1) !== -1 &&
      bars.indexOf(r2) !== -1
    ) {
      // if we have 3 of any bar
      return 12 * bet;
    } else if (fReel.indexOf(CHERRY, fReel.indexOf(CHERRY) + 1) !== -1) {
      // if we have 2 cherries
      return 6 * bet;
    } else if (fReel.indexOf(CHERRY) !== -1) {
      // if we have 1 cherry
      return 3 * bet;
    }
    return 0;
  }
};

// when switching to support multiple games, consider looking into https://facebook.github.io/react/docs/composition-vs-inheritance.html
// you could pass <Board><BlackJack /></Board>
