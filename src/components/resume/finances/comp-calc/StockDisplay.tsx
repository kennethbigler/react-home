import { Chip } from "@mui/material";
import usDollar from "@/apis/usDollar";
import type { StockState } from "@/jotai/stock-atom";

interface StockEntryProps {
  stockEntries: StockState;
  openStockModal: (s: string) => () => void;
}

const StockDisplay = ({ stockEntries, openStockModal }: StockEntryProps) => (
  <div>
    {Object.keys(stockEntries).map((stockKey) => {
      const label = `${stockKey}: ${usDollar.format(stockEntries[stockKey])}`;
      return (
        <Chip
          key={stockKey}
          color="primary"
          label={label}
          aria-label={`Edit ${label}`}
          onClick={openStockModal(stockKey)}
          sx={{ margin: 0.5, fontWeight: "bold" }}
        />
      );
    })}
  </div>
);

export default StockDisplay;
