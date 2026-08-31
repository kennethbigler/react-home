import type { ChangeEvent } from "react";
import {
  Alert,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { useAtom } from "jotai";
import {
  FEDERAL_STANDARD_DEDUCTION,
  FEDERAL_STANDARD_DEDUCTION_MFJ,
} from "@/constants/federalTaxBrackets";
import type { ExpenseEntry } from "@/apis/budget";
import {
  filingJointlyAtom,
  itemizeDeductionsAtom,
  itemizedDeductionAtom,
  partnerIncomeAtom,
} from "@/jotai/budget-atom";
import BudgetCategorySection from "./BudgetCategorySection";
import ExpenseEntryDialog from "./ExpenseEntryDialog";
import useBudgetEntries from "./useBudgetEntries";
import useEntryDialog from "@/components/resume/finances/shared/useEntryDialog";
import { finiteOr } from "@/components/resume/finances/shared/numbers";

const partnerTfProps: TextFieldProps = {
  variant: "standard",
  margin: "dense",
  type: "number",
  slotProps: { input: { startAdornment: "$" } },
  sx: { minWidth: 120, flex: "1 1 120px", maxWidth: 180 },
};

const toggleGroupActiveSx = {
  border: 1,
  borderColor: "divider",
  borderRadius: 2,
  px: 1.5,
  py: 0.5,
} as const;

const BudgetExpenses = () => {
  const {
    expenseEntries,
    hasCompData,
    categories,
    categoryColors,
    addExpenseEntry,
    removeExpenseEntry,
    handleCategoryColorChange,
  } = useBudgetEntries();
  const [filingJointly, setFilingJointly] = useAtom(filingJointlyAtom);
  const [partnerIncome, setPartnerIncome] = useAtom(partnerIncomeAtom);
  const [itemizeDeductions, setItemizeDeductions] = useAtom(
    itemizeDeductionsAtom,
  );
  const [itemizedDeduction, setItemizedDeduction] = useAtom(
    itemizedDeductionAtom,
  );
  const entryDialog = useEntryDialog();
  const hasPercentageExpenses = expenseEntries.some(
    ({ valueMode }) => valueMode === "percent",
  );
  const federalStandard = filingJointly
    ? FEDERAL_STANDARD_DEDUCTION_MFJ
    : FEDERAL_STANDARD_DEDUCTION;
  const deductionBelowStandard = itemizedDeduction < federalStandard;

  const handleSave = (expenseEntry: ExpenseEntry) => {
    addExpenseEntry(expenseEntry, entryDialog.editIdx);
    entryDialog.close();
  };

  const handleDelete = () => {
    removeExpenseEntry(entryDialog.editIdx);
    entryDialog.close();
  };

  const handlePartnerChange =
    (field: "salary" | "bonus" | "stock") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setPartnerIncome({
        ...partnerIncome,
        [field]: Math.max(0, finiteOr(Number(event.target.value))),
      });
    };

  const handleItemizedDeductionChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setItemizedDeduction(Math.max(0, finiteOr(Number(event.target.value))));
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Button onClick={entryDialog.openNew}>+ Expense</Button>
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{
            ml: "auto",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              ...(itemizeDeductions ? toggleGroupActiveSx : {}),
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={itemizeDeductions}
                  onChange={(event) =>
                    setItemizeDeductions(event.target.checked)
                  }
                  slotProps={{ input: { "aria-label": "Itemize Deductions" } }}
                />
              }
              label="Deductions"
            />
            {itemizeDeductions ? (
              <TextField
                label="Deductions"
                value={itemizedDeduction}
                onChange={handleItemizedDeductionChange}
                error={deductionBelowStandard}
                helperText={
                  deductionBelowStandard ? "Use Standard Deduction" : undefined
                }
                {...partnerTfProps}
              />
            ) : null}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              ...(filingJointly ? toggleGroupActiveSx : {}),
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={filingJointly}
                  onChange={(event) => setFilingJointly(event.target.checked)}
                  slotProps={{ input: { "aria-label": "Filing jointly MFJ" } }}
                />
              }
              label="MFJ"
            />
            {filingJointly ? (
              <>
                <TextField
                  label="Partner Salary"
                  value={partnerIncome.salary}
                  onChange={handlePartnerChange("salary")}
                  {...partnerTfProps}
                />
                <TextField
                  label="Partner Bonus"
                  value={partnerIncome.bonus}
                  onChange={handlePartnerChange("bonus")}
                  {...partnerTfProps}
                />
                <TextField
                  label="Partner Stock"
                  value={partnerIncome.stock}
                  onChange={handlePartnerChange("stock")}
                  {...partnerTfProps}
                />
              </>
            ) : null}
          </Stack>
        </Stack>
      </Stack>

      {!hasCompData && hasPercentageExpenses ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Add a comp entry to calculate percentage-based expense amounts.
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        {categories.map((category) => (
          <BudgetCategorySection
            key={category.categoryKey}
            category={category}
            categoryCount={categories.length}
            categoryColor={
              category.color ?? categoryColors[category.categoryKey]
            }
            onExpenseClick={entryDialog.openEdit}
            onCategoryColorChange={handleCategoryColorChange}
          />
        ))}
      </Grid>

      {entryDialog.open && (
        <ExpenseEntryDialog
          key={entryDialog.editIdx === -1 ? "new" : entryDialog.editIdx}
          open={entryDialog.open}
          onClose={entryDialog.close}
          addExpenseEntry={handleSave}
          onDelete={entryDialog.editIdx !== -1 ? handleDelete : undefined}
          expenseEntry={
            entryDialog.editIdx !== -1
              ? expenseEntries[entryDialog.editIdx]
              : undefined
          }
        />
      )}
    </>
  );
};

export default BudgetExpenses;
