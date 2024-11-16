import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import compCalcState, {
  CompEntry,
  compCalcReadOnlyState,
} from "../../../recoil/comp-calculator-state";
import CompDisplay from "./CompDisplay";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import stockAtom from "../../../recoil/stock-atom";
import StockDisplay from "./StockDisplay";

const CompCalculator = () => {
  const [compEntries, setCompEntries] = useRecoilState(compCalcState);
  const compCalcEntries = useRecoilValue(compCalcReadOnlyState);
  const [stockEntries, setStockEntries] = useRecoilState(stockAtom);
  const [openEntry, setOpenEntry] = React.useState(false);
  const [openStock, setOpenStock] = React.useState(false);
  const [editEntryIdx, setEditEntryIdx] = React.useState(-1);
  const [editStockTick, setEditStockTick] = React.useState("");

  // entry open/closers
  const closeEntryModal = () => setOpenEntry(false);
  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };
  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  // stock open/closers
  const closeStockModal = () => setOpenStock(false);
  const openNewStock = () => {
    setEditStockTick("");
    setOpenStock(true);
  };
  const openEditStock = (s: string) => () => {
    setEditStockTick(s);
    setOpenStock(true);
  };

  const addCompEntry = (compEntry: CompEntry) => {
    const newCompEntries = [...compEntries];
    if (editEntryIdx === -1) {
      newCompEntries.push(compEntry);
    } else {
      newCompEntries[editEntryIdx] = compEntry;
    }
    setCompEntries(newCompEntries);
    closeEntryModal();
  };

  const addStockEntry = (stock: string, price: number) => {
    const newStockEntries = { ...stockEntries };
    newStockEntries[stock] = price;
    setStockEntries(newStockEntries);
    closeStockModal();
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Comp Calculator
      </Typography>
      <div className="flex-container">
        <StockDisplay
          stockEntries={stockEntries}
          openStockModal={openEditStock}
        />
        <div>
          <Button onClick={openNewStock}>+ Stock</Button>
          <Button onClick={openNewEntry}>+ Entry</Button>
        </div>
      </div>
      <CompDisplay
        compEntries={compEntries}
        compCalcEntries={compCalcEntries}
        stockEntries={stockEntries}
        openEntryModal={openEditEntry}
      />
      <StockDialog
        open={openStock}
        price={editStockTick ? stockEntries[editStockTick] : undefined}
        stock={editStockTick}
        onClose={closeStockModal}
        addStockEntry={addStockEntry}
      />
      <CompEntryDialog
        open={openEntry}
        compEntry={editEntryIdx !== -1 ? compEntries[editEntryIdx] : undefined}
        onClose={closeEntryModal}
        addCompEntry={addCompEntry}
      />
    </>
  );
};

export default CompCalculator;
