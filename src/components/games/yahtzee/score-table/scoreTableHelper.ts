import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import { Dice, TopGameScore } from '../types';

interface DiceHistogram {
  0?: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
}

export const getHistogram = () => (hist: DiceHistogram, val: Dice): DiceHistogram => {
  if (!hist[val]) {
    hist[val] = 1;
  } else {
    hist[val] += 1;
  }
  return hist;
};

export const hasXDice = (values: Dice[], n: number): boolean => {
  const hist = reduce(values, getHistogram(), {} as DiceHistogram);
  let hasDice = false;
  forEach(hist, (value: number | undefined) => {
    if (value && value >= n) {
      hasDice = true;
    }
  });
  return hasDice;
};

export const isFullHouse = (values: Dice[]): boolean => {
  const hist = reduce(values, getHistogram(), {} as DiceHistogram);

  let has3 = false;
  let has2 = false;

  forEach(hist, (value: number | undefined) => {
    if (value && value >= 3) {
      has3 = true;
    } else if (value && value >= 2) {
      has2 = true;
    }
  });

  return has3 && has2;
};

export const isStraight = (values: Dice[], length: number): boolean => {
  const hist = reduce(values, getHistogram(), {} as DiceHistogram);

  let count = 0;
  forEach([1, 2, 3, 4, 5, 6], (i: Dice) => {
    if (count < length) {
      const value = hist[i];
      if (!value) {
        count = 0;
      } else {
        count += 1;
      }
    }
  });
  return count >= length;
};

export const canYahtzeeBonus = (values: Dice[], top: TopGameScore[]): boolean => reduce(
  reduce(values, getHistogram(), {} as DiceHistogram),
  (acc: boolean, value, key) => {
    if (value === 5 && top[parseInt(key, 10) - 1].score >= 0) {
      return true;
    }
    return acc;
  },
  false,
);
