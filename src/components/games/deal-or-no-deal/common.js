import split from 'lodash/split';
/**
 * function that takes a number and returns string displayed like money
 * @param {number} n
 * @return {string} - $xxx,xxx,...
 */
export const getMoneyText = (n) => {
  let txt = split(n.toString(), '');
  const e = txt[0] === '-' ? 1 : 0;
  for (let i = txt.length - 3; i > e; i -= 3) {
    txt.splice(i, 0, ',');
  }
  txt.splice(e, 0, '$');
  return txt.join('');
};

/**
 * function that takes an array and shuffles it's elements
 * @param {array} arr
 */
export const shuffle = (arr) => {
  // shuffle values of briefcases
  for (let i = 0; i < 100; i += 1) {
    // get to random briefcases
    const j = Math.floor(Math.random() * arr.length);
    const k = Math.floor(Math.random() * arr.length);
    // swap the briefcases
    let temp = arr[j].loc;
    arr[j].loc = arr[k].loc;
    arr[k].loc = temp;
  }
};
