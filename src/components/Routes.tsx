import { useEffect, useLayoutEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import SectionLayout from "./common/SectionLayout";
import type { RouteMenuItem } from "./common/menu-types";
import ResumeMenu from "./resume/Menu";
import GamesMenu from "./games/Menu";
import { resumeRoutes } from "./resume/menu-items";
import { gameRoutes } from "./games/menu-items";
import { getPageTitle } from "./routeTitleUtils";

/** route "" is the section's index route */
const renderRoutes = (routes: RouteMenuItem[]) =>
  routes.map(({ Component, route }) =>
    route ? (
      <Route key={route} path={route} element={<Component />} />
    ) : (
      <Route key="home" index element={<Component />} />
    ),
  );

const RootRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname || "/";
    document.title = getPageTitle(pathname);
  }, [location.pathname]);

  useLayoutEffect(() => {
    try {
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
    } catch {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <main
        id="main-content"
        tabIndex={-1}
        style={{ padding: "1em", paddingTop: "5em" }}
      >
        <Routes>
          <Route path="games" element={<SectionLayout Menu={GamesMenu} />}>
            {renderRoutes(gameRoutes)}
            <Route path="*" element={<Navigate to="/games" replace />} />
          </Route>
          <Route path="/" element={<SectionLayout Menu={ResumeMenu} />}>
            {renderRoutes(resumeRoutes)}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};

export default RootRoutes;
