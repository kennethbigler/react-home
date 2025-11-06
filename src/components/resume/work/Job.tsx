import { CSSProperties } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ExpandableCard from "../../common/expandable-card";
import { Job as JobType } from "../../../constants/work";
import { getCSV } from "./jobHelpers";

interface JobProps {
  job: JobType;
  fullWidth?: boolean;
  triple?: boolean;
}

const imgStyle: CSSProperties = {
  width: "100%",
  maxWidth: "12em",
  height: "auto",
  float: "right",
};

const Job = ({ job, fullWidth, triple }: JobProps) => (
  <Grid size={{ xs: 12, lg: fullWidth ? 12 : 6, xxl: triple ? 4 : undefined }}>
    <ExpandableCard
      backgroundColor={job.color}
      subtitle={job.title}
      inverted={job.inverted}
      title={`${job.company}${job.parent ? ` (${job.parent})` : ""}, ${job.location}`}
    >
      <Grid size={{ xs: 12, sm: 9 }}>
        <Typography>{job.time}</Typography>
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
            <hr aria-hidden />
            <Typography display="inline">Technologies:&nbsp;</Typography>
            {getCSV(job.tech)}
          </>
        )}
      </Grid>
      {job.src && (
        <Grid size={{ xs: 12, sm: 3 }}>
          <img alt={job.alt} src={job.src} style={imgStyle} />
        </Grid>
      )}
    </ExpandableCard>
  </Grid>
);

export default Job;
