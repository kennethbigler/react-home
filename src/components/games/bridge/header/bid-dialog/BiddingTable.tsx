import { Table } from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo } from "react";
import BalancedHands from "./BalancedHands";
import UnbalancedHands from "./UnbalancedHands";
import Overcalls from "./Overcalls";
import Overleaf from "./Overleaf";

const BiddingTable = memo(() => (
  <Table
    size="small"
    sx={{
      border: `2px solid ${grey[800]}`,
      "& .MuiTableCell-root": {
        border: `2px solid ${grey[800]}`,
        padding: "4px 2px",
      },
    }}
  >
    <BalancedHands />
    <UnbalancedHands />
    <Overcalls />
    <Overleaf />
  </Table>
));

BiddingTable.displayName = "BiddingTable";

export default BiddingTable;
