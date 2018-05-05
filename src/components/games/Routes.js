// React
import React from 'react';
import types from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// common
import { Header } from '../common/Header';
import { Menu } from './Menu';
// Components
import { PokerNight } from './poker-night/';
import { MurderMystery } from './murder-mystery/';
import { GameHome } from './Home';
import { Slots } from './slots/';
import { BlackJack } from './blackjack/';
// import { Poker } from './poker/';
import { TicTacToe } from './tictactoe/';
import { Connect4 } from './connect4/';
import { DealOrNoDeal } from './deal-or-no-deal/';
// Parents: App

export const Routes = props => {
  const { match, handleNav } = props;
  const { url } = match;

  const paths = [
    { name: 'pokernight', component: PokerNight },
    { name: 'murder', component: MurderMystery },
    { name: 'slots', component: Slots },
    { name: 'blackjack', component: BlackJack },
    { name: 'tictactoe', component: TicTacToe },
    // { name: 'poker', component: Poker },
    { name: 'connect4', component: Connect4 },
    { name: 'deal', component: DealOrNoDeal }
  ].reduce((acc, obj) => {
    const { name, component } = obj;
    const path = `${url}/${name}`;
    acc.push(<Route key={`${path}r`} exact {...{ path, component }} />);
    acc.push(<Redirect key={`${path}d`} from={`${path}*`} to={path} />);
    return acc;
  }, []);

  return (
    <div className="games-app">
      <Header handleNav={handleNav}>
        <Menu />
      </Header>
      <Switch>
        <Route exact path={`${url}`} component={GameHome} />
        {paths}
        <Redirect from={`${url}/*`} to={`${url}`} />
        <Route component={GameHome} />
      </Switch>
    </div>
  );
};

Routes.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  match: types.shape({
    url: types.string.isRequired
  }).isRequired,
  handleNav: types.func.isRequired
};
