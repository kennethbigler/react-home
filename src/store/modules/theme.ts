import { Action } from 'redux';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';

import { DBUITheme } from '../types';
import initialState from '../initialState';

// --------------------     Actions     -------------------- //
const DARK_THEME = 'resume/theme/DARK_THEME';
const LIGHT_THEME = 'resume/theme/LIGHT_THEME';

// --------------------     Action Creators     -------------------- //
export const displayDarkTheme = (): Action => ({ type: DARK_THEME });
export const displayLightTheme = (): Action => ({ type: LIGHT_THEME });

// --------------------     Reducers     -------------------- //
export default function reducer(state: DBUITheme = initialState.theme, action: Action): DBUITheme {
  switch (action.type) {
    case DARK_THEME:
      return { ...state, ...{ type: 'dark', primary: indigo, secondary: deepOrange }};
    case LIGHT_THEME:
      return { ...state, ...{ type: 'light', primary: blueGrey, secondary: deepOrange }};
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
