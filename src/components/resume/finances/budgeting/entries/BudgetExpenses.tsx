import { useState } from "react";
import { Button, Grid, Stack } from "@mui/material";
import type { ExpenseEntry } from "../../../../../jotai/finances-atom";
import BudgetCategorySection from "./BudgetCategorySection";
import ExpenseEntryDialog from "./ExpenseEntryDialog";
import useBudgetEntries from "./useBudgetEntries";

const BudgetExpenses = () => {
  const {
    expenseEntries,
    categories,
    categoryColors,
    addExpenseEntry,
    removeExpenseEntry,
    handleCategoryColorChange,
  } = useBudgetEntries();
  const [openEntry, setOpenEntry] = useState(false);
  const [editEntryIdx, setEditEntryIdx] = useState(-1);

  const openNewEntry = () => {
    setEditEntryIdx(-1);
    setOpenEntry(true);
  };

  const openEditEntry = (i: number) => () => {
    setEditEntryIdx(i);
    setOpenEntry(true);
  };

  const handleClose = () => setOpenEntry(false);

  const handleSave = (expenseEntry: ExpenseEntry) => {
    addExpenseEntry(expenseEntry, editEntryIdx);
    handleClose();
  };

  const handleDelete = () => {
    removeExpenseEntry(editEntryIdx);
    handleClose();
  };

  return (
    <>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Button onClick={openNewEntry}>+ Expense</Button>
      </Stack>

      <Grid container spacing={2}>
        {categories.map((category) => (
          <BudgetCategorySection
            key={category.categoryKey}
            category={category}
            categoryCount={categories.length}
            categoryColor={
              category.color ?? categoryColors[category.categoryKey]
            }
            onExpenseClick={openEditEntry}
            onCategoryColorChange={handleCategoryColorChange}
          />
        ))}
      </Grid>

      {openEntry && (
        <ExpenseEntryDialog
          key={editEntryIdx === -1 ? "new" : editEntryIdx}
          open={openEntry}
          onClose={handleClose}
          addExpenseEntry={handleSave}
          onDelete={editEntryIdx !== -1 ? handleDelete : undefined}
          expenseEntry={
            editEntryIdx !== -1 ? expenseEntries[editEntryIdx] : undefined
          }
        />
      )}
    </>
  );
};

export default BudgetExpenses;
