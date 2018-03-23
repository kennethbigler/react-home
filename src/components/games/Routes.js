// React
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
// common
import { Header } from '../common/Header';
import { Menu } from './Menu';
// Components
import { PokerNight } from './poker-night/PokerNight';
import { MurderMystery } from './murder-mystery/MurderMystery';
import { GameHome } from './Home';
import { Slots } from './slots/Slots';
import { BlackJack } from './blackjack/BlackJack';
import { Poker } from './poker/Poker';
import { TicTacToe } from './tictactoe/TicTacToe';
import { Connect4 } from './connect4/Connect4';
import { DealOrNoDeal } from './deal-or-no-deal/DealOrNoDeal';
// Parents: App

const Routes = props => {
  const { match, handleNav } = props;
  const { url } = match;

  const paths = [
    { name: 'pokernight', component: PokerNight },
    { name: 'murder', component: MurderMystery },
    { name: 'slots', component: Slots },
    { name: 'blackjack', component: BlackJack },
    { name: 'tictactoe', component: TicTacToe },
    { name: 'poker', component: Poker },
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
  // PropTypes = [string, object, bool, number, func, array].isRequired
  match: PropTypes.object.isRequired,
  handleNav: PropTypes.func.isRequired
};

export default Routes;
