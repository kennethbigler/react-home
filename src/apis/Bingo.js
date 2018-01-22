/* --------------------------------------------------
 * Bingo
 * -------------------------------------------------- */

let called = [true];
const getRand = () =>  Math.floor(Math.random() * 75) + 1;

export const Bingo = {
  getBall: () => {
    let ball = 0;
    while (called[ball]) {
      ball = getRand();
    }
    called[ball] = true;
    return ball;
  },
};
