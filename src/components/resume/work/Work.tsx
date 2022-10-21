import React from "react";
import Typography from "@mui/material/Typography";
import TimelineCard from "../../common/timeline-card";
import ExpandableCard from "../../common/expandable-card";
import workExp, { VOLUNTEER, WORK } from "../../../constants/work";
import LoadingSpinner from "../../common/loading-spinner";
import WorkCards from "./WorkCards";

const TechBarChart = React.lazy(
  () => import(/* webpackChunkName: "r_work_bar_chart" */ "./TechBarChart")
);

/* Work  ->  TechBarChart
 *      |->  WorkCards  ->  Job */
const Work: React.FC = React.memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <TimelineCard data={workExp} title="Work Timeline" />
    <ExpandableCard title="Programming Language Timeline (Professional Use)">
      <React.Suspense fallback={<LoadingSpinner />}>
        <TechBarChart />
      </React.Suspense>
    </ExpandableCard>
    <WorkCards workExp={workExp} workTypes={[WORK, VOLUNTEER]} />
  </>
));

export default Work;
