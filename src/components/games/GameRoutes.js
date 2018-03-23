// React
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
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

export const GameRoutes = props => {
  const { url } = props.match;
  return (
    <Switch>
      <Route exact path={`${url}`} component={GameHome} />
      <Route path={`${url}/tictactoe`} component={TicTacToe} />
      <Route path={`${url}/pokernight`} component={PokerNight} />
      <Route path={`${url}/blackjack`} component={BlackJack} />
      <Route path={`${url}/murder`} component={MurderMystery} />
      <Route path={`${url}/slots`} component={Slots} />
      <Route path={`${url}/poker`} component={Poker} />
      <Route path={`${url}/connect4`} component={Connect4} />
      <Route path={`${url}/deal`} component={DealOrNoDeal} />
      <Redirect from={`${url}/*`} to={`${url}`} />
      <Route component={GameHome} />
    </Switch>
  );
};

GameRoutes.propTypes = {
  // PropTypes = [string, object, bool, number, func, array].isRequired
  match: PropTypes.object.isRequired
};
