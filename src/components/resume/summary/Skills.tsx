import React from "react";
import Chip from "@mui/material/Chip";
import { Typography } from "@mui/material";
import ExpandableCard from "../../common/expandable-card";
import { techSummary, skillSummary } from "../../../constants/work";

const chipStyles: React.CSSProperties = { marginRight: 5, marginTop: 5 };
const sidePadding: React.CSSProperties = { paddingLeft: 20, paddingRight: 20 };

const getCSV = (arr: string[]): React.ReactNodeArray =>
  arr.map((tech) => <Chip key={tech} label={tech} style={chipStyles} />);

const Skills: React.FC = React.memo(() => (
  <ExpandableCard title="Skills">
    <div style={sidePadding}>
      <Typography variant="h4">Summary of Skills:</Typography>
      <ul>
        <li>
          <Typography>
            Developing useful, multi-platform software tools and creating user
            interfaces
          </Typography>
        </li>
        <li>
          <Typography>
            Managing international team members, strong communication skills,
            team player, and detail-oriented
          </Typography>
        </li>
        <li>
          <Typography>
            Gathering requirements, scheduling, prioritizing goals, documenting
            processes, and creating project standards
          </Typography>
        </li>
        <li>
          <Typography>
            Designing, building, and overseeing production of large and small
            Internet and Intranet sites
          </Typography>
        </li>
      </ul>
      <hr />
      <Typography variant="h4">Technologies:</Typography>
      {getCSV(techSummary)}
      <hr />
      <Typography variant="h4">Skills:</Typography>
      {getCSV(skillSummary)}
    </div>
  </ExpandableCard>
));

export default Skills;
