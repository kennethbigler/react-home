import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import TabPanel from "../../common/tab-panel/TabPanel";
import StreamExampleV1 from "./v1/StreamExample";
import AnnouncementV2 from "./v2/StreamExample";
import a11yTabProps from "../../common/tab-panel/a11y-tab-props";
import FormFocus from "./components/FormFocus";
import Combobox from "./components/Combobox";
import NotificationBanner from "./components/NotificationBanner";
import DataTable from "./components/DataTable";
import Dialog from "./components/Dialog";
import FormValidation from "./components/FormValidation";
import TabEx from "./components/TabEx";
import Search from "./components/Search";

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
          <Tab label="+ Debounce" {...a11yTabProps(tabPrefix, 1)} />
          <Tab label="Banner" {...a11yTabProps(tabPrefix, 2)} />
          <Tab label="DataTable" {...a11yTabProps(tabPrefix, 3)} />
          <Tab label="Form Focus" {...a11yTabProps(tabPrefix, 4)} />
          <Tab label="Combobox" {...a11yTabProps(tabPrefix, 5)} />
          <Tab label="Dialog" {...a11yTabProps(tabPrefix, 6)} />
          <Tab label="Validation" {...a11yTabProps(tabPrefix, 7)} />
          <Tab label="Tabs" {...a11yTabProps(tabPrefix, 8)} />
          <Tab label="Search" {...a11yTabProps(tabPrefix, 9)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0} tabPrefix={tabPrefix}>
        <StreamExampleV1 />
      </TabPanel>
      <TabPanel value={value} index={1} tabPrefix={tabPrefix}>
        <AnnouncementV2 />
      </TabPanel>
      <TabPanel value={value} index={2} tabPrefix={tabPrefix}>
        <NotificationBanner />
      </TabPanel>
      <TabPanel value={value} index={3} tabPrefix={tabPrefix}>
        <DataTable />
      </TabPanel>
      <TabPanel value={value} index={4} tabPrefix={tabPrefix}>
        <FormFocus />
      </TabPanel>
      <TabPanel value={value} index={5} tabPrefix={tabPrefix}>
        <Combobox />
      </TabPanel>
      <TabPanel value={value} index={6} tabPrefix={tabPrefix}>
        <Dialog />
      </TabPanel>
      <TabPanel value={value} index={7} tabPrefix={tabPrefix}>
        <FormValidation />
      </TabPanel>
      <TabPanel value={value} index={8} tabPrefix={tabPrefix}>
        <TabEx />
      </TabPanel>
      <TabPanel value={value} index={9} tabPrefix={tabPrefix}>
        <Search />
      </TabPanel>
    </div>
  );
};

export default A11yPractice;
