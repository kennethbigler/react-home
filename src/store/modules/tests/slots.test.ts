import { DBSlotDisplay, DBSlotOptions } from '../../types';
import slotReducer, { updateSlots } from '../slots';

const state: DBSlotDisplay[] = [[DBSlotOptions.EMPTY, DBSlotOptions.CHERRY, DBSlotOptions.SEVEN]];

describe('store | modules | slots', () => {
  test('reducer', () => {
    expect(slotReducer(state, updateSlots([[DBSlotOptions.SEVEN, DBSlotOptions.SEVEN, DBSlotOptions.SEVEN]])))
      .toEqual([[DBSlotOptions.SEVEN, DBSlotOptions.SEVEN, DBSlotOptions.SEVEN]]);
  });

  test('incorrect parameters', () => {
    // @ts-expect-error: fake action for testing purposes
    expect(slotReducer(state, { type: undefined })).toEqual(state);
    // @ts-expect-error: fake action for testing purposes
    expect(slotReducer(undefined, { type: undefined })).toHaveLength(3);
  });
});
