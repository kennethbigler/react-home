import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import CustomTabPanel from "./CustomTabPanel";
import StreamExampleV1 from "./v1/StreamExample";
import AnnouncementV2 from "./v2/StreamExample";

const tabPrefix = "ally-practice-tab";

function a11yProps(index: number) {
  return {
    id: `${tabPrefix}-${index}`,
    "aria-controls": `${tabPrefix}panel-${index}`,
  };
}

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
          <Tab label="Chunking" {...a11yProps(0)} />
          <Tab label="Chunking + Debounce" {...a11yProps(1)} />
          <Tab label="TBD" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <StreamExampleV1 />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AnnouncementV2 />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <h2>TBD</h2>
      </CustomTabPanel>
    </div>
  );
};

export default A11yPractice;
