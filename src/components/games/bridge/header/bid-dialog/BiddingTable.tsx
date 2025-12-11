import { Table } from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo } from "react";
import BalancedHands from "./BalancedHands";
import UnbalancedHands from "./UnbalancedHands";

const BiddingTable = memo(() => (
  <Table
    size="small"
    sx={{
      border: `3px solid ${grey[800]}`,
      "& .MuiTableCell-root": {
        border: `3px solid ${grey[800]}`,
        padding: "4px 2px",
      },
    }}
  >
    <BalancedHands />
    <UnbalancedHands />
  </Table>
));

BiddingTable.displayName = "BiddingTable";

export default BiddingTable;
