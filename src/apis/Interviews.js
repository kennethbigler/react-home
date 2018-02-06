/* Facebook - Task Execution Time with Cooldowns
given an array of tasks (each number represents a different task)
only 1 task can execute at a time, with a cool down in between the same tasks of the same number
different tasks don't have to wait for the cooldown
find how long execution of the tasks would take

EX:
nums: [1, 1, 2, 0, 2, 1]
cooldown: 2
Output: 9
Explanation: 1 _ _ 1 2 0 _ 2 1
*/

function doTasks(tasks, cooldown) {
  let lastRunMap = {};
  let ans = 0;
  let debug = '';
  let currentTime = 0;
  for (let task of tasks) {
    const lastRun = lastRunMap[task] || 0;
    const waitTime = lastRun + cooldown + 1 - currentTime;
    if (waitTime && lastRunMap[task] !== undefined) {
      ans += waitTime;
      for (let x = 0; x < waitTime; x++) {
        debug += ' -';
      }
      currentTime += waitTime;
    }
    ans += 1;
    debug += ` ${task}`;
    lastRunMap[task] = currentTime;
    currentTime += 1;
  }
  console.log(debug);
  return ans;
}

doTasks([1, 1, 2, 0, 2, 1], 4);
doTasks([1, 1, 2, 0, 2, 1], 4);
doTasks([1, 1, 3, 2, 1, 2, 1], 3);

/* Google - Is the input an Ambigram I
Given an array of numbers, determine if it is an Ambigram
Ambigram - The same word forwards, backwards, and upsidown
EX: 1881

HINT1: consider the numbers that flip to stay the same: 0, 1, 8
HINT2: consider the numbers that flip to become another number: 6, 9
*/
function isAmbigram1(nums) {
  // create map
  const flip = { 0: 0, 1: 1, 6: 9, 9: 6, 8: 8 };
  // verify characters are good
  for (let i = 0; i < Math.ceil(nums.length / 2); i += 1) {
    const a = nums[i];
    const b = nums[nums.length - 1 - i];
    // failed check
    if (!flip[a] || flip[a] !== b) {
      return false;
    }
  }
  // everything passes check
  return true;
}

isAmbigram1([1, 8, 1]);
isAmbigram1([1, 6, 9, 1]);
isAmbigram1([1, 6, 1]);

/* Code Golf - Is the input an Ambigram II
Given a string, determine if it is an Ambigram
Ambigram - The same word forwards, backwards, and upsidown
EX: 1881

Table (goes both ways)
0  0
1  1
2  5
6  9
8  8
a  e
b  q
d  p/P
h  y/Y
l  l
m  w
n  u/U
o  o/O
O  o/O
s  s/S
t  t
x  x/X
z  z/Z
H  H
I  I
M  W
N  N
*/
function isAmbigram2(word) {
  // create map
  const flip = {
    '0': ['0'],
    '1': ['1'],
    '2': ['5'],
    '5': ['2'],
    '6': ['9'],
    '9': ['6'],
    '8': ['8'],
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
    N: ['N']
  };

  const chars = word.split('');
  // verify characters are good
  for (let i = 0; i < Math.ceil(chars.length / 2); i += 1) {
    // get 2 opposite elements
    const arr = flip[chars[i]];
    const b = chars[chars.length - 1 - i];
    // check if failed check
    if (!arr) return false;
    // check for match, store in flag
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

/**
 * NOTE: a win condition will only happen with a piece played
 * @param {number} x - x location of play
 * @param {number} y - y location of play
 */
function helpEvalConnect4(piece, line) {
  if (piece == line[0]) {
    line[1] += 1;
  } else {
    line[0] = piece;
    line[1] = 1;
  }
}

/** function to evaluate a connect 4 board based off the last piece played
 * NOTE: a win condition will only happen with a piece played
 * @param {array} board - 6 x 7 matrix of spaces, 0 empty, 1 red, 2 black
 * @param {number} x - x location of play
 * @param {number} y - y location of play
 */
function evalConnect4(board, x, y) {
  // variables to track streaks
  let vertical = [0, 0];
  let horizontal = [0, 0];
  let diagonal = [0, 0];
  // what range can we have?
  // (x-3,y) > (x+3,y)
  // (x,y-3) > (x,y+3)
  // (x-3,y-3) > (x+3,y+3)
  for (let i = -3; i <= 3; i += 1) {
    const xBound = x + i > 0 && x + i < board.length;
    const yBound = y + i > 0 && y + i < board[x].length;
    xBound && helpEvalConnect4(board[x + i][y], vertical);
    yBound && helpEvalConnect4(board[x][y + i], horizontal);
    xBound && yBound && helpEvalConnect4(board[x + i][y + i], diagonal);
    if (vertical >= 4 || horizontal >= 4 || diagonal >= 4) {
      return true;
    }
  }
}
