import { combineReducers } from 'redux';
import dota2 from './modules/dota2';
import git from './modules/git';
import graphql from './modules/graphql';
import players from './modules/players';
import theme from './modules/theme';
import turn from './modules/turn';
import yahtzee from './modules/yahtzee';

const rootReducer = combineReducers({
  dota2, git, graphql, players, theme, turn, yahtzee,
});

export default rootReducer;
