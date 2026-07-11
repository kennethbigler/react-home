import { useState, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { ExpenseEntry } from "../../../../jotai/finances-atom";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

interface ExpenseEntryDialogProps {
  open: boolean;
  expenseEntry?: ExpenseEntry;
  onClose: () => void;
  addExpenseEntry: (n: ExpenseEntry) => void;
}

const ExpenseEntryDialog = ({
  open,
  expenseEntry,
  onClose,
  addExpenseEntry,
}: ExpenseEntryDialogProps) => {
  const [name, setName] = useState(expenseEntry?.name || "");
  const [category, setCategory] = useState(expenseEntry?.category || "");
  const [value, setValue] = useState(expenseEntry?.value || 0);

  const resetState = () => {
    setName("");
    setCategory("");
    setValue(0);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCategory(e.target.value);
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(parseFloat(e.target.value));

  const handleSubmit = () => {
    addExpenseEntry({ name, category, value });
    resetState();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{expenseEntry ? "Edit" : "New"} Expense Entry</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={handleNameChange}
          {...tfProps}
        />
        <TextField
          label="Category"
          value={category}
          onChange={handleCategoryChange}
          {...tfProps}
        />
        <TextField
          label="Amount"
          value={value}
          type="number"
          onChange={handleValueChange}
          {...tfProps}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>
          {expenseEntry ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseEntryDialog;
