import Dice, { diceRoller, useDice } from '../Dice';

describe('apis | Dice', () => {
  it('rolls a number between 1 and 6', () => {
    for (let i = 0; i < 10; i += 1) {
      const roll = diceRoller();
      expect(roll).toBeLessThanOrEqual(6);
      expect(roll).toBeGreaterThanOrEqual(1);
    }
  });

  it('useDice rolls a number between 1 and 6', () => {
    const diceRoller2 = useDice();
    for (let i = 0; i < 10; i += 1) {
      const roll = diceRoller2();
      expect(roll).toBeLessThanOrEqual(6);
      expect(roll).toBeGreaterThanOrEqual(1);
    }
  });

  it('default export rolls a number between 1 and 6', () => {
    for (let i = 0; i < 10; i += 1) {
      const roll = Dice.roll();
      expect(roll).toBeLessThanOrEqual(6);
      expect(roll).toBeGreaterThanOrEqual(1);
    }
  });
});
