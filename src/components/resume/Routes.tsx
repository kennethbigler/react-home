import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Header, { NavProps } from "../common/header/Header";
import Menu from "./Menu";
import Summary from "./summary";
import Work from "./work";
import Education from "./education";
import TravelMap from "./travel-map";
import Resume from "./resume";
import GitTools from "./git-tools";
import Cars from "./cars";

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
      <Route path="education/*" element={<Education />} />
      <Route path="git-tools/*" element={<GitTools />} />
      <Route path="resume/*" element={<Resume />} />
      <Route path="travel/*" element={<TravelMap />} />
      <Route path="work/*" element={<Work />} />
    </Routes>
  </>
);

export default ResumeRoutes;
