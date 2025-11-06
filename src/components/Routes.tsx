import { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoadingSpinner from "./common/loading-spinner";

// lazy load sub routers
const ResumeRoutes = lazy(
  () => import(/* webpackChunkName: "resume" */ "./resume/Routes"),
);
const GameRoutes = lazy(
  () => import(/* webpackChunkName: "games" */ "./games/Routes"),
);

const RootRoutes = () => {
  const navigate = useNavigate();

  const handleNav = (loc: string) => {
    // eslint-disable-next-line no-console
    navigate(loc)?.catch((reason) => console.error(reason));
  };

  return (
    <main style={{ padding: "1em", paddingTop: "5em" }}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="games/*"
            element={<GameRoutes handleNav={handleNav} />}
          />
          <Route path="/*" element={<ResumeRoutes handleNav={handleNav} />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default RootRoutes;
