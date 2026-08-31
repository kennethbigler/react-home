import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { NetWorthEntry } from "@/jotai/net-worth-atom";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";
import MonthYearSelect from "../shared/MonthYearSelect";
import dialogTextFieldProps from "../shared/dialogTextFieldProps";
import useConfirmDelete from "../shared/useConfirmDelete";
import useMonthYear from "../shared/useMonthYear";

const VALIDATION_ERROR_ID = "net-worth-entry-validation-error";

interface NetWorthEntryDialogProps {
  open: boolean;
  entry?: NetWorthEntry;
  entries?: NetWorthEntry[];
  categories: string[];
  onClose: () => void;
  addEntry: (n: NetWorthEntry) => void;
  onDelete?: () => void;
}

type AmountValue = number | "";

const NetWorthEntryDialog = ({
  open,
  entry,
  entries = [],
  categories,
  onClose,
  addEntry,
  onDelete,
}: NetWorthEntryDialogProps) => {
  const [error, setError] = useState("");
  const [invalidCategories, setInvalidCategories] = useState<string[]>([]);
  const confirmDelete = useConfirmDelete(() => onDelete?.());

  const clearValidation = () => {
    setError("");
    setInvalidCategories([]);
  };

  const monthYear = useMonthYear(entry?.entryDate, clearValidation);
  const [amounts, setAmounts] = useState<Record<string, AmountValue>>(() => {
    const initial: Record<string, AmountValue> = {};
    categories.forEach((category) => {
      initial[category] = entry?.amounts[category] ?? 0;
    });
    return initial;
  });

  const handleAmountChange =
    (category: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      let next: AmountValue = "";
      if (value !== "") {
        const parsed = parseFloat(value);
        next = Number.isFinite(parsed) ? parsed : "";
      }
      setAmounts((prev) => ({
        ...prev,
        [category]: next,
      }));
      clearValidation();
    };

  const handleSubmit = () => {
    const { entryDate } = monthYear;
    if (
      entries.some(
        (existingEntry) =>
          existingEntry !== entry && existingEntry.entryDate === entryDate,
      )
    ) {
      setError("A net worth entry already exists for this month.");
      return;
    }

    const negativeCategories = categories.filter((category) => {
      const value = amounts[category];
      return typeof value === "number" && value < 0;
    });
    if (negativeCategories.length > 0) {
      setInvalidCategories(negativeCategories);
      setError("Amounts must be zero or greater.");
      return;
    }

    const nextAmounts: Record<string, number> = {};
    categories.forEach((category) => {
      const value = amounts[category];
      nextAmounts[category] = typeof value === "number" ? value : 0;
    });

    addEntry({
      entryDate,
      amounts: nextAmounts,
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{entry ? "Edit" : "New"} Net Worth Entry</DialogTitle>
        <DialogContent>
          <MonthYearSelect
            idPrefix="net-worth"
            month={monthYear.month}
            year={monthYear.year}
            onMonthChange={monthYear.handleMonthChange}
            onYearChange={monthYear.handleYearChange}
          />
          {categories.map((category) => {
            const isInvalid = invalidCategories.includes(category);

            return (
              <TextField
                key={category}
                label={category}
                value={amounts[category]}
                type="number"
                onChange={handleAmountChange(category)}
                error={isInvalid}
                slotProps={{
                  input: { startAdornment: "$" },
                  htmlInput: {
                    "aria-invalid": isInvalid || undefined,
                    "aria-describedby": isInvalid
                      ? VALIDATION_ERROR_ID
                      : undefined,
                  },
                }}
                {...dialogTextFieldProps}
              />
            );
          })}
          {error ? (
            <Alert
              id={VALIDATION_ERROR_ID}
              severity="error"
              sx={{ marginTop: 1 }}
            >
              {error}
            </Alert>
          ) : null}
        </DialogContent>
        <DialogActions>
          {entry && onDelete ? (
            <Button onClick={confirmDelete.request} color="error">
              Delete
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>
            {entry ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDelete.open}
        title="Delete net worth entry?"
        description="This net worth entry will be permanently deleted."
        confirmLabel="Delete entry"
        onCancel={confirmDelete.cancel}
        onConfirm={confirmDelete.confirm}
      />
    </>
  );
};

export default NetWorthEntryDialog;
