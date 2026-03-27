import { Box, Tab, Tabs } from "@mui/material";
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
      </Box>

      <TabPanel value={activeTab} index={0}>
        <BidAdvisor />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <BiddingTable />
      </TabPanel>
    </InfoPopup>
  );
};

export default BidDialog;
