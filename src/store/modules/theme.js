// functions
import assign from 'lodash/assign';
// colors
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/grey';

// initialState
import initialState from '../initialState';

// Actions
const DARK_THEME = 'resume/theme/DARK_THEME';
const LIGHT_THEME = 'resume/theme/LIGHT_THEME';

// Action Creators
export function displayDarkTheme() {
  return { type: DARK_THEME };
}
export function displayLightTheme() {
  return { type: LIGHT_THEME };
}

// Reducer
export default function reducer(state = initialState.theme, action) {
  switch (action.type) {
    case DARK_THEME:
      return assign({}, state, { primary: grey, secondary: deepOrange });
    case LIGHT_THEME:
      return assign({}, state, { primary: blueGrey, secondary: deepOrange });
    default:
      return state;
  }
}
