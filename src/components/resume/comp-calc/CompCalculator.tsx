import * as React from "react";
import { useAtom, useAtomValue } from "jotai";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import compCalcState, {
  CompEntry,
  compCalcRead,
} from "../../../jotai/comp-calculator-state";
import CompEntryDisplay from "./CompEntryDisplay";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import stockAtom from "../../../jotai/stock-atom";
import StockDisplay from "./StockDisplay";
import Graphs from "./graphs/Graphs";

const CompCalculator = () => {
  const [compEntries, setCompEntries] = useAtom(compCalcState);
  const compCalcEntries = useAtomValue(compCalcRead);
  const [stockEntries, setStockEntries] = useAtom(stockAtom);
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

  const removeStockEntry = (stock: string) => () => {
    const newStockEntries = { ...stockEntries };
    delete newStockEntries[stock];
    setStockEntries(newStockEntries);
    closeStockModal();
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Comp Calculator
      </Typography>
      <div
        className="flex-container"
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <StockDisplay
          stockEntries={stockEntries}
          openStockModal={openEditStock}
        />
        <div>
          <Button onClick={openNewStock}>+ Stock</Button>
          <Button onClick={openNewEntry}>+ Entry</Button>
        </div>
      </div>
      {compEntries.length > 0 && (
        <>
          <Graphs compEntries={compEntries} compCalcEntries={compCalcEntries} />
          <CompEntryDisplay
            compEntries={compEntries}
            compCalcEntries={compCalcEntries}
            onClick={openEditEntry}
          />
        </>
      )}
      <StockDialog
        open={openStock}
        price={editStockTick ? stockEntries[editStockTick] : undefined}
        stock={editStockTick}
        onClose={closeStockModal}
        addStockEntry={addStockEntry}
        removeStockEntry={removeStockEntry}
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
