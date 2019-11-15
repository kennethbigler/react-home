import { AnyAction } from 'redux';
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
export const addScore = (score: number): AnyAction => ({ type: ADD, score });
export const newGame = (): AnyAction => ({ type: NEW_GAME });
export const diceClick = (values: Dice[], saved: Dice[]): AnyAction => ({ type: DICE_CLICK, values, saved });
export const nextRoll = (): AnyAction => ({ type: NEXT_ROLL });
export const updateTop = (topScores: number[]): AnyAction => ({ type: UPDATE_TOP, topScores });
export const updateBottom = (bottomScores: number[]): AnyAction => ({ type: UPDATE_BOTTOM, bottomScores });
export const updateRoll = (values: Dice[], saved: Dice[], roll: Dice, showScoreButtons = false): AnyAction => ({
  type: UPDATE_ROLL,
  payload: {
    values, saved, roll, showScoreButtons,
  },
});

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBYahtzee = initialState.yahtzee, action: AnyAction): DBYahtzee {
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
