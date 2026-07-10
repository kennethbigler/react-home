import { Box, Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import InfoPopup from "../../../../common/info-popover/InfoPopup";
import BidAdvisor from "./BidAdvisor";
import BiddingTable from "./BiddingTable";
import TabPanel from "../../../../common/tab-panel/TabPanel";
import a11yTabProps from "../../../../common/tab-panel/a11y-tab-props";

const tabPrefix = "bid-dialog-tab";

const BidDialog = () => {
  const [activeTab, setActiveTab] = useState(0);
  // Bumping this key remounts BidAdvisor, resetting its hand + auction state
  // back to the defaults — i.e. a "New Game" from the always-visible top bar.
  const [resetKey, setResetKey] = useState(0);

  return (
    <InfoPopup title="Bid" maxWidth={false}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pr: 1,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v: number) => setActiveTab(v)}
          aria-label="Bid dialog tabs"
        >
          <Tab label="Bid Advisor" {...a11yTabProps(tabPrefix, 0)} />
          <Tab label="Cheat Sheet" {...a11yTabProps(tabPrefix, 1)} />
        </Tabs>
        <Button
          onClick={() => setResetKey((k) => k + 1)}
          variant="outlined"
          size="small"
          color="secondary"
          sx={{ flexShrink: 0 }}
        >
          New Game
        </Button>
      </Box>

      <TabPanel value={activeTab} index={0} tabPrefix={tabPrefix}>
        <BidAdvisor key={resetKey} />
      </TabPanel>

      <TabPanel value={activeTab} index={1} tabPrefix={tabPrefix}>
        <BiddingTable />
      </TabPanel>
    </InfoPopup>
  );
};

export default BidDialog;
