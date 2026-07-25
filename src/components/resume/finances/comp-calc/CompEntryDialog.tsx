import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  type TextFieldProps,
  type SelectChangeEvent,
} from "@mui/material";
import dateHelper, { months } from "../../../../apis/DateHelper";
import type { CompEntry } from "../../../../jotai/finances-atom";
import { finiteOr } from "./compEntryNumbers";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

const VALIDATION_ERROR_ID = "comp-entry-validation-error";

const currentYear = new Date().getFullYear() - 2000;
const years: number[] = [];
for (let i = 0; i <= currentYear; i += 1) {
  years.push(2000 + i);
}
years.reverse();

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
  const [entryDateMonth, setEntryDateMonth] = useState(
    (compEntry && (dateHelper(compEntry.entryDate).month + 1).toString()) ||
      "1",
  );
  const [entryDateYear, setEntryDateYear] = useState(
    (compEntry && dateHelper(compEntry.entryDate).year.toString()) ||
      years[0].toString(),
  );
  const [salary, setSalary] = useState(compEntry?.salary || 0);
  const [bonus, setBonus] = useState(compEntry?.bonus || 0);
  const [stockTick, setStockTick] = useState(compEntry?.stockTick || "");
  const [priceThen, setPriceThen] = useState(compEntry?.priceThen || 0);
  const [grantDuration, setGrantDuration] = useState(
    compEntry?.grantDuration || 4,
  );
  const [grantQty, setGrantQty] = useState(compEntry?.grantQty || 0);
  const [error, setError] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const resetState = () => {
    setEntryDateMonth("1");
    setEntryDateYear(years[0].toString());
    setSalary(0);
    setBonus(0);
    setStockTick("");
    setPriceThen(0);
    setGrantDuration(4);
    setGrantQty(0);
    setError("");
  };

  const handleChange =
    (func: (n: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      func(parseFloat(e.target.value));
      setError("");
    };
  const handleStockTick = (e: ChangeEvent<HTMLInputElement>) => {
    setStockTick(e.target.value);
    setError("");
  };
  const handleSelectMonth = (e: SelectChangeEvent<string>) =>
    setEntryDateMonth(e.target.value);
  const handleSelectYear = (e: SelectChangeEvent<string>) =>
    setEntryDateYear(e.target.value);

  const handleSubmit = () => {
    if ([salary, bonus, priceThen, grantQty].some((value) => value < 0)) {
      setError("Compensation values must be zero or greater.");
      return;
    }
    if (!Number.isFinite(grantDuration) || grantDuration <= 0) {
      setError("Grant duration must be greater than zero.");
      return;
    }
    if (grantQty > 0 && !stockTick.trim()) {
      setError(
        "Enter a stock ticker when grant quantity is greater than zero.",
      );
      return;
    }

    addCompEntry({
      entryDate: `${entryDateYear}-${String(entryDateMonth).padStart(2, "0")}`,
      salary: finiteOr(salary),
      bonus: finiteOr(bonus),
      stockTick: stockTick.trim().toUpperCase(),
      priceThen: finiteOr(priceThen),
      grantDuration: finiteOr(grantDuration, 4),
      grantQty: finiteOr(grantQty),
    });
    resetState();
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    onDelete?.();
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{compEntry ? "Edit" : "New"} Comp Entry</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", marginTop: 5 }}>
            <FormControl fullWidth>
              <InputLabel id="month-select">Month</InputLabel>
              <Select
                labelId="month-select"
                label="Month"
                value={entryDateMonth}
                onChange={handleSelectMonth}
              >
                {months.map((month, i) => (
                  <MenuItem value={String(i + 1)} key={i}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="year-select">Year</InputLabel>
              <Select
                labelId="year-select"
                label="Year"
                value={entryDateYear}
                onChange={handleSelectYear}
              >
                {years.map((year) => (
                  <MenuItem value={year} key={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            label="Salary"
            value={salary}
            type="number"
            onChange={handleChange(setSalary)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...tfProps}
          />
          <TextField
            label="Bonus"
            value={bonus}
            type="number"
            onChange={handleChange(setBonus)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...tfProps}
          />
          <DialogContentText variant="h6" component="h4" sx={{ marginTop: 7 }}>
            Stock
          </DialogContentText>
          <TextField
            label="Stock Ticker"
            value={stockTick}
            onChange={handleStockTick}
            {...tfProps}
          />
          <TextField
            label="Grant Quantity"
            value={grantQty}
            type="number"
            onChange={handleChange(setGrantQty)}
            {...tfProps}
          />
          <TextField
            label="Grant Duration"
            value={grantDuration}
            type="number"
            onChange={handleChange(setGrantDuration)}
            {...tfProps}
          />
          <TextField
            label="Stock Price Then"
            value={priceThen}
            type="number"
            onChange={handleChange(setPriceThen)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...tfProps}
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
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit}>
            {compEntry ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Delete compensation entry?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This compensation entry will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete entry
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CompEntryDialog;
