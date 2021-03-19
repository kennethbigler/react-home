import { Dispatch, Action } from 'redux';
import {
  DBBlackjack, DBPlayer, DBHand, DBTurn,
} from '../types';
import initialState, { newBlackjackGame } from '../initialState';
import {
  resetStatus,
  splitHand as pSplitHand,
  drawCard,
  WeighFunc,
  updateBet,
} from './players';
import {
  resetTurn, incrHandTurn, incrPlayerTurn, ta,
} from './turn';

// --------------------     Actions     -------------------- //
export const UPDATE_GAME_FUNCTIONS = '@casino/blackjack/UPDATE_GAME_FUNCTIONS';
export const UPDATE_HIDE_HANDS = '@casino/blackjack/UPDATE_HIDE_HANDS';
export const UPDATE_HAS_FUNCTIONS = '@casino/blackjack/UPDATE_HAS_FUNCTIONS';

// -------------------- Action Creators     -------------------- //
interface UpdateGameFunctionsAction extends Action<typeof UPDATE_GAME_FUNCTIONS> { gameFunctions: string[] }
/** update gameFunctions in Blackjack DB */
export const updateGameFunctions = (gameFunctions: string[]): UpdateGameFunctionsAction => ({ type: UPDATE_GAME_FUNCTIONS, gameFunctions });

interface UpdateHideHandsAction extends Action<typeof UPDATE_HIDE_HANDS> { hideHands: boolean }
/** update hideHands in Blackjack DB */
export const updateHideHands = (hideHands: boolean): UpdateHideHandsAction => ({ type: UPDATE_HIDE_HANDS, hideHands });

interface UpdateHasFunctionsAction extends Action<typeof UPDATE_HAS_FUNCTIONS> { hasFunctions: boolean }
/** update hasFunctions in Blackjack DB */
export const updateHasFunctions = (hasFunctions: boolean): UpdateHasFunctionsAction => ({ type: UPDATE_HAS_FUNCTIONS, hasFunctions });

// --------------------     Reducers     -------------------- //
type BlackjackAction = UpdateGameFunctionsAction | UpdateHideHandsAction | UpdateHasFunctionsAction;
export default function reducer(state: DBBlackjack = initialState.blackjack, action: BlackjackAction): DBBlackjack {
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
/** start a new game in Blackjack DB */
export function setNewGame(players: DBPlayer[]) {
  return (dispatch: Dispatch): Promise<(UpdateGameFunctionsAction | UpdateHideHandsAction | UpdateHasFunctionsAction | Action<ta.RESET>)[]> => {
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
/** split hands of provided player/hand in Blackjack DB */
export function splitHand(hands: DBHand[], id: number, hNum: number, weigh: WeighFunc) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: Dispatch<any>): Promise<void> => {
    await dispatch(pSplitHand(hands, id, hNum, weigh));
    await dispatch(updateHasFunctions(false));
  };
}
/** get a new card for turn hand in Blackjack DB */
export function hitHand(hands: DBHand[], id: number, hNum: number, weigh: WeighFunc) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: Dispatch<any>): Promise<void> => {
    await dispatch(drawCard(hands, id, hNum, 1, weigh));
    await dispatch(updateHasFunctions(false));
  };
}
/** go to the next turn in Blackjack DB */
export function stayHand(readyForNextPlayer: boolean) {
  return async (dispatch: Dispatch): Promise<void> => {
    readyForNextPlayer
      ? await dispatch(incrHandTurn())
      : await dispatch(incrPlayerTurn());
    await dispatch(updateHasFunctions(false));
  };
}
/** double your bet and get 1 card in Blackjack DB */
export function doubleHand(player: DBPlayer, turn: DBTurn, weigh: WeighFunc) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (dispatch: Dispatch<any>): Promise<void> => {
    const { id, bet, hands } = player;
    const lastHand = hands.length - 1;

    await dispatch(updateHasFunctions(true));
    await dispatch(updateBet(id, bet * 2));
    await dispatch(drawCard(hands, id, turn.hand, 1, weigh));
    await dispatch(stayHand(turn.hand < lastHand));
  };
}
