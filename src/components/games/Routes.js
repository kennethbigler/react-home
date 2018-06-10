// React
import React from 'react';
import types from 'prop-types';
import {Switch, Route, Redirect} from 'react-router-dom';
// common
import {Header} from '../common/Header';
import {Menu} from './Menu';
// Components
import {BlackJack} from './blackjack/';
import {Connect4} from './connect4/';
import {DealOrNoDeal} from './deal-or-no-deal/';
import {GameHome} from './Home';
import {MurderMystery} from './murder-mystery/';
import {Poker} from './poker/';
import {PokerNight} from './poker-night/';
import {Slots} from './slots/';
import {TicTacToe} from './tictactoe/';
// functions
import reduce from 'lodash/reduce';
// Parents: App

export const Routes = (props) => {
  const {match, handleNav} = props;
  const {url} = match;

  const paths = reduce(
    [
      {name: 'blackjack', component: BlackJack},
      {name: 'connect4', component: Connect4},
      {name: 'deal', component: DealOrNoDeal},
      {name: 'murder', component: MurderMystery},
      {name: 'poker', component: Poker},
      {name: 'pokernight', component: PokerNight},
      {name: 'slots', component: Slots},
      {name: 'tictactoe', component: TicTacToe},
    ],
    (acc, obj) => {
      const {name, component} = obj;
      const path = `${url}/${name}`;
      acc.push(<Route exact key={`${path}r`} {...{path, component}} />);
      acc.push(<Redirect from={`${path}*`} key={`${path}d`} to={path} />);
      return acc;
    },
    []
  );

  return (
    <div className="games-app">
      <Header handleNav={handleNav}>
        <Menu />
      </Header>
      <Switch>
        <Route component={GameHome} exact path={`${url}`} />
        {paths}
        <Redirect from={`${url}/*`} to={`${url}`} />
        <Route component={GameHome} />
      </Switch>
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
