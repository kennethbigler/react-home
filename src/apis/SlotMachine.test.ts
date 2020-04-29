import {
  spin,
  pullHandle,
  getPayout,
} from './SlotMachine';
import { DBSlotOptions } from '../store/types';

describe('apis | SlotMachine', () => {
  test('spin', () => {
    const result = spin();
    expect(result).toHaveLength(3);
    expect(Object.values(DBSlotOptions)).toContain(result[0]);
    expect(Object.values(DBSlotOptions)).toContain(result[1]);
    expect(Object.values(DBSlotOptions)).toContain(result[2]);
  });
  test('pullHandle', () => {
    expect(true);
  });
  test('getPayout', () => {
    expect(true);
  });
});
