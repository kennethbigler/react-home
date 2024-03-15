import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Header, { NavProps } from "../common/header/Header";
import Cars from "./cars";
import CompensationCalculator from "./comp-calc";
import Education from "./education";
import GitTools from "./git-tools";
import Menu from "./Menu";
import Presentations from "./presentations";
import Resume from "./resume";
import Summary from "./summary";
import TravelMap from "./travel-map";
import Work from "./work";

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
    <Routes>
      <Route path="/*" element={<Summary />} />
      <Route path="cars/*" element={<Cars />} />
      <Route path="comp/*" element={<CompensationCalculator />} />
      <Route path="education/*" element={<Education />} />
      <Route path="git-tools/*" element={<GitTools />} />
      <Route path="presentations/*" element={<Presentations />} />
      <Route path="resume/*" element={<Resume />} />
      <Route path="travel/*" element={<TravelMap />} />
      <Route path="work/*" element={<Work />} />
    </Routes>
  </>
);

export default ResumeRoutes;
