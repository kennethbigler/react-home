import React from 'react';
import {
  Switch, Route, Redirect, match as Match,
} from 'react-router-dom';
import lazyWithPreload from '../../helpers/lazyWithPreload';
import Header from '../common/header/Header';
import Menu from './Menu';
import LoadingSpinner from '../common/loading-spinner';

interface RoutesProps {
  handleNav: Function;
  match: Match;
}

// lazy load page components
const GameHome = lazyWithPreload(import(/* webpackChunkName: "g_home" */ './Home'));
const BlackJack = lazyWithPreload(import(/* webpackChunkName: "g_bj" */ './blackjack'));
const Connect4 = lazyWithPreload(import(/* webpackChunkName: "g_connect4" */ './connect4'));
const DealOrNoDeal = lazyWithPreload(import(/* webpackChunkName: "g_dond" */ './deal-or-no-deal'));
const Poker = lazyWithPreload(import(/* webpackChunkName: "g_poker" */ './poker'));
const Slots = lazyWithPreload(import(/* webpackChunkName: "g_slots" */ './slots'));
const TicTacToe = lazyWithPreload(import(/* webpackChunkName: "g_tictactoe" */ './tictactoe'));
const Yahtzee = lazyWithPreload(import(/* webpackChunkName: "g_yahtzee" */ './yahtzee'));

const Routes: React.FC<RoutesProps> = (props: RoutesProps) => {
  const { match: { url }, handleNav } = props;

  const paths = React.useMemo(() => [
    { name: 'blackjack', component: BlackJack },
    { name: 'connect4', component: Connect4 },
    { name: 'deal', component: DealOrNoDeal },
    { name: 'poker', component: Poker },
    { name: 'slots', component: Slots },
    { name: 'tictactoe', component: TicTacToe },
    { name: 'yahtzee', component: Yahtzee },
  ].reduce((acc: React.ReactNode[], obj) => {
    const { name, component } = obj;
    const path = `${url}/${name}`;
    acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
    acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
    return acc;
  },
  []), [url]);

  return (
    <>
      <Header handleNav={handleNav} showPlayers>
        <Menu />
      </Header>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route component={GameHome} exact path={`${url}`} />
          {paths}
          <Redirect from={`${url}/*`} to={`${url}`} />
          <Route component={GameHome} />
        </Switch>
      </React.Suspense>
    </>
  );
};

export default Routes;
