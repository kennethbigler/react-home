import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import TabPanel from "../../common/tab-panel/TabPanel";
import StreamExampleV1 from "./v1/StreamExample";
import AnnouncementV2 from "./v2/StreamExample";
import a11yTabProps from "../../common/tab-panel/a11y-tab-props";

const tabPrefix = "ally-practice-tab";

const A11yPractice = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Typography variant="h2" component="h1">
        A11y Practice
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="a11y practice tab examples"
        >
          <Tab label="Chunking" {...a11yTabProps(tabPrefix, 0)} />
          <Tab label="Chunking & Debounce" {...a11yTabProps(tabPrefix, 1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0} tabPrefix={tabPrefix}>
        <StreamExampleV1 />
      </TabPanel>

      <TabPanel value={value} index={1} tabPrefix={tabPrefix}>
        <AnnouncementV2 />
      </TabPanel>
    </div>
  );
};

export default A11yPractice;
