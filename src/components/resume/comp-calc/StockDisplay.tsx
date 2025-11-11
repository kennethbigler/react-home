import { Chip } from "@mui/material";
import usDollar from "../../../apis/usDollar";
import { StockState } from "../../../jotai/stock-atom";

interface StockEntryProps {
  stockEntries: StockState;
  openStockModal: (s: string) => () => void;
}

const StockDisplay = ({ stockEntries, openStockModal }: StockEntryProps) => (
  <div>
    {Object.keys(stockEntries).map((stockKey, i) => (
      <Chip
        key={`stock-entry-${i}`}
        color="primary"
        label={`${stockKey}: ${usDollar.format(stockEntries[stockKey])}`}
        onClick={openStockModal(stockKey)}
        sx={{ margin: 0.5, fontWeight: "bold" }}
      />
    ))}
  </div>
);

export default StockDisplay;
