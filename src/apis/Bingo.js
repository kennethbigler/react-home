/* --------------------------------------------------
 * Bingo
 * -------------------------------------------------- */

let called = [true];
const getRand = () => Math.floor(Math.random() * 75) + 1;

export const Bingo = {
  getBall: () => {
    let ball = 0;
    while (called[ball]) {
      ball = getRand();
    }
    called[ball] = true;
    return ball;
  }
};

/*
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

// use a hash table, start at cooldown, subtract from there
// inputs: array of tasks, cooldown
