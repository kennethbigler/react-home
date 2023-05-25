import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Header, { NavProps } from "../common/header/Header";
import Menu from "./Menu";
import GameHome from "./Home";
import BlackJack from "./blackjack";
import Connect4 from "./connect4";
import DealOrNoDeal from "./deal-or-no-deal";
import Poker from "./poker";
import Slots from "./slots";
import TicTacToe from "./tictactoe";
import Yahtzee from "./yahtzee";
import FamilyFeud from "./family-feud";
import AreYouTheOne from "./are-you-the-one";
import TypeChecker from "./type-checker";

interface RoutesProps {
  handleNav: (loc: string) => void;
}

const GameRoutes: React.FC<RoutesProps> = ({ handleNav }) => (
  <>
    <Header handleNav={handleNav} showPlayers>
      {(onItemClick): React.ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <Routes>
      <Route path="/*" element={<GameHome onItemClick={handleNav} />} />
      <Route path="are-you-the-one/*" element={<AreYouTheOne />} />
      <Route path="blackjack/*" element={<BlackJack />} />
      <Route path="connect4/*" element={<Connect4 />} />
      <Route path="deal/*" element={<DealOrNoDeal />} />
      <Route path="family-feud/*" element={<FamilyFeud />} />
      <Route path="poker/*" element={<Poker />} />
      <Route path="slots/*" element={<Slots />} />
      <Route path="tictactoe/*" element={<TicTacToe />} />
      <Route path="types/*" element={<TypeChecker />} />
      <Route path="yahtzee/*" element={<Yahtzee />} />
    </Routes>
  </>
);

export default GameRoutes;
