import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
import Header, { NavProps } from "../common/header/Header";
import LoadingSpinner from "../common/loading-spinner";

// lazy load nav elements
const GameHome = React.lazy(
  () => import(/* webpackChunkName: "home" */ "./Home"),
);
const AreYouTheOne = React.lazy(
  () => import(/* webpackChunkName: "ayto" */ "./are-you-the-one"),
);
const BlackJack = React.lazy(
  () => import(/* webpackChunkName: "blackjack" */ "./blackjack"),
);
const BotC = React.lazy(() => import(/* webpackChunkName: "botc" */ "./botc"));
const Bridge = React.lazy(
  () => import(/* webpackChunkName: "bridge" */ "./bridge"),
);
const Connect4 = React.lazy(
  () => import(/* webpackChunkName: "connect4" */ "./connect4"),
);
const DealOrNoDeal = React.lazy(
  () => import(/* webpackChunkName: "deal" */ "./deal-or-no-deal"),
);
const FamilyFeud = React.lazy(
  () => import(/* webpackChunkName: "family-feud" */ "./family-feud"),
);
const ImperialAssault = React.lazy(
  () => import(/* webpackChunkName: "family-feud" */ "./imperial-assault"),
);
const MurderMystery = React.lazy(
  () => import(/* webpackChunkName: "murder" */ "./murder-mystery"),
);
const Poker = React.lazy(
  () => import(/* webpackChunkName: "poker" */ "./poker"),
);
const Spades = React.lazy(
  () => import(/* webpackChunkName: "spades" */ "./spades"),
);
const Slots = React.lazy(
  () => import(/* webpackChunkName: "slots" */ "./slots"),
);
const TicTacToe = React.lazy(
  () => import(/* webpackChunkName: "tictactoe" */ "./tictactoe"),
);
const TypeChecker = React.lazy(
  () => import(/* webpackChunkName: "type-checker" */ "./type-checker"),
);
const Werewolf = React.lazy(
  () => import(/* webpackChunkName: "werewolf" */ "./werewolf"),
);
const Yahtzee = React.lazy(
  () => import(/* webpackChunkName: "yahtzee" */ "./yahtzee"),
);

interface RoutesProps {
  handleNav: (loc: string) => void;
}

const GameRoutes = ({ handleNav }: RoutesProps) => (
  <>
    <Header handleNav={handleNav}>
      {(onItemClick): React.ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <React.Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="" element={<GameHome onItemClick={handleNav} />} />
        <Route path="are-you-the-one" element={<AreYouTheOne />} />
        <Route path="botc" element={<BotC />} />
        <Route path="bridge" element={<Bridge />} />
        <Route path="blackjack" element={<BlackJack />} />
        <Route path="connect4" element={<Connect4 />} />
        <Route path="deal" element={<DealOrNoDeal />} />
        <Route path="family-feud" element={<FamilyFeud />} />
        <Route path="imperial-assault" element={<ImperialAssault />} />
        <Route path="murder" element={<MurderMystery />} />
        <Route path="poker" element={<Poker />} />
        <Route path="spades" element={<Spades />} />
        <Route path="slots" element={<Slots />} />
        <Route path="tictactoe" element={<TicTacToe />} />
        <Route path="types" element={<TypeChecker />} />
        <Route path="werewolf" element={<Werewolf />} />
        <Route path="yahtzee" element={<Yahtzee />} />
        <Route path="*" element={<Navigate to="/games" />} />
      </Routes>
    </React.Suspense>
  </>
);

export default GameRoutes;
