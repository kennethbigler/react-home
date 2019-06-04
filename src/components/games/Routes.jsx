import React, { Suspense } from 'react';
import types from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import reduce from 'lodash/reduce';
// custom
import lazyWithPreload from '../../apis/lazyWithPreload';
import Header from '../common/header/Header';
import Menu from './Menu';
import LoadingSpinner from '../common/LoadingSpinner';
// Parents: Routes (main)

// lazy load page components
const GameHome = lazyWithPreload(import('./Home'));
const BlackJack = lazyWithPreload(import('./blackjack'));
const Connect4 = lazyWithPreload(import('./connect4'));
const DealOrNoDeal = lazyWithPreload(import('./deal-or-no-deal'));
const Dota2Picker = lazyWithPreload(import('./dota-2-picker'));
const Poker = lazyWithPreload(import('./poker'));
const Slots = lazyWithPreload(import('./slots'));
const TicTacToe = lazyWithPreload(import('./tictactoe'));
const Yahtzee = lazyWithPreload(import('./yahtzee'));

const Routes = (props) => {
  const { match, handleNav } = props;
  const { url } = match;

  const paths = reduce(
    [
      { name: 'blackjack', component: BlackJack },
      { name: 'connect4', component: Connect4 },
      { name: 'deal', component: DealOrNoDeal },
      { name: 'dota2', component: Dota2Picker },
      { name: 'poker', component: Poker },
      { name: 'slots', component: Slots },
      { name: 'tictactoe', component: TicTacToe },
      { name: 'yahtzee', component: Yahtzee },
    ],
    (acc, obj) => {
      const { name, component } = obj;
      const path = `${url}/${name}`;
      acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
      acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
      return acc;
    },
    [],
  );

  return (
    <div>
      <Header handleNav={handleNav} showPlayers>
        <Menu />
      </Header>
      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route component={GameHome} exact path={`${url}`} />
          {paths}
          <Redirect from={`${url}/*`} to={`${url}`} />
          <Route component={GameHome} />
        </Switch>
      </Suspense>
    </div>
  );
};

Routes.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  handleNav: types.func.isRequired,
  match: types.shape({
    url: types.string.isRequired,
  }).isRequired,
};

export default Routes;
