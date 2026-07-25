import { type Dispatch, type SetStateAction, useState } from "react";
import { useAtom } from "jotai";
import { Box, Button } from "@mui/material";
import {
  type CompEntry,
  sortCompEntriesByDate,
} from "../../../../jotai/finances-atom";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import stockAtom from "../../../../jotai/stock-atom";
import StockDisplay from "./StockDisplay";

interface CompActionsProps {
  compEntries: CompEntry[];
  editEntryIdx: number;
  openEntry: boolean;
  setCompEntries: Dispatch<SetStateAction<CompEntry[]>>;
  setEditEntryIdx: Dispatch<SetStateAction<number>>;
  setOpenEntry: Dispatch<SetStateAction<boolean>>;
}

const CompActions = ({
  compEntries,
  setCompEntries,
  openEntry,
  setOpenEntry,
  editEntryIdx,
  setEditEntryIdx,
}: CompActionsProps) => {
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
    setCompEntries(sortCompEntriesByDate(newCompEntries));
    closeEntryModal();
  };

  const removeCompEntry = () => {
    setCompEntries(compEntries.filter((_, i) => i !== editEntryIdx));
    closeEntryModal();
  };

  const addStockEntry = (stock: string, price: number) => {
    const newStockEntries = { ...stockEntries };
    if (editStockTick && editStockTick !== stock) {
      delete newStockEntries[editStockTick];
    }
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          my: 1.25,
        }}
      >
        <Box>
          <Button onClick={openNewEntry}>+ Entry</Button>
          <Button onClick={openNewStock}>+ Stock</Button>
        </Box>
        <StockDisplay
          stockEntries={stockEntries}
          openStockModal={openEditStock}
        />
      </Box>
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
          onDelete={editEntryIdx !== -1 ? removeCompEntry : undefined}
        />
      )}
    </>
  );
};

export default CompActions;
