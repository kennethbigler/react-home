import { useState } from "react";
import ExpenseEntryDialog from "./ExpenseEntryDialog";
import ExpenseEntryDisplay from "./ExpenseEntryDisplay";
import { budgetAtom, ExpenseEntry } from "../../../../jotai/finances-atom";
import { useAtom } from "jotai";
import { Button } from "@mui/material";

const Budgeting = () => {
  const [expenseEntries, setExpenseEntries] = useAtom(budgetAtom);
  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);

  // entry open/closers
  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };

  // entry open/closers
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
        expenseEntries={expenseEntries}
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
