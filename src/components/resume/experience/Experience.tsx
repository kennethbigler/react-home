import { memo } from "react";
import { Typography } from "@mui/material";
import { work, volunteer } from "@/constants/work";
import WorkCards from "./WorkCards";
import DegreeCards from "./DegreeCards";
import classes, { presentations, hackathons } from "@/constants/classes";
import TabGroup from "@/components/common/tab-group/TabGroup";

const Experience = memo(() => (
  <>
    <Typography variant="h2" component="h1">
      Experience
    </Typography>
    <TabGroup
      label="Experience"
      tabs={[
        {
          label: "Presentations",
          content: (
            <DegreeCards
              title="Presentations"
              degrees={presentations}
              fullWidth
            />
          ),
        },
        {
          label: "Work",
          content: <WorkCards title="Work" jobs={work} />,
        },
        {
          label: "Hackathons",
          content: <DegreeCards title="Hackathons" degrees={hackathons} />,
        },
        {
          label: "Education",
          content: (
            <DegreeCards title="Education" degrees={classes} fullWidth />
          ),
        },
        {
          label: "Volunteer",
          content: <WorkCards title="Volunteer" jobs={volunteer} />,
        },
      ]}
    />
  </>
));

Experience.displayName = "Experience";

export default Experience;
