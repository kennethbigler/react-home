import { Box, Tab, Tabs, Typography } from "@mui/material";
import CompCalculator from "./comp-calc/CompCalculator";
import TabPanel from "../../common/tab-panel/TabPanel";
import a11yTabProps from "../../common/tab-panel/a11y-tab-props";
import { useState } from "react";
import Budgeting from "./budgeting/Budgeting";

const tabPrefix = "finance-tab";

const Finances = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Typography variant="h2" component="h1">
        Finances
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Finances sections"
        >
          <Tab label="Comp Calculator" {...a11yTabProps(tabPrefix, 0)} />
          <Tab label="Budgeting" {...a11yTabProps(tabPrefix, 1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0} tabPrefix={tabPrefix}>
        <CompCalculator />
      </TabPanel>

      <TabPanel value={value} index={1} tabPrefix={tabPrefix}>
        <Budgeting />
      </TabPanel>
    </div>
  );
};

export default Finances;
