import { Suspense, ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
import { resumeRoutes } from "./menu-items";
import Header, { NavProps } from "../common/header/Header";
import LoadingSpinner from "../common/loading-spinner";

interface RoutesProps {
  handleNav: (loc: string) => void;
}

const ResumeRoutes = ({ handleNav }: RoutesProps) => (
  <>
    <Header handleNav={handleNav}>
      {(onItemClick): ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {resumeRoutes.map(({ Component, route }) => (
          <Route
            key={route || "summary"}
            path={route}
            element={<Component />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  </>
);

export default ResumeRoutes;
