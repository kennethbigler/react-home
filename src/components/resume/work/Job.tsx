import * as React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import ExpandableCard from "../../common/expandable-card";
import { Job as JobType } from "../../../constants/work";
import { getCSV, showRange } from "./job-helpers";

interface JobProps {
  job: JobType;
}

const imgStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "12em",
  height: "auto",
  float: "right",
};

const Job: React.FC<JobProps> = (props: JobProps) => {
  const { job } = props;

  const parent = job.parent ? ` (${job.parent})` : "";
  const title = `${job.company}${parent}, ${job.location}`;

  return (
    <ExpandableCard
      backgroundColor={job.color}
      subtitle={job.title}
      inverted={job.inverted}
      title={title}
    >
      <Grid size={{ xs: 12, sm: 9 }}>
        <Typography>{showRange(job.start, job.end, job.notes)}</Typography>
        {job.expr && (
          <ul>
            {job.expr.map((desc, i) => (
              <li key={`desc${i}`}>
                <Typography>{desc}</Typography>
              </li>
            ))}
          </ul>
        )}
        {job.tech && job.tech.length !== 0 && (
          <>
            <hr />
            <Typography display="inline">Technologies:&nbsp;</Typography>
            {getCSV(job.tech)}
          </>
        )}
        {job.skills && job.skills.length !== 0 && (
          <>
            <hr />
            <Typography display="inline">Skills:&nbsp;</Typography>
            {getCSV(job.skills)}
          </>
        )}
      </Grid>
      {job.src && (
        <Grid size={{ xs: 12, sm: 3 }}>
          <img alt={job.alt} src={job.src} style={imgStyle} />
        </Grid>
      )}
    </ExpandableCard>
  );
};

export default Job;
