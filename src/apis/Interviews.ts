// ----------     Facebook     ---------- //
/** Task Execution Time with Cooldowns
 * given an array of tasks (each number represents a different task)
 * only 1 task can execute at a time,
 * with a cool down in between the same tasks of the same number
 * different tasks don't have to wait for the cooldown
 * find how long execution of the tasks would take
 *
 * EX:
 * nums: [1, 1, 2, 0, 2, 1]
 * cooldown: 2
 * Output: 9
 * Explanation: 1 _ _ 1 2 0 _ 2 1
 */
function doTasks(tasks: number[], cooldown: number): number {
  const lastRunMap: { [name: number]: number } = {};
  let ans = 0;
  // let debug = '';
  let currentTime = 0;
  tasks.forEach((task) => {
    const lastRun = lastRunMap[task] || 0;
    const waitTime = lastRun + cooldown + 1 - currentTime;
    if (waitTime && lastRunMap[task] !== undefined) {
      ans += waitTime;
      for (let x = 0; x < waitTime; x += 1) {
        // debug += ' -';
      }
      currentTime += waitTime;
    }
    ans += 1;
    // debug += ` ${task}`;
    lastRunMap[task] = currentTime;
    currentTime += 1;
  });
  // console.log(debug);
  return ans;
}

doTasks([1, 1, 2, 0, 2, 1], 4);
doTasks([1, 1, 2, 0, 2, 1], 4);
doTasks([1, 1, 3, 2, 1, 2, 1], 3);

// ----------     Google     ---------- //

// HINT1: consider the numbers that flip to stay the same: 0, 1, 8
// HINT2: consider the numbers that flip to become another number: 6, 9

/** Is the input an Ambigram
 * Given an array of numbers, determine if it is an Ambigram
 * Ambigram - The same word forwards, backwards, and upsidown
 * EX: 34 => false
 * EX: 1881 => true
 * EX: 13431 => false
 */
function isAmbigram1(nums: number[]): boolean {
  // create map
  const flip: { [name: number]: number } = {
    0: 0,
    1: 1,
    6: 9,
    9: 6,
    8: 8,
  };
  // verify characters are good
  for (let i = 0; i < Math.ceil(nums.length / 2); i += 1) {
    // failed check
    if (!flip[nums[i]] || flip[nums[i]] !== nums[nums.length - 1 - i]) {
      return false;
    }
  }
  // everything passes check
  return true;
}

isAmbigram1([1, 8, 1]);
isAmbigram1([1, 8, 8, 1]);
isAmbigram1([1, 6, 9, 1]);
isAmbigram1([1, 6, 1]);

// ----------     Code Golf     ---------- //
/** Is the input an Ambigram II
 * Given a string, determine if it is an Ambigram
 * Ambigram - The same word forwards, backwards, and upsidown
 * EX: 1881, SwIMs
 *
 * Table (goes both ways)
 * 0  0      b  q        o  o/O      H  H
 * 1  1      d  p/P      O  o/O      I  I
 * 2  5      h  y/Y      s  s/S      M  W
 * 6  9      l  l        t  t        N  N
 * 8  8      m  w        x  x/X
 * a  e      n  u/U      z  z/Z
 */
function isAmbigram2(word: string): boolean {
  // create map
  const flip: { [name: string]: string[] } = {
    0: ['0'],
    1: ['1'],
    2: ['5'],
    5: ['2'],
    6: ['9'],
    9: ['6'],
    8: ['8'],
    a: ['e'],
    e: ['a'],
    b: ['q'],
    q: ['b'],
    d: ['p', 'P'],
    p: ['d'],
    P: ['d'],
    h: ['y', 'Y'],
    y: ['h'],
    Y: ['h'],
    l: ['l'],
    m: ['w'],
    w: ['m'],
    n: ['u', 'U'],
    u: ['n'],
    U: ['n'],
    o: ['o', 'O'],
    O: ['o', 'O'],
    s: ['s', 'S'],
    S: ['s', 'S'],
    t: ['t'],
    x: ['x', 'X'],
    X: ['x', 'X'],
    z: ['z', 'Z'],
    Z: ['z', 'Z'],
    H: ['H'],
    I: ['I'],
    M: ['W'],
    W: ['M'],
    N: ['N'],
  };

  const chars = word.split('');
  // verify characters are good
  for (let i = 0; i < Math.ceil(chars.length / 2); i += 1) {
    // get 2 opposite elements
    const arr = flip[chars[i]];
    // check if failed check
    if (!arr) return false;
    // check for match, store in flag
    const b = chars[chars.length - 1 - i];
    let isMatch = false;
    for (let j = 0; j < arr.length; j += 1) {
      if (arr[j] === b) {
        isMatch = true;
        break;
      }
    }
    // failed check
    if (!isMatch) return false;
  }
  // everything passes check
  return true;
}

