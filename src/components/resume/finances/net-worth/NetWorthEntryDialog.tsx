import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  type TextFieldProps,
  type SelectChangeEvent,
} from "@mui/material";
import dateHelper, { months } from "../../../../apis/DateHelper";
import type { NetWorthEntry } from "../../../../jotai/finances-atom";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

const VALIDATION_ERROR_ID = "net-worth-entry-validation-error";

const currentYear = new Date().getFullYear() - 2000;
const years: number[] = [];
for (let i = 0; i <= currentYear; i += 1) {
  years.push(2000 + i);
}
years.reverse();

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
  const [entryDateMonth, setEntryDateMonth] = useState(
    (entry && (dateHelper(entry.entryDate).month + 1).toString()) || "1",
  );
  const [entryDateYear, setEntryDateYear] = useState(
    (entry && dateHelper(entry.entryDate).year.toString()) ||
      years[0].toString(),
  );
  const [amounts, setAmounts] = useState<Record<string, AmountValue>>(() => {
    const initial: Record<string, AmountValue> = {};
    categories.forEach((category) => {
      initial[category] = entry?.amounts[category] ?? 0;
    });
    return initial;
  });
  const [error, setError] = useState("");
  const [invalidCategories, setInvalidCategories] = useState<string[]>([]);

  const clearValidation = () => {
    setError("");
    setInvalidCategories([]);
  };

  const handleSelectMonth = (e: SelectChangeEvent<string>) => {
    setEntryDateMonth(e.target.value);
    clearValidation();
  };
  const handleSelectYear = (e: SelectChangeEvent<string>) => {
    setEntryDateYear(e.target.value);
    clearValidation();
  };

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
    const entryDate = `${entryDateYear}-${String(entryDateMonth).padStart(2, "0")}`;
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{entry ? "Edit" : "New"} Net Worth Entry</DialogTitle>
      <DialogContent>
        <Stack direction="row" sx={{ marginTop: 0.625 }}>
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
        </Stack>
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
              {...tfProps}
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
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        ) : null}
        <Button onClick={onClose}>Cancel</Button>
        <Button type="button" onClick={handleSubmit}>
          {entry ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetWorthEntryDialog;
