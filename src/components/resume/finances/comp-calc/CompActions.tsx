import { useState } from "react";
import { useAtom } from "jotai";
import { Box, Button } from "@mui/material";
import type { CompEntry } from "@/jotai/comp-calc-atom";
import stockAtom from "@/jotai/stock-atom";
import type { EntryDialogState } from "../shared/useEntryDialog";
import CompEntryDialog from "./CompEntryDialog";
import StockDialog from "./StockDialog";
import StockDisplay from "./StockDisplay";

interface CompActionsProps {
  compEntries: CompEntry[];
  entryDialog: EntryDialogState;
  saveCompEntry: (entry: CompEntry) => void;
  removeCompEntry: () => void;
}

const CompActions = ({
  compEntries,
  entryDialog,
  saveCompEntry,
  removeCompEntry,
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
          addCompEntry={saveCompEntry}
          onDelete={isEditingEntry ? removeCompEntry : undefined}
        />
      )}
    </>
  );
};

export default CompActions;
