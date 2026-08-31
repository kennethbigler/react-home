import { useState, type ChangeEvent, type MouseEvent } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  formatCategoryName,
  getPercentSources,
  getTaxBasis,
} from "@/apis/budget";
import type {
  ExpenseEntry,
  ExpensePercentSource,
  ExpenseTaxBasis,
  ExpenseValueMode,
} from "@/apis/budget";
import ConfirmDeleteDialog from "@/components/resume/finances/shared/ConfirmDeleteDialog";
import dialogTextFieldProps from "@/components/resume/finances/shared/dialogTextFieldProps";
import useConfirmDelete from "@/components/resume/finances/shared/useConfirmDelete";

const percentSourceOptions: Array<{
  value: ExpensePercentSource;
  label: string;
}> = [
  { value: "salary", label: "Salary" },
  { value: "bonus", label: "Bonus" },
  { value: "stockAdj", label: "Stock" },
  { value: "partnerSalary", label: "Partner Salary" },
  { value: "partnerBonus", label: "Partner Bonus" },
  { value: "partnerStockAdj", label: "Partner Stock" },
];

interface ExpenseEntryDialogProps {
  open: boolean;
  expenseEntry?: ExpenseEntry;
  onClose: () => void;
  addExpenseEntry: (n: ExpenseEntry) => void;
  onDelete?: () => void;
}

const ExpenseEntryDialog = ({
  open,
  expenseEntry,
  onClose,
  addExpenseEntry,
  onDelete,
}: ExpenseEntryDialogProps) => {
  const [name, setName] = useState(expenseEntry?.name || "");
  const [category, setCategory] = useState(expenseEntry?.category || "");
  const [valueMode, setValueMode] = useState<ExpenseValueMode>(
    expenseEntry?.valueMode ?? "dollar",
  );
  const [percentSources, setPercentSources] = useState<ExpensePercentSource[]>(
    () => getPercentSources(expenseEntry ?? {}),
  );
  const [taxBasis, setTaxBasis] = useState<ExpenseTaxBasis>(() =>
    getTaxBasis(expenseEntry ?? {}),
  );
  const [value, setValue] = useState<number | "">(expenseEntry?.value || 0);
  const confirmDelete = useConfirmDelete(() => onDelete?.());

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCategory(e.target.value);
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: next } = e.target;
    if (next === "") {
      setValue("");
      return;
    }
    const parsed = parseFloat(next);
    setValue(Number.isFinite(parsed) ? parsed : "");
  };
  const handlePercentSourcesChange = (e: SelectChangeEvent<string[]>) => {
    const nextValue = e.target.value;

    setPercentSources(
      typeof nextValue === "string"
        ? (nextValue.split(",") as ExpensePercentSource[])
        : (nextValue as ExpensePercentSource[]),
    );
  };
  const handleValueModeChange = (
    _event: MouseEvent<HTMLElement>,
    nextMode: ExpenseValueMode | null,
  ) => {
    if (nextMode) {
      setValueMode(nextMode);
    }
  };
  const handleTaxBasisChange = (
    _event: MouseEvent<HTMLElement>,
    nextBasis: ExpenseTaxBasis | null,
  ) => {
    if (nextBasis) {
      setTaxBasis(nextBasis);
    }
  };

  const handleSubmit = () => {
    addExpenseEntry({
      name: name.trim(),
      category: formatCategoryName(category),
      value: typeof value === "number" ? value : 0,
      ...(valueMode === "percent"
        ? { valueMode, percentSources, taxBasis }
        : { valueMode: "dollar" }),
    });
  };

  const numericValue = typeof value === "number" ? value : Number.NaN;
  const isPercentInRange =
    valueMode !== "percent" ||
    Number.isNaN(numericValue) ||
    (numericValue >= 0 && numericValue <= 100);
  const isDollarNonNegative =
    valueMode !== "dollar" || Number.isNaN(numericValue) || numericValue >= 0;
  const hasPercentSources =
    valueMode !== "percent" || percentSources.length > 0;
  const hasRequiredFields =
    name.trim().length > 0 && category.trim().length > 0;
  const canSubmit =
    hasRequiredFields &&
    isPercentInRange &&
    isDollarNonNegative &&
    hasPercentSources;

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{expenseEntry ? "Edit" : "New"} Expense Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={handleNameChange}
            {...dialogTextFieldProps}
          />
          <TextField
            label="Category"
            value={category}
            onChange={handleCategoryChange}
            {...dialogTextFieldProps}
          />
          <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
            <TextField
              {...dialogTextFieldProps}
              sx={{ flex: 1, mb: 0 }}
              label="Value"
              value={value}
              type="number"
              onChange={handleValueChange}
              slotProps={{
                htmlInput:
                  valueMode === "percent"
                    ? { min: 0, max: 100, step: 0.1 }
                    : { min: 0 },
              }}
              error={!isPercentInRange || !isDollarNonNegative}
              helperText={
                !isPercentInRange
                  ? "Percent must be between 0 and 100."
                  : !isDollarNonNegative
                    ? "Amount must be zero or greater."
                    : undefined
              }
            />
            <ToggleButtonGroup
              exclusive
              value={valueMode}
              onChange={handleValueModeChange}
              size="small"
              aria-label="Allocation type"
              sx={{ mb: 1 }}
            >
              <ToggleButton value="dollar" aria-label="Dollar amount">
                $
              </ToggleButton>
              <ToggleButton value="percent" aria-label="Percent of income">
                %
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          {valueMode === "percent" && (
            <FormControl
              fullWidth
              margin="dense"
              variant="standard"
              error={!hasPercentSources}
            >
              <InputLabel id="percent-sources-label">Income Sources</InputLabel>
              <Select
                labelId="percent-sources-label"
                multiple
                value={percentSources}
                label="Income Sources"
                onChange={handlePercentSourcesChange}
                aria-describedby={
                  !hasPercentSources ? "percent-sources-error" : undefined
                }
                renderValue={(selected) =>
                  selected
                    .map(
                      (source) =>
                        percentSourceOptions.find(
                          ({ value }) => value === source,
                        )?.label ?? source,
                    )
                    .join(", ")
                }
              >
                {percentSourceOptions.map(({ value: optionValue, label }) => (
                  <MenuItem key={optionValue} value={optionValue}>
                    <Checkbox checked={percentSources.includes(optionValue)} />
                    <ListItemText primary={label} />
                  </MenuItem>
                ))}
              </Select>
              {!hasPercentSources && (
                <FormHelperText id="percent-sources-error">
                  Select at least one income source.
                </FormHelperText>
              )}
            </FormControl>
          )}
          {valueMode === "percent" && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1, alignItems: "center" }}
            >
              <Typography variant="body2" component="span">
                Tax basis
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={taxBasis}
                onChange={handleTaxBasisChange}
                size="small"
                aria-label="Tax basis"
              >
                <ToggleButton value="pretax" aria-label="Pre-tax">
                  Pre-tax
                </ToggleButton>
                <ToggleButton value="posttax" aria-label="Post-tax">
                  Post-tax
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {expenseEntry && onDelete ? (
            <Button onClick={confirmDelete.request} color="error">
              Delete
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            {expenseEntry ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDelete.open}
        title="Delete expense entry?"
        description="This expense entry will be permanently deleted."
        confirmLabel="Delete entry"
        onCancel={confirmDelete.cancel}
        onConfirm={confirmDelete.confirm}
      />
    </>
  );
};

export default ExpenseEntryDialog;
