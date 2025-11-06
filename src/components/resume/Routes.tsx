import { lazy, Suspense, ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu";
import Header, { NavProps } from "../common/header/Header";
import LoadingSpinner from "../common/loading-spinner";

// lazy load nav elements
const Cars = lazy(() => import(/* webpackChunkName: "cars" */ "./cars"));
const CompCalculator = lazy(
  () => import(/* webpackChunkName: "comp" */ "./comp-calc"),
);
const Education = lazy(
  () => import(/* webpackChunkName: "education" */ "./education"),
);
const F1 = lazy(() => import(/* webpackChunkName: "f1" */ "./f1"));
const Presentations = lazy(
  () => import(/* webpackChunkName: "presentations" */ "./presentations"),
);
const Resume = lazy(() => import(/* webpackChunkName: "resume" */ "./resume"));
const Summary = lazy(
  () => import(/* webpackChunkName: "summary" */ "./summary"),
);
const TravelMap = lazy(
  () => import(/* webpackChunkName: "travel" */ "./travel-map"),
);
const Work = lazy(() => import(/* webpackChunkName: "work" */ "./work"));

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
        <Route path="" element={<Summary />} />
        <Route path="cars" element={<Cars />} />
        <Route path="comp" element={<CompCalculator />} />
        <Route path="education" element={<Education />} />
        <Route path="f1" element={<F1 />} />
        <Route path="presentations" element={<Presentations />} />
        <Route path="resume" element={<Resume />} />
        <Route path="travel" element={<TravelMap />} />
        <Route path="work" element={<Work />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  </>
);

export default ResumeRoutes;
