import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DBSlotDisplay, DBSlotOptions } from '../../types';
import slotReducer, { updateSlots, UPDATE, updateDBSlotMachine } from '../slots';
import { pa } from '../players';
import SlotMachine from '../../../apis/SlotMachine';

const state: DBSlotDisplay[] = [[DBSlotOptions.EMPTY, DBSlotOptions.CHERRY, DBSlotOptions.SEVEN]];

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('store | modules | slots', () => {
  describe('reducer', () => {
    test('actions', () => {
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

  describe('async thunk actions', () => {
    test('updateDBSlotMachine', () => {
      jest.spyOn(SlotMachine, 'pullHandle').mockReturnValue([...state, ...state, ...state]);
      const expectedActions = [
        { type: UPDATE, reel: [...state, ...state, ...state]},
        { type: pa.PAY_PLAYER, player: { id: 1, status: 'win', money: 55 }},
        { type: pa.PAY_PLAYER, player: { id: 0, status: 'win', money: -55 }},
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(updateDBSlotMachine(1, 0, 5)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
