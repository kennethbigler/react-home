import { Box, Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import InfoPopup from "../../../../common/info-popover/InfoPopup";
import BidAdvisor from "./BidAdvisor";
import BiddingTable from "./BiddingTable";

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bid-dialog-tabpanel-${index}`}
      aria-labelledby={`bid-dialog-tab-${index}`}
    >
      <Box sx={{ pt: 2 }}>{children}</Box>
    </div>
  );
}

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
          <Tab
            label="Bid Advisor"
            id="bid-dialog-tab-0"
            aria-controls="bid-dialog-tabpanel-0"
          />
          <Tab
            label="Cheat Sheet"
            id="bid-dialog-tab-1"
            aria-controls="bid-dialog-tabpanel-1"
          />
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

      <TabPanel value={activeTab} index={0}>
        <BidAdvisor key={resetKey} />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <BiddingTable />
      </TabPanel>
    </InfoPopup>
  );
};

export default BidDialog;
