import React, { Suspense } from 'react';
import {
  Switch, Route, Redirect, match as Match,
} from 'react-router-dom';
import reduce from 'lodash/reduce';
import lazyWithPreload from '../../helpers/lazyWithPreload';
import Header from '../common/header/Header';
import Menu from './Menu';
import LoadingSpinner from '../common/loading-spinner';

interface RoutesProps {
  handleNav: (...args: any[]) => any;
  match: Match;
}

// lazy load page components
const GameHome = lazyWithPreload(import(/* webpackChunkName: "g_home" */ './Home'));
const BlackJack = lazyWithPreload(import(/* webpackChunkName: "g_bj" */ './blackjack'));
const Connect4 = lazyWithPreload(import(/* webpackChunkName: "g_connect4" */ './connect4'));
const DealOrNoDeal = lazyWithPreload(import(/* webpackChunkName: "g_dond" */ './deal-or-no-deal'));
const Dota2Picker = lazyWithPreload(import(/* webpackChunkName: "g_d2p" */ './dota-2-picker'));
const Poker = lazyWithPreload(import(/* webpackChunkName: "g_poker" */ './poker'));
const Slots = lazyWithPreload(import(/* webpackChunkName: "g_slots" */ './slots'));
const TicTacToe = lazyWithPreload(import(/* webpackChunkName: "g_tictactoe" */ './tictactoe'));
const Yahtzee = lazyWithPreload(import(/* webpackChunkName: "g_yahtzee" */ './yahtzee'));

const Routes: React.FC<RoutesProps> = (props: RoutesProps) => {
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
    (acc: React.ReactNode[], obj) => {
      const { name, component } = obj;
      const path = `${url}/${name}`;
      acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
      acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
      return acc;
    },
    [],
  );

  return (
    <>
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
    </>
  );
};

export default Routes;
