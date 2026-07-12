import { useState } from "react";
import ExpenseEntryDialog from "./ExpenseEntryDialog";
import ExpenseEntryDisplay from "./ExpenseEntryDisplay";
import {
  budgetAtom,
  budgetFlowRead,
  ExpenseEntry,
} from "../../../../jotai/finances-atom";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@mui/material";

const Budgeting = () => {
  const [expenseEntries, setExpenseEntries] = useAtom(budgetAtom);
  const budgetState = useAtomValue(budgetFlowRead);
  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );

  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };

  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  const handleClose = () => setOpenEntry(false);

  const addExpenseEntry = (expenseEntry: ExpenseEntry) => {
    const newExpenseEntries = [...expenseEntries];
    if (editEntryIdx === -1) {
      newExpenseEntries.push(expenseEntry);
    } else {
      newExpenseEntries[editEntryIdx] = expenseEntry;
    }
    setExpenseEntries(newExpenseEntries);
    handleClose();
  };

  return (
    <div>
      <Button onClick={openNewEntry}>+ Expense</Button>
      <ExpenseEntryDisplay
        hasCompData={budgetState.hasCompData}
        flow={budgetState.flow}
        expenseEntries={budgetState.expenseEntries}
        selectedCategoryKey={selectedCategoryKey}
        onCategorySelect={setSelectedCategoryKey}
        onClick={openEditEntry}
      />
      {openEntry && (
        <ExpenseEntryDialog
          open={openEntry}
          onClose={handleClose}
          addExpenseEntry={addExpenseEntry}
          expenseEntry={
            editEntryIdx !== -1 ? expenseEntries[editEntryIdx] : undefined
          }
        />
      )}
    </div>
  );
};

export default Budgeting;
