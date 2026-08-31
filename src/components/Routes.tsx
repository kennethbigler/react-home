import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import LoadingSpinner from "./common/loading-spinner";
import { getPageTitle } from "./routeTitleUtils";

// lazy load sub routers
const ResumeRoutes = lazy(() => import("./resume/Routes"));
const GameRoutes = lazy(() => import("./games/Routes"));

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
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="games/*" element={<GameRoutes />} />
            <Route path="/*" element={<ResumeRoutes />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
};

export default RootRoutes;
