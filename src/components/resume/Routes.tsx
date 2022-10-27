import * as React from "react";
import { Routes, Route } from "react-router-dom";
import lazyWithPreload from "../../helpers/lazyWithPreload";
import Header, { NavProps } from "../common/header/Header";
import Menu from "./Menu";
import LoadingSpinner from "../common/loading-spinner";

// lazy load page components
const Summary = lazyWithPreload(
  import(/* webpackChunkName: "r_summary" */ "./summary")
);
const Work = lazyWithPreload(import(/* webpackChunkName: "r_work" */ "./work"));
const Education = lazyWithPreload(
  import(/* webpackChunkName: "r_education" */ "./education")
);
const TravelMap = lazyWithPreload(
  import(/* webpackChunkName: "r_travel" */ "./travel-map")
);
const Resume = lazyWithPreload(
  import(/* webpackChunkName: "r_resume" */ "./resume")
);
const GitTools = lazyWithPreload(
  import(/* webpackChunkName: "r_git" */ "./git-tools")
);
const MurderMystery = lazyWithPreload(
  import(/* webpackChunkName: "r_mystery" */ "./murder-mystery")
);
const GraphQL = lazyWithPreload(
  import(/* webpackChunkName: "r_graphql" */ "./graphql")
);
const Cars = lazyWithPreload(import(/* webpackChunkName: "r_cars" */ "./cars"));

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
        <Route path="/*" element={<Summary />} />
        <Route path="cars/*" element={<Cars />} />
        <Route path="education/*" element={<Education />} />
        <Route path="git-tools/*" element={<GitTools />} />
        <Route path="graphql/*" element={<GraphQL />} />
        <Route path="murder/*" element={<MurderMystery />} />
        <Route path="resume/*" element={<Resume />} />
        <Route path="travel/*" element={<TravelMap />} />
        <Route path="work/*" element={<Work />} />
      </Routes>
    </React.Suspense>
  </>
);

export default ResumeRoutes;
