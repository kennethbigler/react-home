import { Dispatch, SetStateAction, useState } from "react";
import { useAtom } from "jotai";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CompEntry } from "../../../jotai/comp-calculator-atom";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import stockAtom from "../../../jotai/stock-atom";
import StockDisplay from "./StockDisplay";

interface CompHeaderProps {
  compEntries: CompEntry[];
  editEntryIdx: number;
  openEntry: boolean;
  setCompEntries: (c: CompEntry[]) => void;
  setEditEntryIdx: Dispatch<SetStateAction<number>>;
  setOpenEntry: Dispatch<SetStateAction<boolean>>;
}

const CompHeader = ({
  compEntries,
  setCompEntries,
  openEntry,
  setOpenEntry,
  editEntryIdx,
  setEditEntryIdx,
}: CompHeaderProps) => {
  const [stockEntries, setStockEntries] = useAtom(stockAtom);
  const [openStock, setOpenStock] = useState(false);
  const [editStockTick, setEditStockTick] = useState("");

  // entry open/closers
  const closeEntryModal = () => setOpenEntry(false);
  const openNewEntry = () => {
    setEditEntryIdx(-1);
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
      {openStock && (
        <StockDialog
          open={openStock}
          price={editStockTick ? stockEntries[editStockTick] : undefined}
          stock={editStockTick}
          onClose={closeStockModal}
          addStockEntry={addStockEntry}
          removeStockEntry={removeStockEntry}
        />
      )}
      {openEntry && (
        <CompEntryDialog
          open={openEntry}
          compEntry={
            editEntryIdx !== -1 ? compEntries[editEntryIdx] : undefined
          }
          onClose={closeEntryModal}
          addCompEntry={addCompEntry}
        />
      )}
    </>
  );
};

export default CompHeader;
