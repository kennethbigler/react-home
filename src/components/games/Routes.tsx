import { lazy, Suspense, ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
import Header, { NavProps } from "../common/header/Header";
import LoadingSpinner from "../common/loading-spinner";

// lazy load nav elements
const GameHome = lazy(() => import(/* webpackChunkName: "home" */ "./Home"));
const AreYouTheOne = lazy(
  () => import(/* webpackChunkName: "ayto" */ "./are-you-the-one"),
);
const BlackJack = lazy(
  () => import(/* webpackChunkName: "blackjack" */ "./blackjack"),
);
const BotC = lazy(() => import(/* webpackChunkName: "botc" */ "./botc"));
const Bridge = lazy(() => import(/* webpackChunkName: "bridge" */ "./bridge"));
const Connect4 = lazy(
  () => import(/* webpackChunkName: "connect4" */ "./connect4"),
);
const DealOrNoDeal = lazy(
  () => import(/* webpackChunkName: "deal" */ "./deal-or-no-deal"),
);
const FamilyFeud = lazy(
  () => import(/* webpackChunkName: "family-feud" */ "./family-feud"),
);
const ImperialAssault = lazy(
  () => import(/* webpackChunkName: "family-feud" */ "./imperial-assault"),
);
const MurderMystery = lazy(
  () => import(/* webpackChunkName: "murder" */ "./murder-mystery"),
);
const Poker = lazy(() => import(/* webpackChunkName: "poker" */ "./poker"));
const Spades = lazy(() => import(/* webpackChunkName: "spades" */ "./spades"));
const Slots = lazy(() => import(/* webpackChunkName: "slots" */ "./slots"));
const TicTacToe = lazy(
  () => import(/* webpackChunkName: "tictactoe" */ "./tictactoe"),
);
const TypeChecker = lazy(
  () => import(/* webpackChunkName: "type-checker" */ "./type-checker"),
);
const Werewolf = lazy(
  () => import(/* webpackChunkName: "werewolf" */ "./werewolf"),
);
const Yahtzee = lazy(
  () => import(/* webpackChunkName: "yahtzee" */ "./yahtzee"),
);

interface RoutesProps {
  handleNav: (loc: string) => void;
}

const GameRoutes = ({ handleNav }: RoutesProps) => (
  <>
    <Header handleNav={handleNav}>
      {(onItemClick): ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  </>
);

export default GameRoutes;
