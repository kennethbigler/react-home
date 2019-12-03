import { Action, Dispatch, AnyAction } from 'redux';
import { DBPoker, DBPlayer, PokerGameFunctions as PGF } from '../types';
import initialState, { newPokerGameState } from '../initialState';
import { resetTurn, incrPlayerTurn } from './turn';
import { resetStatus } from './players';


// --------------------     Actions     -------------------- //
const NEW_GAME = 'casino/poker/NEW_GAME';
const START_GAME = 'casino/poker/START_GAME';
const END_TURN = 'casino/poker/END_TURN';
const END_GAME = 'casino/poker/END_GAME';
const DISCARD_CARDS = 'casino/poker/DISCARD_CARDS';
const UPDATE_DISCARD_CARDS = 'casino/poker/UPDATE_DISCARD_CARDS';

// --------------------     Action Creators     -------------------- //
const newGame = (): Action => ({ type: NEW_GAME });
export const startPokerGame = (): Action => ({ type: START_GAME });
const endTurn = (): Action => ({ type: END_TURN });
export const endPokerGame = (): Action => ({ type: END_GAME });
export const discardCards = (): Action => ({ type: DISCARD_CARDS });
export const updateCardsToDiscard = (cardsToDiscard: number[]): AnyAction => ({ type: UPDATE_DISCARD_CARDS, cardsToDiscard });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBPoker = initialState.poker, action: AnyAction): DBPoker {
  switch (action.type) {
    case NEW_GAME:
      return { ...newPokerGameState() };
    case START_GAME:
      return {
        ...state,
        gameFunctions: [PGF.DISCARD_CARDS],
        hideHands: false,
      };
    case END_TURN:
      return {
        ...state,
        gameFunctions: [PGF.DISCARD_CARDS],
        cardsToDiscard: [],
      };
    case END_GAME:
      return {
        ...state,
        gameFunctions: [PGF.NEW_GAME],
        gameOver: true,
      };
    case DISCARD_CARDS:
      return {
        ...state,
        gameFunctions: [PGF.END_TURN],
        cardsToDiscard: [],
      };
    case UPDATE_DISCARD_CARDS:
      return {
        ...state,
        cardsToDiscard: action.cardsToDiscard,
      };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
export function newPokerGame(players: DBPlayer[]) {
  return (dispatch: Function): Promise<Dispatch[]> => {
    const promises = [];
    promises.push(dispatch(newGame()));
    promises.push(dispatch(resetTurn()));
    players.forEach((player) => promises.push(dispatch(resetStatus(player.id))));
    return Promise.all(promises);
  };
}

export function endPokerTurn() {
  return async (dispatch: Function): Promise<void> => {
    await dispatch(endTurn());
    await dispatch(incrPlayerTurn());
  };
}
