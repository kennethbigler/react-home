import forEach from 'lodash/forEach';
import { Dice } from './types';

interface DiceHistogram {
  0?: number;
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
}

export const hasXDice = (n: number) => (hist: any, val: Dice): boolean | DiceHistogram => {
  if (hist === true) {
    return true;
  }
  if (!hist[val]) {
    hist[val] = 1;
  } else {
    hist[val] += 1;
    if (hist[val] >= n) {
      return true;
    }
  }
  return hist;
};

export const getHistogram = () => (hist: any, val: Dice): boolean | DiceHistogram => {
  if (hist === true) {
    return true;
  }
  if (!hist[val]) {
    hist[val] = 1;
  } else {
    hist[val] += 1;
  }
  return hist;
};

export const isFullHouse = (histogram: DiceHistogram): boolean => {
  let has3 = false;
  let has2 = false;

  forEach(histogram, (value: number | undefined) => {
    if (value && value >= 3) {
      has3 = true;
    } else if (value && value >= 2) {
      has2 = true;
    }
  });

  return has3 && has2;
};

export const isStraight = (histogram: DiceHistogram, length: number): boolean => {
  let count = 0;
  forEach(['1', '2', '3', '4', '5', '6'], (i: Dice) => {
    if (count < length) {
      const value = histogram[i];
      if (!value) {
        count = 0;
      } else {
        count += 1;
      }
    }
  });
  return count >= length;
};
