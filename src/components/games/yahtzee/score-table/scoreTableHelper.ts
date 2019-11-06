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
  const hist = values.reduce(getHistogram(), {} as DiceHistogram);
  let hasDice = false;
  Object.keys(hist).forEach((value: string) => {
    if (parseInt(value, 10) >= n) {
      hasDice = true;
    }
  });
  return hasDice;
};

export const isFullHouse = (values: Dice[]): boolean => {
  const hist = values.reduce(getHistogram(), {} as DiceHistogram);

  let has3 = false;
  let has2 = false;

  Object.keys(hist).forEach((value: string) => {
    if (parseInt(value, 10) >= 3) {
      has3 = true;
    } else if (parseInt(value, 10) >= 2) {
      has2 = true;
    }
  });

  return has3 && has2;
};

export const isStraight = (values: Dice[], length: number): boolean => {
  const hist = values.reduce(getHistogram(), {} as DiceHistogram);

  let count = 0;
  const dice: Dice[] = [1, 2, 3, 4, 5, 6];
  dice.forEach((i: Dice) => {
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
  values.reduce(getHistogram(), {} as DiceHistogram),
  (acc: boolean, value, key) => {
    if (value === 5 && top[parseInt(key, 10) - 1].score >= 0) {
      return true;
    }
    return acc;
  },
  false,
);
