import { Table } from "@mui/material";
import { grey } from "@mui/material/colors";
import BalancedHands from "./BalancedHands";
import UnbalancedHands from "./UnbalancedHands";
import Overcalls from "./Overcalls";
import Overleaf from "./Overleaf";

const tableStyles = {
  border: `2px solid ${grey[800]}`,
  "& .MuiTableCell-root": {
    border: `2px solid ${grey[800]}`,
    padding: "4px 2px",
  },
};

const BiddingTable = () => (
  <>
    <Table size="small" sx={tableStyles}>
      <BalancedHands />
      <UnbalancedHands />
    </Table>
    <Table size="small" sx={tableStyles}>
      <Overcalls />
      <Overleaf />
    </Table>
  </>
);

export default BiddingTable;
