import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { CompEntry } from "../../../../jotai/finances-atom";
import ConfirmDeleteDialog from "../shared/ConfirmDeleteDialog";
import MonthYearSelect from "../shared/MonthYearSelect";
import dialogTextFieldProps from "../shared/dialogTextFieldProps";
import useMonthYear from "../shared/useMonthYear";

const VALIDATION_ERROR_ID = "comp-entry-validation-error";

type NumericValue = number | "";

const toNumber = (value: NumericValue): number => (value === "" ? 0 : value);

interface CompEntryDialogProps {
  open: boolean;
  compEntry?: CompEntry;
  onClose: () => void;
  addCompEntry: (n: CompEntry) => void;
  onDelete?: () => void;
}

const CompEntryDialog = ({
  open,
  compEntry,
  onClose,
  addCompEntry,
  onDelete,
}: CompEntryDialogProps) => {
  const monthYear = useMonthYear(compEntry?.entryDate);
  const [salary, setSalary] = useState<NumericValue>(compEntry?.salary ?? 0);
  const [bonus, setBonus] = useState<NumericValue>(compEntry?.bonus ?? 0);
  const [stockTick, setStockTick] = useState(compEntry?.stockTick ?? "");
  const [priceThen, setPriceThen] = useState<NumericValue>(
    compEntry?.priceThen ?? 0,
  );
  const [grantDuration, setGrantDuration] = useState<NumericValue>(
    compEntry?.grantDuration ?? 4,
  );
  const [grantQty, setGrantQty] = useState<NumericValue>(
    compEntry?.grantQty ?? 0,
  );
  const [error, setError] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleChange =
    (setValue: (n: NumericValue) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const parsed = parseFloat(value);
      setValue(value !== "" && Number.isFinite(parsed) ? parsed : "");
      setError("");
    };
  const handleStockTick = (e: ChangeEvent<HTMLInputElement>) => {
    setStockTick(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    if (
      [salary, bonus, priceThen, grantQty].some(
        (value) => typeof value === "number" && value < 0,
      )
    ) {
      setError("Compensation values must be zero or greater.");
      return;
    }
    if (toNumber(grantDuration) <= 0) {
      setError("Grant duration must be greater than zero.");
      return;
    }
    if (toNumber(grantQty) > 0 && !stockTick.trim()) {
      setError(
        "Enter a stock ticker when grant quantity is greater than zero.",
      );
      return;
    }

    addCompEntry({
      entryDate: monthYear.entryDate,
      salary: toNumber(salary),
      bonus: toNumber(bonus),
      stockTick: stockTick.trim().toUpperCase(),
      priceThen: toNumber(priceThen),
      grantDuration: toNumber(grantDuration),
      grantQty: toNumber(grantQty),
    });
  };

  const confirmDelete = () => {
    onDelete?.();
    setConfirmDeleteOpen(false);
  };

  const isCompValueError =
    error === "Compensation values must be zero or greater.";
  const isGrantDurationError =
    error === "Grant duration must be greater than zero.";
  const isStockTickError =
    error === "Enter a stock ticker when grant quantity is greater than zero.";

  const fieldA11y = (invalid: boolean) =>
    invalid
      ? {
          error: true as const,
          slotProps: {
            htmlInput: {
              "aria-invalid": true as const,
              "aria-describedby": VALIDATION_ERROR_ID,
            },
          },
        }
      : {};

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{compEntry ? "Edit" : "New"} Comp Entry</DialogTitle>
        <DialogContent>
          <MonthYearSelect
            idPrefix="comp-entry"
            month={monthYear.month}
            year={monthYear.year}
            onMonthChange={monthYear.handleMonthChange}
            onYearChange={monthYear.handleYearChange}
          />
          <TextField
            label="Salary"
            value={salary}
            type="number"
            onChange={handleChange(setSalary)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...dialogTextFieldProps}
            {...fieldA11y(isCompValueError)}
          />
          <TextField
            label="Bonus"
            value={bonus}
            type="number"
            onChange={handleChange(setBonus)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...dialogTextFieldProps}
            {...fieldA11y(isCompValueError)}
          />
          <DialogContentText variant="h6" component="h4" sx={{ marginTop: 7 }}>
            Stock
          </DialogContentText>
          <TextField
            label="Stock Ticker"
            value={stockTick}
            onChange={handleStockTick}
            {...dialogTextFieldProps}
            {...fieldA11y(isStockTickError)}
          />
          <TextField
            label="Grant Quantity"
            value={grantQty}
            type="number"
            onChange={handleChange(setGrantQty)}
            {...dialogTextFieldProps}
            {...fieldA11y(isCompValueError)}
          />
          <TextField
            label="Grant Duration"
            value={grantDuration}
            type="number"
            onChange={handleChange(setGrantDuration)}
            {...dialogTextFieldProps}
            {...fieldA11y(isGrantDurationError)}
          />
          <TextField
            label="Stock Price Then"
            value={priceThen}
            type="number"
            onChange={handleChange(setPriceThen)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...dialogTextFieldProps}
            {...fieldA11y(isCompValueError)}
          />
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
          {compEntry && onDelete ? (
            <Button onClick={() => setConfirmDeleteOpen(true)} color="error">
              Delete
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>
            {compEntry ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        title="Delete compensation entry?"
        description="This compensation entry will be permanently deleted."
        confirmLabel="Delete entry"
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CompEntryDialog;
