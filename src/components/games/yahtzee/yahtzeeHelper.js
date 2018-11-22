import forEach from 'lodash/forEach';

export const hasXDice = n => (hist, val) => {
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

export const getHistogram = () => (hist, val) => {
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

export const isFullHouse = (histogram) => {
  let has3 = false;
  let has2 = false;

  forEach(histogram, (value) => {
    if (value >= 3) {
      has3 = true;
    } else if (value >= 2) {
      has2 = true;
    }
  });

  return has3 && has2;
};

export const isStraight = (histogram, length) => {
  let count = 0;
  forEach(['1', '2', '3', '4', '5', '6'], (i) => {
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
