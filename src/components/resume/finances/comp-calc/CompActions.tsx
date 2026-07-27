import { useState, type Dispatch, type SetStateAction } from "react";
import { useAtom } from "jotai";
import { Box, Button } from "@mui/material";
import {
  type CompEntry,
  sortCompEntriesByDate,
} from "../../../../jotai/finances-atom";
import stockAtom from "../../../../jotai/stock-atom";
import type { EntryDialogState } from "../shared/useEntryDialog";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import StockDisplay from "./StockDisplay";

interface CompActionsProps {
  compEntries: CompEntry[];
  setCompEntries: Dispatch<SetStateAction<CompEntry[]>>;
  entryDialog: EntryDialogState;
}

const CompActions = ({
  compEntries,
  setCompEntries,
  entryDialog,
}: CompActionsProps) => {
  const [stockEntries, setStockEntries] = useAtom(stockAtom);
  const [openStock, setOpenStock] = useState(false);
  const [editStockTick, setEditStockTick] = useState("");

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
    if (entryDialog.editIdx === -1) {
      newCompEntries.push(compEntry);
    } else {
      newCompEntries[entryDialog.editIdx] = compEntry;
    }
    setCompEntries(sortCompEntriesByDate(newCompEntries));
    entryDialog.close();
  };

  const removeCompEntry = () => {
    setCompEntries(compEntries.filter((_, i) => i !== entryDialog.editIdx));
    entryDialog.close();
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

  const isEditingEntry = entryDialog.editIdx !== -1;

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
          <Button onClick={entryDialog.openNew}>+ Entry</Button>
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
      {entryDialog.open && (
        <CompEntryDialog
          open={entryDialog.open}
          compEntry={
            isEditingEntry ? compEntries[entryDialog.editIdx] : undefined
          }
          onClose={entryDialog.close}
          addCompEntry={addCompEntry}
          onDelete={isEditingEntry ? removeCompEntry : undefined}
        />
      )}
    </>
  );
};

export default CompActions;
