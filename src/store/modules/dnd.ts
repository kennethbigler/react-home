import { Action, Dispatch } from 'redux';
import { DBDND, Briefcase } from '../types';
import initialState, { newDNDGame } from '../initialState';
import { payout, PlayerAction } from './players';

// --------------------     Actions     -------------------- //
const NEW_GAME = '@casino/dnd/NEW_GAME';
const PLAYER_CHOICE = '@casino/dnd/PLAYER_CHOICE';
const OPEN_CASE = '@casino/dnd/OPEN_CASE';
const OPEN_OFFER = '@casino/dnd/OPEN_OFFER';
const NO_DEAL = '@casino/dnd/NO_DEAL';
const FINISH_GAME = '@casino/dnd/FINISH_GAME';

// --------------------     Action Creators     -------------------- //
type NewGameAction = Action<typeof NEW_GAME>;
/** set to a new game in Deal or No Deal DB */
export const newGame = (): NewGameAction => ({ type: NEW_GAME });

interface UpdatePlayerChoiceAction extends Action<typeof PLAYER_CHOICE> { playerChoice: Briefcase }
/** update the player's case choice in Deal or No Deal DB */
const updatePlayerChoice = (playerChoice: Briefcase): UpdatePlayerChoiceAction => ({ type: PLAYER_CHOICE, playerChoice });

interface SetOpenCaseAction extends Action<typeof OPEN_CASE> {
  board: Briefcase[];
  sum: number;
  numCases: number;
  casesToOpen: number;
}
/** open a case and update game variables in Deal or No Deal DB */
export const setOpenCase = (board: Briefcase[], sum: number, numCases: number, casesToOpen: number): SetOpenCaseAction => ({
  type: OPEN_CASE, board, sum, numCases, casesToOpen,
});

interface SetOpenOfferAction extends Action<typeof OPEN_OFFER> { offer: number; casesToOpen: number }
/** display the offer from the banker and open modal in Deal or No Deal DB */
export const setOpenOffer = (offer: number, casesToOpen: number): SetOpenOfferAction => ({ type: OPEN_OFFER, offer, casesToOpen });

interface SetNoDealAction extends Action<typeof NO_DEAL> { turn: number }
/** reject the offer and continue playing in Deal or No Deal DB */
export const setNoDeal = (turn: number): SetNoDealAction => ({ type: NO_DEAL, turn });

interface FinishGameAction extends Action<typeof FINISH_GAME> { offer: number }
/** finish the game in Deal or No Deal DB */
const finishGame = (offer: number): FinishGameAction => ({ type: FINISH_GAME, offer });

// --------------------     Reducers     -------------------- //
type DNDActions = NewGameAction | UpdatePlayerChoiceAction | SetOpenCaseAction | SetOpenOfferAction | SetNoDealAction | FinishGameAction;
export default function reducer(state: DBDND = initialState.dnd, action: DNDActions): DBDND {
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
  return (dispatch: Dispatch): Promise<[UpdatePlayerChoiceAction, PlayerAction]> => {
    const promise1 = dispatch(updatePlayerChoice(playerChoice));
    const promise2 = dispatch(payout(id, 'lose', -100));
    return Promise.all([promise1, promise2]);
  };
}

/** function to finish the game
   * NOTE: payout to user offer / 1k */
export function setFinishGame(id: number, offer: number) {
  return (dispatch: Dispatch): Promise<[PlayerAction, FinishGameAction]> => {
    const promise1 = dispatch(payout(id, 'win', Math.round(offer / 1000)));
    const promise2 = dispatch(finishGame(offer));
    return Promise.all([promise1, promise2]);
  };
}
