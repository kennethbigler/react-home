import { Action, AnyAction, Dispatch } from 'redux';
import { DBDND, Briefcase } from '../types';
import initialState, { newDNDGame } from '../initialState';
import { payout } from './players';

// --------------------     Actions     -------------------- //
const NEW_GAME = 'casino/dnd/NEW_GAME';
const PLAYER_CHOICE = 'casino/dnd/PLAYER_CHOICE';
const OPEN_CASE = 'casino/dnd/OPEN_CASE';
const OPEN_OFFER = 'casino/dnd/OPEN_OFFER';
const NO_DEAL = 'casino/dnd/NO_DEAL';
const FINISH_GAME = 'casino/dnd/FINISH_GAME';

// --------------------     Action Creators     -------------------- //
export const newGame = (): Action => ({ type: NEW_GAME });
const updatePlayerChoice = (playerChoice: Briefcase): AnyAction => ({ type: PLAYER_CHOICE, playerChoice });
export const setOpenCase = (board: Briefcase[], sum: number, numCases: number, casesToOpen: number): AnyAction => ({
  type: OPEN_CASE, board, sum, numCases, casesToOpen,
});
export const setOpenOffer = (offer: number, casesToOpen: number): AnyAction => ({ type: OPEN_OFFER, offer, casesToOpen });
export const setNoDeal = (turn: number): AnyAction => ({ type: NO_DEAL, turn });
const finishGame = (offer: number): AnyAction => ({ type: FINISH_GAME, offer });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBDND = initialState.dnd, action: AnyAction): DBDND {
  switch (action.type) {
    case NEW_GAME:
      return newDNDGame();
    case PLAYER_CHOICE:
      return { ...state, playerChoice: action.playerChoice };
    case OPEN_CASE:
      return {
        ...state,
        board: action.board,
        sum: action.sum,
        numCases: action.numCases,
        casesToOpen: action.casesToOpen,
      };
    case OPEN_OFFER:
      return {
        ...state, offer: action.offer, casesToOpen: action.casesToOpen, dndOpen: true,
      };
    case NO_DEAL:
      return { ...state, dndOpen: false, turn: action.turn + 1 };
    case FINISH_GAME:
      return {
        ...state, dndOpen: false, isOver: true, offer: action.offer,
      };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
/** charge user to play and set player choice
   * NOTE: avg (Expected win value) is 131477.62 / 1k = $132 */
export function setPlayerChoice(id: number, playerChoice: Briefcase) {
  return (dispatch: Function): Promise<[Dispatch, Dispatch]> => {
    const promise1 = dispatch(updatePlayerChoice(playerChoice));
    const promise2 = dispatch(payout(id, 'lose', -100));
    return Promise.all([promise1, promise2]);
  };
}

/** function to finish the game
   * NOTE: payout to user offer / 1k */
export function setFinishGame(id: number, offer: number) {
  return (dispatch: Function): Promise<[Dispatch, Dispatch]> => {
    const promise1 = dispatch(payout(id, 'win', Math.round(offer / 1000)));
    const promise2 = dispatch(finishGame(offer));
    return Promise.all([promise1, promise2]);
  };
}
