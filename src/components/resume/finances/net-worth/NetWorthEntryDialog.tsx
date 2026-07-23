import { useState, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import dateHelper, { months } from "../../../../apis/DateHelper";
import { NetWorthEntry } from "../../../../jotai/finances-atom";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

const currentYear = new Date().getFullYear() - 2000;
const years: number[] = [];
for (let i = 0; i <= currentYear; i += 1) {
  years.push(2000 + i);
}
years.reverse();

interface NetWorthEntryDialogProps {
  open: boolean;
  entry?: NetWorthEntry;
  categories: string[];
  onClose: () => void;
  addEntry: (n: NetWorthEntry) => void;
  onDelete?: () => void;
}

const NetWorthEntryDialog = ({
  open,
  entry,
  categories,
  onClose,
  addEntry,
  onDelete,
}: NetWorthEntryDialogProps) => {
  const [entryDateMonth, setEntryDateMonth] = useState(
    (entry && (dateHelper(entry.entryDate).month + 1).toString()) || "1",
  );
  const [entryDateYear, setEntryDateYear] = useState(
    (entry && dateHelper(entry.entryDate).year.toString()) ||
      years[0].toString(),
  );
  const [amounts, setAmounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    categories.forEach((category) => {
      initial[category] = entry?.amounts[category] ?? 0;
    });
    return initial;
  });
  const [error, setError] = useState("");

  const handleSelectMonth = (e: SelectChangeEvent<string>) =>
    setEntryDateMonth(e.target.value);
  const handleSelectYear = (e: SelectChangeEvent<string>) =>
    setEntryDateYear(e.target.value);

  const handleAmountChange =
    (category: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setAmounts((prev) => ({
        ...prev,
        [category]: parseFloat(e.target.value),
      }));
      setError("");
    };

  const handleSubmit = () => {
    const hasInvalid = categories.some((category) => {
      const value = amounts[category];
      return Number.isFinite(value) && value < 0;
    });
    if (hasInvalid) {
      setError("Amounts must be zero or greater.");
      return;
    }

    const nextAmounts: Record<string, number> = {};
    categories.forEach((category) => {
      const value = amounts[category];
      nextAmounts[category] = Number.isFinite(value) ? value : 0;
    });

    addEntry({
      entryDate: `${entryDateYear}-${String(entryDateMonth).padStart(2, "0")}`,
      amounts: nextAmounts,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{entry ? "Edit" : "New"} Net Worth Entry</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", marginTop: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="net-worth-month-select">Month</InputLabel>
            <Select
              labelId="net-worth-month-select"
              label="Month"
              value={entryDateMonth}
              onChange={handleSelectMonth}
            >
              {months.map((month, i) => (
                <MenuItem value={String(i + 1)} key={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="net-worth-year-select">Year</InputLabel>
            <Select
              labelId="net-worth-year-select"
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
        {categories.map((category) => (
          <TextField
            key={category}
            label={category}
            value={amounts[category]}
            type="number"
            onChange={handleAmountChange(category)}
            slotProps={{ input: { startAdornment: "$" } }}
            {...tfProps}
          />
        ))}
        {error ? (
          <Typography color="error" sx={{ marginTop: 1 }}>
            {error}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        {entry && onDelete ? (
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        ) : null}
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>
          {entry ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetWorthEntryDialog;
