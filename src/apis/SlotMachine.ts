import { DBSlotDisplay, DBSlotOptions as SO } from "../store/modules/types";

interface Reel {
  symbol: SO;
  start: number;
  stop: number;
}

const NUM_REELS = 3;

/** options to be displayed on slot machine */
const reels: Reel[] = [
  { symbol: SO.CHERRY, start: 1, stop: 2 },
  { symbol: SO.EMPTY, start: 3, stop: 7 },
  { symbol: SO.BAR, start: 8, stop: 12 },
  { symbol: SO.EMPTY, start: 13, stop: 17 },
  { symbol: SO.SEVEN, start: 18, stop: 25 },
  { symbol: SO.EMPTY, start: 26, stop: 30 },
  { symbol: SO.BAR, start: 31, stop: 35 },
  { symbol: SO.EMPTY, start: 36, stop: 41 },
  { symbol: SO.CHERRY, start: 42, stop: 43 },
  { symbol: SO.EMPTY, start: 44, stop: 49 },
  { symbol: SO.DOUBLE_BAR, start: 50, stop: 56 },
  { symbol: SO.EMPTY, start: 57, stop: 62 },
  { symbol: SO.CHERRY, start: 63, stop: 63 },
  { symbol: SO.EMPTY, start: 64, stop: 69 },
  { symbol: SO.DOUBLE_BAR, start: 70, stop: 75 },
  { symbol: SO.EMPTY, start: 76, stop: 81 },
  { symbol: SO.BAR, start: 82, stop: 87 },
  { symbol: SO.EMPTY, start: 88, stop: 93 },
  { symbol: SO.TRIPLE_BAR, start: 94, stop: 104 },
  { symbol: SO.EMPTY, start: 105, stop: 115 },
  { symbol: SO.JACKPOT, start: 116, stop: 117 },
  { symbol: SO.EMPTY, start: 118, stop: 128 },
];

/** prepare the slot machine */
function prepareSlotMachine(): DBSlotDisplay[] {
  const machine: DBSlotDisplay[] = [];
  reels.forEach((reel: Reel, i: number) => {
    // wrap the reels
    const prev = i - 1 > 0 ? i - 1 : reels.length - 1;
    const next = (i + 1) % reels.length;
    // create the machine
    for (let j = reel.start; j <= reel.stop; j += 1) {
      machine.push([reels[prev].symbol, reel.symbol, reels[next].symbol]);
    }
  });
  return machine;
}

const machine = prepareSlotMachine();

/** spin the slot machine and get a result */
export function spin(): DBSlotDisplay {
  return machine[Math.floor(Math.random() * machine.length)];
}

/** Pull the slot machine handle, returns info needed for display */
const pullHandle = (): DBSlotDisplay[] => {
  const reel = [];
  for (let i = 0; i < NUM_REELS; i += 1) {
    reel[i] = spin();
  }
  return reel;
};

/** evaluate slot machine based of 3 reels */
const getPayout = (reel: DBSlotDisplay[], bet: number): number => {
  // for bar check
  const bars = [SO.BAR, SO.DOUBLE_BAR, SO.TRIPLE_BAR];
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
      case SO.JACKPOT:
        return 1666 * bet;
      case SO.SEVEN:
        return 300 * bet;
      case SO.TRIPLE_BAR:
        return 100 * bet;
      case SO.DOUBLE_BAR:
        return 50 * bet;
      case SO.BAR:
        return 25 * bet;
      case SO.CHERRY:
        return 12 * bet;
      default:
        return 0;
    }
  } else if (bars.includes(r0) && bars.includes(r1) && bars.includes(r2)) {
    // if we have 3 of any bar
    return 12 * bet;
  } else if (fReel.includes(SO.CHERRY, fReel.indexOf(SO.CHERRY) + 1)) {
    // if we have 2 cherries
    return 6 * bet;
  } else if (fReel.includes(SO.CHERRY)) {
    // if we have 1 cherry
    return 3 * bet;
  }
  return 0;
};

export default {
  pullHandle,
  getPayout,
};
