import { Action, Dispatch } from 'redux';
import { DBPoker, DBPlayer, PokerGameFunctions as PGF } from '../types';
import initialState, { newPokerGameState } from '../initialState';
import { resetTurn, incrPlayerTurn, ta } from './turn';
import { resetStatus, PlayerAction } from './players';

// --------------------     Actions     -------------------- //
const UPDATE_DISCARD_CARDS = 'casino/poker/UPDATE_DISCARD_CARDS';
enum pa {
  NEW_GAME = 'casino/poker/NEW_GAME',
  START_GAME = 'casino/poker/START_GAME',
  END_TURN = 'casino/poker/END_TURN',
  END_GAME = 'casino/poker/END_GAME',
  DISCARD_CARDS = 'casino/poker/DISCARD_CARDS',
}
const {
  NEW_GAME, START_GAME, END_TURN, END_GAME,
  DISCARD_CARDS,
} = pa;

// --------------------     Action Creators     -------------------- //
/** start a new game in Poker DB */
const newGame = (): Action<typeof NEW_GAME> => ({ type: NEW_GAME });
/** deal cards and begin play (after betting) in Poker DB */
export const startPokerGame = (): Action<typeof START_GAME> => ({ type: START_GAME });
/** move to the next player in Poker DB */
const endTurn = (): Action<typeof END_TURN> => ({ type: END_TURN });
/** end the game by updating a flag in Poker DB */
export const endPokerGame = (): Action<typeof END_GAME> => ({ type: END_GAME });
/** reset cards to discard back to empty in Poker DB */
export const discardCards = (): Action<typeof DISCARD_CARDS> => ({ type: DISCARD_CARDS });

interface UpdateCardsToDiscardAction extends Action<typeof UPDATE_DISCARD_CARDS> { cardsToDiscard: number[] }
/** mark a card for discard in Poker DB */
export const updateCardsToDiscard = (cardsToDiscard: number[]): UpdateCardsToDiscardAction => ({ type: UPDATE_DISCARD_CARDS, cardsToDiscard });

// --------------------     Reducers     -------------------- //
type PokerActions = Action<pa> | UpdateCardsToDiscardAction;
export default function reducer(state: DBPoker = initialState.poker, action: PokerActions): DBPoker {
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
/** start a new game in Poker DB */
export function newPokerGame(players: DBPlayer[]) {
  return (dispatch: Dispatch): Promise<(Action<ta.RESET> | Action<pa.NEW_GAME> | PlayerAction)[]> => {
    const promises: (Action<ta.RESET> | Action<pa.NEW_GAME> | PlayerAction)[] = [];
    promises.push(dispatch(newGame()));
    promises.push(dispatch(resetTurn()));
    players.forEach((player) => promises.push(dispatch(resetStatus(player.id))));
    return Promise.all(promises);
  };
}

/** move to the next player in Poker DB and Turn DB */
export function endPokerTurn() {
  return async (dispatch: Dispatch): Promise<void> => {
    await dispatch(endTurn());
    await dispatch(incrPlayerTurn());
  };
}
