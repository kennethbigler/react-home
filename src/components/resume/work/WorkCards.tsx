import React from "react";
import startCase from "lodash/startCase";
import { Typography } from "@mui/material";
import Job from "./Job";
import { Job as JobType } from "../../../constants/work";

interface WorkCardsProps {
  workExp: JobType[];
  workTypes: string[];
}

const WorkCards: React.FC<WorkCardsProps> = ({
  workExp,
  workTypes,
}: WorkCardsProps) => (
  <>
    {workTypes.map((type) => (
      <div key={type} style={{ marginTop: 25 }}>
        <Typography variant="h3">{`${startCase(type)} Experience`}</Typography>
        <hr />
        {workExp.map(
          (job) => job.type === type && <Job key={job.company} job={job} />
        )}
      </div>
    ))}
  </>
);

export default WorkCards;
