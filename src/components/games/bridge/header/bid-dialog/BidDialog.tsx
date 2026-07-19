import { Button } from "@mui/material";
import { useState } from "react";
import InfoPopup from "../../../../common/info-popover/InfoPopup";
import BidAdvisor from "./BidAdvisor";
import BiddingTable from "./BiddingTable";
import TabGroup from "../../../../common/tab-group/TabGroup";

const BidDialog = () => {
  // Bumping this key remounts BidAdvisor, resetting its hand + auction state
  // back to the defaults — i.e. a "New Game" from the always-visible top bar.
  const [resetKey, setResetKey] = useState(0);

  return (
    <InfoPopup title="Bid" maxWidth={false}>
      <TabGroup
        label="Bid dialog tabs"
        tabBarSx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
        }}
        endAdornment={
          <Button
            onClick={() => setResetKey((k) => k + 1)}
            variant="outlined"
            size="small"
            color="secondary"
            sx={{ flexShrink: 0 }}
          >
            New Game
          </Button>
        }
        tabs={[
          { label: "Bid Advisor", content: <BidAdvisor key={resetKey} /> },
          { label: "Cheat Sheet", content: <BiddingTable /> },
        ]}
      />
    </InfoPopup>
  );
};

export default BidDialog;
