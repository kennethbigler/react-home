import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
import Header, { NavProps } from "../common/header/Header";
import LoadingSpinner from "../common/loading-spinner";

// lazy load nav elements
const Summary = React.lazy(
  () => import(/* webpackChunkName: "summary" */ "./summary"),
);
const Cars = React.lazy(() => import(/* webpackChunkName: "cars" */ "./cars"));
const CompCalculator = React.lazy(
  () => import(/* webpackChunkName: "comp" */ "./comp-calc"),
);
const Education = React.lazy(
  () => import(/* webpackChunkName: "education" */ "./education"),
);
const Presentations = React.lazy(
  () => import(/* webpackChunkName: "presentations" */ "./presentations"),
);
const Resume = React.lazy(
  () => import(/* webpackChunkName: "resume" */ "./resume"),
);
const TravelMap = React.lazy(
  () => import(/* webpackChunkName: "travel" */ "./travel-map"),
);
const Work = React.lazy(() => import(/* webpackChunkName: "work" */ "./work"));

interface RoutesProps {
  handleNav: (loc: string) => void;
}

const ResumeRoutes: React.FC<RoutesProps> = ({ handleNav }) => (
  <>
    <Header handleNav={handleNav}>
      {(onItemClick): React.ReactElement<NavProps> => (
        <Menu onItemClick={onItemClick} />
      )}
    </Header>
    <React.Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="" element={<Summary />} />
        <Route path="cars" element={<Cars />} />
        <Route path="comp" element={<CompCalculator />} />
        <Route path="education" element={<Education />} />
        <Route path="presentations" element={<Presentations />} />
        <Route path="resume" element={<Resume />} />
        <Route path="travel" element={<TravelMap />} />
        <Route path="work" element={<Work />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  </>
);

export default ResumeRoutes;
