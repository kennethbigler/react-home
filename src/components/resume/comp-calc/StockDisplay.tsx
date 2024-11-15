import * as React from "react";
import Chip from "@mui/material/Chip";
import usDollar from "../../../apis/usdFormatter";
import { StockState } from "../../../recoil/stock-atom";

interface StockEntryProps {
  stockEntries: StockState;
  openStockModal: (s: string) => () => void;
}

const StockDisplay: React.FC<StockEntryProps> = ({
  stockEntries,
  openStockModal,
}) => (
  <>
    {Object.keys(stockEntries).map((stockKey, i) => (
      <Chip
        key={`stock-entry-${i}`}
        color="primary"
        label={`${stockKey}: ${usDollar.format(stockEntries[stockKey])}`}
        onClick={openStockModal(stockKey)}
      />
    ))}
  </>
);

export default StockDisplay;
