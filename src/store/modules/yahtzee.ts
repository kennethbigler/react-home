import { Action } from 'redux';
import initialState, { newYahtzee } from '../initialState';
import { DBYahtzee, Dice } from '../types';

// --------------------     Actions     -------------------- //
const ADD = 'casino/yahtzee/SCORE';
const NEW_GAME = 'casino/yahtzee/NEW_GAME';
const DICE_CLICK = 'casino/yahtzee/DICE_CLICK';
const NEXT_ROLL = 'casino/yahtzee/NEXT_ROLL';
const UPDATE_TOP = 'casino/yahtzee/UPDATE_TOP';
const UPDATE_BOTTOM = 'casino/yahtzee/UPDATE_BOTTOM';
const UPDATE_ROLL = 'casino/yahtzee/UPDATE_ROLL';

// -------------------- Action Creators     -------------------- //
interface AddScoreAction extends Action<typeof ADD> { score: number }
/** add score to score table in Yahtzee DB */
export const addScore = (score: number): AddScoreAction => ({ type: ADD, score });

type NewGameAction = Action<typeof NEW_GAME>
/** reset game in Yahtzee DB */
export const newGame = (): NewGameAction => ({ type: NEW_GAME });

interface DiceClickAction extends Action<typeof DICE_CLICK> { values: Dice[]; saved: Dice[] }
/** save a dice in Yahtzee DB */
export const diceClick = (values: Dice[], saved: Dice[]): DiceClickAction => ({ type: DICE_CLICK, values, saved });

type NextRollAction = Action<typeof NEXT_ROLL>
/** move to the next roll in Yahtzee DB */
export const nextRoll = (): NextRollAction => ({ type: NEXT_ROLL });

interface UpdateTopAction extends Action<typeof UPDATE_TOP> { topScores: number[] }
/** update top scores in Yahtzee DB */
export const updateTop = (topScores: number[]): UpdateTopAction => ({ type: UPDATE_TOP, topScores });

interface UpdateBottomAction extends Action<typeof UPDATE_BOTTOM> { bottomScores: number[] }
/** update bottom scores in Yahtzee DB */
export const updateBottom = (bottomScores: number[]): UpdateBottomAction => ({ type: UPDATE_BOTTOM, bottomScores });

interface UpdateRollAction extends Action<typeof UPDATE_ROLL> {
  payload: { values: Dice[]; saved: Dice[]; roll: Dice; showScoreButtons: boolean };
}
/** new roll in Yahtzee DB */
export const updateRoll = (values: Dice[], saved: Dice[], roll: Dice, showScoreButtons = false): UpdateRollAction => ({
  type: UPDATE_ROLL,
  payload: {
    values, saved, roll, showScoreButtons,
  },
});

// --------------------     Reducers     -------------------- //
type YahtzeeActions = AddScoreAction | NewGameAction | DiceClickAction | NextRollAction | UpdateTopAction | UpdateBottomAction | UpdateRollAction
export default function reducer(state: DBYahtzee = initialState.yahtzee, action: YahtzeeActions): DBYahtzee {
  switch (action.type) {
    case ADD:
      return { ...state, scores: [...state.scores, action.score]};
    case NEW_GAME:
      return { ...newYahtzee(), scores: state.scores };
    case DICE_CLICK:
      return { ...state, values: [...action.values], saved: [...action.saved]};
    case UPDATE_TOP:
      return {
        ...state,
        hasScored: true,
        showScoreButtons: false,
        topScores: action.topScores,
      };
    case UPDATE_BOTTOM:
      return {
        ...state,
        hasScored: true,
        showScoreButtons: false,
        bottomScores: action.bottomScores,
      };
    case NEXT_ROLL:
      return {
        ...state,
        ...{
          roll: 0,
          values: [0, 0, 0, 0, 0],
          saved: [],
          hasScored: false,
        },
      };
    case UPDATE_ROLL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
