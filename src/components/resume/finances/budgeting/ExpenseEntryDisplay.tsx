import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAtom } from "jotai";
import {
  budgetCategoryColorsAtom,
  ExpenseEntry,
  ExpenseEntryColor,
} from "../../../../jotai/finances-atom";
import BudgetCategorySection from "./BudgetCategorySection";
import BudgetSankeyGraph from "./graphs/BudgetSankeyGraph";
import CategoryBreakdownPie from "./graphs/CategoryBreakdownPie";
import { getBudgetPieContent } from "./getBudgetPieContent";
import {
  buildCategoryTotals,
  getLatestBudgetIncome,
  type BudgetFlow,
} from "./helpers";

interface ExpenseEntryDisplayProps {
  hasCompData: boolean;
  flow: BudgetFlow | null;
  expenseEntries: ExpenseEntry[];
  selectedCategoryKey: string | null;
  hideTaxes?: boolean;
  onHideTaxesChange?: (hideTaxes: boolean) => void;
  onAddExpense: () => void;
  onCategorySelect: (categoryKey: string | null) => void;
  onClick: (i: number) => () => void;
}

const ExpenseEntryDisplay = ({
  hasCompData,
  flow,
  expenseEntries,
  selectedCategoryKey,
  hideTaxes = false,
  onHideTaxesChange,
  onAddExpense,
  onCategorySelect,
  onClick,
}: ExpenseEntryDisplayProps) => {
  const muiTheme = useTheme();
  const [categoryColors, setCategoryColors] = useAtom(budgetCategoryColorsAtom);
  const fallbackCategories =
    !flow && expenseEntries.length > 0
      ? buildCategoryTotals(
          expenseEntries,
          getLatestBudgetIncome(0, 0, 0, 0),
          categoryColors,
        )
      : [];
  const categories = flow?.categories ?? fallbackCategories;
  const pieContent = flow
    ? getBudgetPieContent(
        flow,
        categories,
        selectedCategoryKey,
        expenseEntries,
        categoryColors,
        muiTheme,
        hideTaxes,
      )
    : { title: "Income Overview", data: [] };

  const handleCategoryColorChange = (
    categoryKey: string,
    color?: ExpenseEntryColor,
  ) => {
    setCategoryColors((currentColors) => {
      if (!color) {
        const { [categoryKey]: _removedColor, ...remainingColors } =
          currentColors;
        return remainingColors;
      }

      return { ...currentColors, [categoryKey]: color };
    });
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          {hasCompData && flow ? (
            <BudgetSankeyGraph
              flow={flow}
              selectedCategoryKey={selectedCategoryKey}
              onCategorySelect={onCategorySelect}
            />
          ) : (
            <Alert severity="info">
              Add a comp entry in Comp Calculator to see budget flow.
            </Alert>
          )}
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ position: "relative", minHeight: "100%" }}>
            {hasCompData && flow ? (
              pieContent.data.length > 0 ? (
                <CategoryBreakdownPie
                  title={pieContent.title}
                  data={pieContent.data}
                />
              ) : (
                <Typography sx={{ p: 2 }}>
                  Add expenses to see category breakdown.
                </Typography>
              )
            ) : (
              <Typography sx={{ p: 2 }}>
                Category breakdown requires comp calculator data.
              </Typography>
            )}
            {hasCompData && flow && onHideTaxesChange ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={hideTaxes}
                      onChange={(event) =>
                        onHideTaxesChange(event.target.checked)
                      }
                      slotProps={{ input: { "aria-label": "Hide taxes" } }}
                    />
                  }
                  label="Hide taxes"
                />
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>

      <Stack direction="row" sx={{ mb: 2 }}>
        <Button onClick={onAddExpense}>+ Expense</Button>
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
            isSelected={selectedCategoryKey === category.categoryKey}
            onCategorySelect={onCategorySelect}
            onExpenseClick={onClick}
            onCategoryColorChange={handleCategoryColorChange}
          />
        ))}
      </Grid>
    </>
  );
};

export default ExpenseEntryDisplay;
