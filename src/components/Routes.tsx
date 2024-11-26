import * as React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./common/loading-spinner";

// lazy load sub routers
const ResumeRoutes = React.lazy(
  () => import(/* webpackChunkName: "resume" */ "./resume/Routes"),
);
const GameRoutes = React.lazy(
  () => import(/* webpackChunkName: "games" */ "./games/Routes"),
);

const RootRoutes = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNav = (loc: string) => {
    if (loc !== pathname) {
      navigate(loc)?.catch((reason) => console.log(reason));
    }
  };

  return (
    <main style={{ padding: "1em", paddingTop: "5em" }}>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="games/*"
            element={<GameRoutes handleNav={handleNav} />}
          />
          <Route path="/*" element={<ResumeRoutes handleNav={handleNav} />} />
        </Routes>
      </React.Suspense>
    </main>
  );
};

export default RootRoutes;
