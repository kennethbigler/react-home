import { Action } from "redux";
import { DBTicTacToe } from "../types";
import initialState, { newTicTacToe } from "../initialState";

// --------------------     Actions     -------------------- //
const SET = "casino/ticTacToe/SET";
const NEW_GAME = "casino/ticTacToe/NEW_GAME";

// -------------------- Action Creators     -------------------- //
interface PlayTurnAction extends Action<typeof SET> {
  turn: DBTicTacToe;
}
/** update game variables in TicTacToe DB */
export const playTurn = (turn: DBTicTacToe): PlayTurnAction => ({
  type: SET,
  turn,
});

type NewGameAction = Action<typeof NEW_GAME>;
/** reset game variables in TicTacToe DB */
export const newGame = (): NewGameAction => ({ type: NEW_GAME });

// --------------------     Reducers     -------------------- //
type TicTacToeActions = PlayTurnAction | NewGameAction;
export default function reducer(
  state: DBTicTacToe = initialState.ticTacToe,
  action: TicTacToeActions
): DBTicTacToe {
  switch (action.type) {
    case SET:
      return action.turn;
    case NEW_GAME:
      return newTicTacToe();
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
