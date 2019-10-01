// functions
import assign from 'lodash/assign';
// colors
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
// initialState
import initialState from '../initialState';

// --------------------     Actions     -------------------- //

const DARK_THEME = 'resume/theme/DARK_THEME';
const LIGHT_THEME = 'resume/theme/LIGHT_THEME';

// --------------------     Action Creators     -------------------- //

export function displayDarkTheme() {
  return { type: DARK_THEME };
}
export function displayLightTheme() {
  return { type: LIGHT_THEME };
}

// --------------------     Reducers     -------------------- //

export default function reducer(state = initialState.theme, action) {
  switch (action.type) {
    case DARK_THEME:
      return assign({}, state, { type: 'dark', primary: indigo, secondary: deepOrange });
    case LIGHT_THEME:
      return assign({}, state, { type: 'light', primary: blueGrey, secondary: deepOrange });
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
