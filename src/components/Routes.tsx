import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./common/loading-spinner";
import { catchErr } from "../apis/catchErr";

const BASE_TITLE = "Ken Bigler's Website";

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
};

/** Map path segments to page titles for WCAG 2.4.2 (Page Titled) */
const getPageTitle = (pathname: string): string => {
  const segment = pathname.replace(/^#\/?/, "").split("/").filter(Boolean)[0];
  const sub = pathname.replace(/^#\/?/, "").split("/").filter(Boolean)[1];
  let page: string;
  if (!segment) {
    page = BASE_TITLE;
  } else if (segment === "games") {
    page = sub ? `${toTitleCase(sub.replace(/-/g, " "))} | Game` : "Games";
  } else {
    page = toTitleCase(segment.replace(/-/g, " "));
  }
  return page === BASE_TITLE ? BASE_TITLE : `${page} | ${BASE_TITLE}`;
};

// lazy load sub routers
const ResumeRoutes = lazy(
  () => import(/* webpackChunkName: "resume" */ "./resume/Routes"),
);
const GameRoutes = lazy(
  () => import(/* webpackChunkName: "games" */ "./games/Routes"),
);

const RootRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname || "/";
    document.title = getPageTitle(pathname);
  }, [location.pathname]);

  const handleNav = (loc: string) => {
    navigate(loc)?.catch(catchErr);
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