isAmbigram2('181');
isAmbigram2('1691');
isAmbigram2('161');

// ----------     GigNow     ---------- //
/**
 * Find the intersection of two sorted arrays.
 * OR in other words,
 * Given 2 sorted arrays, find all the elements which occur in both the arrays.
 *
 * Example 1:
 * Input A: [1,2,3,3,4,5,6]
 * Input B: [3,3,5]
 * Output: [3,3,5]
 *
 * Example 2:
 * Input A: [1,2,3,3,4,5,6]
 * Input B: [3,5,7]
 * Output: [3,5]
 */
const intersect = (A: number[], B: number[]): number[] => {
  let i = 0;
  let j = 0;
  const ret = [];

  while (i < A.length && j < B.length) {
    // console.log(i, j);
    if (A[i] === B[j]) {
      ret.push(A[i]);
      i += 1;
      j += 1;
    } else if (A[i] < B[j]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return ret;
};

intersect([1, 2, 3, 3, 4, 5, 6], [3, 3, 5]) === [3, 3, 5];
intersect([1, 2, 3, 3, 4, 5, 6], [3, 5, 7]) === [3, 5];

/**
 * Say you have an array for which the ith element is the price of a given stock on day i.
 *
 * If you were only permitted to complete at most one transaction
 * (i.e., buy one and sell one share of the stock),
 * design an algorithm to find the maximum profit.
 *
 * Note that you cannot sell a stock before you buy one.
 *
 * Example 1:
 * Input: [7,1,5,3,6,4]
 * Output: 5
 * Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
 *              Not 7-1 = 6, as selling price needs to be larger than buying price.
 *
 * Example 2:
 * Input: [7,6,4,3,1]
 * Output: 0
 * Explanation: In this case, no transaction is done, i.e. max profit = 0.
 */
const maxProfit = (prices: number[]): number => {
  if (prices.length === 0) {
    return 0;
  }
  let maxWindow = 0;
  let min = prices[0];
  for (let i = 0; i < prices.length; i += 1) {
    if (prices[i] < min) {
      // if a new low comes along, it may be better
      min = prices[i];
    } else if (prices[i] - min > maxWindow) {
      // only replace max if we find a better one
      maxWindow = prices[i] - min;
    }
  }
  return maxWindow;
};

maxProfit([7, 1, 5, 3, 6, 4]) === 5;
maxProfit([7, 6, 4, 3, 1]) === 0;
maxProfit([7, 2, 8, 1, 5, 3, 6, 4]) === 6;

/**
 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
 * Symbol       Value
 *   I           1
 *   V           5
 *   X           10
 *   L           50
 *   C           100
 *   D           500
 *   M           1000
 *
 * For example, two is written as II in Roman numeral, just two one's added together.
 * Twelve is written as, XII, which is simply X + II.
 * The number twenty seven is written as XXVII, which is XX + V + II.
 *
 * Roman numerals are usually written largest to smallest from left to right.
 * However, the numeral for four is not IIII. Instead, the number four is written as IV.
 * Because the one is before the five we subtract it making four.
 * The same principle applies to the number nine, which is written as IX.
 * There are six instances where subtraction is used:
 *     I can be placed before V (5) and X (10) to make 4 and 9.
 *     X can be placed before L (50) and C (100) to make 40 and 90.
 *     C can be placed before D (500) and M (1000) to make 400 and 900.
 *
 * Given an integer, convert it to a roman numeral.
 * Input is guaranteed to be within the range from 1 to 3999.
 *
 * Example 1:
 * Input: 3
 * Output: "III"
 *
 * Example 2:
 * Input: 4
 * Output: "IV"
 *
 * Example 3:
 * Input: 9
 * Output: "IX"
 *
 * Example 4:
 * Input: 58
 * Output: "LVIII"
 * Explanation: C = 100, L = 50, XXX = 30 and III = 3.
 *
 * Example 5:
 * Input: 1994
 * Output: "MCMXCIV"
 * Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
 */
const itr = (num: number, roman = '', round = 0): string => {
  const divisor = [1000, 100, 10, 1];
  // end condition
  if (round >= divisor.length) {
    return roman;
  }

  const temp = Math.floor(num / divisor[round]) % 10;
  if (temp === 0) {
    return itr(num, roman, round + 1);
  }

  // Symbol I  V  X   L   C    D    M
  // Value  1  5  10  50  100  500  1,000
  const n = [['M'], ['C', 'D', 'M'], ['X', 'L', 'C'], ['I', 'V', 'X']];

  const d = divisor[round];
  const nmrl = n[round];

  if (temp === 9) {
    return itr(num - 9 * d, roman + nmrl[0] + nmrl[2], round);
  }
  if (temp >= 5) {
    return itr(num - 5 * d, roman + nmrl[1], round);
  }
  if (temp === 4) {
    return itr(num - 4 * d, roman + nmrl[0] + nmrl[1], round);
  }
  if (temp >= 1) {
    // console.log(roman, n[round][0]);
    return itr(num - 1 * d, roman + nmrl[0], round);
  }
  // switched from null to '' without tests
  return '';
};

const intToRoman = (num: number): string => {
  if (num === 0) {
    return '';
  }
  // verify non-negative
  if (num < 0) {
    return itr(-num);
  }
  return itr(num);
};

intToRoman(3) === 'III';
intToRoman(4) === 'IV';
intToRoman(9) === 'IX';
intToRoman(58) === 'LVIII';
intToRoman(1994) === 'MCMXCIV';

/**
 * Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
 * Symbol       Value
 *   I           1
 *   V           5
 *   X           10
 *   L           50
 *   C           100
 *   D           500
 *   M           1000
 *
 * For example, two is written as II in Roman numeral, just two one's added together.
 * Twelve is written as, XII, which is simply X + II.
 * The number twenty seven is written as XXVII, which is XX + V + II.
 *
 * Roman numerals are usually written largest to smallest from left to right.
 * However, the numeral for four is not IIII. Instead, the number four is written as IV.
 * Because the one is before the five we subtract it making four.
 * The same principle applies to the number nine, which is written as IX.
 * There are six instances where subtraction is used:
 *     I can be placed before V (5) and X (10) to make 4 and 9.
 *     X can be placed before L (50) and C (100) to make 40 and 90.
 *     C can be placed before D (500) and M (1000) to make 400 and 900.
 *
 * Given a roman numeral, convert it to an integer.
 * Input is guaranteed to be within the range from 1 to 3999.
 *
 * Example 1:
 * Input: "III"
 * Output: 3
 *
 * Example 2:
 * Input: "IV"
 * Output: 4
 *
 * Example 3:
 * Input: "IX"
 * Output: 9
 *
 * Example 4:
 * Input: "LVIII"
 * Output: 58
 * Explanation: C = 100, L = 50, XXX = 30 and III = 3.
 *
 * Example 5:
 * Input: "MCMXCIV"
 * Output: 1994
 * Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
 */
const romanToInt = (str: string): number => {
  if (str === '') {
    return 0;
  }
  let ret = 0;
  const characters = str.split('');
  // Symbol I  V  X   L   C    D    M
  // Value  1  5  10  50  100  500  1,000
  const romanMap: { [name: string]: number } = {
    M: 1000,
    D: 500,
    C: 100,
    L: 50,
    X: 10,
    V: 5,
    I: 1,
  };

  for (let i = 0; i < characters.length; i += 1) {
    const currentCharacter = romanMap[characters[i]];
    const nextCharacter = romanMap[characters[i + 1]];

    if (currentCharacter < nextCharacter) {
      ret += nextCharacter - currentCharacter;
      i += 1;
    } else {
      ret += currentCharacter;
    }
  }
  return ret;
};

romanToInt('III') === 3;
romanToInt('IV') === 4;
romanToInt('IX') === 9;
romanToInt('LVIII') === 58;
romanToInt('MCMXCIV') === 1994;

/**
 * you have unlimited stickers (n)
 * all stickers read "facebook"
 * you get a pair of scissors -> cut stickers for a new word -> "cookbook"
 * what is the min number of stickers needed to create a new word "cookbook"
 * 1 "c book" 2 "oo k" => cookbook
 * return -1 if sticker can't be created
 */

/** given an array of numbers, and a sum, find and return the index of 2 numbers that adds up to the sum */

export default {};
