import { Typography } from "@mui/material";
import TabGroup from "../../common/tab-group/TabGroup";
import StreamExampleV1 from "./v1/StreamExample";
import AnnouncementV2 from "./v2/StreamExample";

const A11yPractice = () => (
  <div>
    <Typography variant="h2" component="h1">
      A11y Practice
    </Typography>
    <TabGroup
      label="a11y practice tab examples"
      tabs={[
        { label: "Chunking", content: <StreamExampleV1 /> },
        { label: "Chunking + Debounce", content: <AnnouncementV2 /> },
      ]}
    />
  </div>
);

export default A11yPractice;
