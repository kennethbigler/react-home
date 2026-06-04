import { Suspense, ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
import { gameRoutes } from "./menu-items";
import Header, { NavProps } from "../common/header/Header";
import LoadingSpinner from "../common/loading-spinner";

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
        {gameRoutes.map(({ Component, route }) => (
          <Route
            key={route || "games-home"}
            path={route}
            element={
              route ? <Component /> : <Component onItemClick={handleNav} />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/games" />} />
      </Routes>
    </Suspense>
  </>
);

export default GameRoutes;
