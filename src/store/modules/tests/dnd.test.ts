import { newDNDGame } from '../../initialState';
import dndReducer, {
  newGame, updatePlayerChoice, setOpenCase, setOpenOffer, setNoDeal, finishGame,
} from '../dnd';

const state = newDNDGame();

describe('store | modules | blackjack', () => {
  test('reducer', () => {
    expect(dndReducer(state, newGame())).not.toEqual(state);
    expect(dndReducer(state, updatePlayerChoice({ on: true, loc: 0, val: 0 })))
      .toEqual({ ...state, playerChoice: { on: true, loc: 0, val: 0 }});
    expect(dndReducer(state, setOpenCase([{ on: true, loc: 0, val: 0 }], 1, 1, 1)))
      .toEqual({
        ...state,
        board: [{ on: true, loc: 0, val: 0 }],
        sum: 1,
        numCases: 1,
        casesToOpen: 1,
      });
    expect(dndReducer(state, setOpenOffer(1, 2)))
      .toEqual({
        ...state, offer: 1, casesToOpen: 2, dndOpen: true,
      });
    expect(dndReducer(state, setNoDeal(6))).toEqual({ ...state, turn: 7 });
    expect(dndReducer(state, finishGame(7))).toEqual({
      ...state, dndOpen: false, isOver: true, offer: 7,
    });
  });
});
