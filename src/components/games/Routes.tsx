import React from 'react';
import { Routes, Route } from 'react-router-dom';
import lazyWithPreload from '../../helpers/lazyWithPreload';
import Header, { NavProps } from '../common/header/Header';
import Menu from './Menu';
import LoadingSpinner from '../common/loading-spinner';

interface RoutesProps {
  handleNav: (loc: string) => void;
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

const GameRoutes: React.FC<RoutesProps> = ({ handleNav }) => (
  <>
    <Header handleNav={handleNav} showPlayers>
      {(onItemClick): React.ReactElement<NavProps> => <Menu onItemClick={onItemClick} />}
    </Header>
    <React.Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/*" element={<GameHome />} />
        <Route path="blackjack/*" element={<BlackJack />} />
        <Route path="connect4/*" element={<Connect4 />} />
        <Route path="deal/*" element={<DealOrNoDeal />} />
        <Route path="poker/*" element={<Poker />} />
        <Route path="slots/*" element={<Slots />} />
        <Route path="tictactoe/*" element={<TicTacToe />} />
        <Route path="yahtzee/*" element={<Yahtzee />} />
      </Routes>
    </React.Suspense>
  </>
);

export default GameRoutes;
