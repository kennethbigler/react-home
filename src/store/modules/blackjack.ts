import { AnyAction, Dispatch } from 'redux';
import { DBBlackjack, DBPlayer, DBHand } from '../types';
import initialState, { newBlackjackGame } from '../initialState';
import {
  resetStatus,
  splitHand as pSplitHand,
  drawCard,
  WeighFunc,
  updateBet,
} from './players';
import { resetTurn, incrHandTurn, incrPlayerTurn } from './turn';

// --------------------     Actions     -------------------- //
const UPDATE_GAME_FUNCTIONS = 'casino/blackjack/UPDATE_GAME_FUNCTIONS';
const UPDATE_HIDE_HANDS = 'casino/blackjack/UPDATE_HIDE_HANDS';
const UPDATE_HAS_FUNCTIONS = 'casino/blackjack/UPDATE_HAS_FUNCTIONS';

// -------------------- Action Creators     -------------------- //
export const updateGameFunctions = (gameFunctions: string[]): AnyAction => ({ type: UPDATE_GAME_FUNCTIONS, gameFunctions });
export const updateHideHands = (hideHands: boolean): AnyAction => ({ type: UPDATE_HIDE_HANDS, hideHands });
export const updateHasFunctions = (hasFunctions: boolean): AnyAction => ({ type: UPDATE_HAS_FUNCTIONS, hasFunctions });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBBlackjack = initialState.blackjack, action: AnyAction): DBBlackjack {
  switch (action.type) {
    case UPDATE_GAME_FUNCTIONS:
      return { ...state, gameFunctions: action.gameFunctions };
    case UPDATE_HIDE_HANDS:
      return { ...state, hideHands: action.hideHands };
    case UPDATE_HAS_FUNCTIONS:
      return { ...state, hasFunctions: action.hasFunctions };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
export function setNewGame(players: DBPlayer[]) {
  return (dispatch: Function): Promise<Dispatch[]> => {
    const { gameFunctions, hideHands, hasFunctions } = newBlackjackGame();
    const promises = [];
    promises.push(dispatch(updateGameFunctions(gameFunctions)));
    promises.push(dispatch(updateHasFunctions(hasFunctions)));
    promises.push(dispatch(updateHideHands(hideHands)));
    promises.push(dispatch(resetTurn()));
    players.forEach((player) => promises.push(dispatch(resetStatus(player.id))));
    return Promise.all(promises);
  };
}
export function splitHand(hands: DBHand[], id: number, hNum: number, weigh: WeighFunc) {
  return (dispatch: Function): Promise<Dispatch[]> => dispatch(pSplitHand(hands, id, hNum, weigh))
    .then(() => dispatch(updateHasFunctions(false)));
}
export function hitHand(hands: DBHand[], id: number, hNum: number, weigh: WeighFunc) {
  return (dispatch: Function): Promise<Dispatch[]> => dispatch(drawCard(hands, id, hNum, 1, weigh))
    .then(() => dispatch(updateHasFunctions(false)));
}
export function stayHand(readyForNextPlayer: boolean) {
  return async (dispatch: Function): Promise<Dispatch[]> => {
    readyForNextPlayer ? await dispatch(incrHandTurn()) : await dispatch(incrPlayerTurn());
    return dispatch(updateHasFunctions(false));
  };
}
export function doubleHand(id: number, bet: number, hands: DBHand[], hNum: number, weigh: WeighFunc, readyForNextPlayer: boolean) {
  return async (dispatch: Function): Promise<void> => {
    await dispatch(updateBet(id, bet * 2));
    await dispatch(drawCard(hands, id, hNum, 1, weigh));
    await dispatch(stayHand(readyForNextPlayer));
    await dispatch(updateHasFunctions(false));
  };
}
