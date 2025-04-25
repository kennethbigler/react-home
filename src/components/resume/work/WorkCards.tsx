import Typography from "@mui/material/Typography";
import Job from "./Job";
import { Job as JobType } from "../../../constants/work";

interface WorkCardsProps {
  workExp: JobType[];
  workTypes: string[];
}

const WorkCards = ({ workExp, workTypes }: WorkCardsProps) => (
  <>
    {workTypes.map((type) => (
      <div key={type} style={{ marginTop: 25 }}>
        <Typography
          variant="h3"
          component="h2"
          style={{ textTransform: "capitalize" }}
        >
          {type}
        </Typography>
        <hr aria-hidden />
        {workExp.map(
          (job) => job.type === type && <Job key={job.company} job={job} />,
        )}
      </div>
    ))}
  </>
);

export default WorkCards;
