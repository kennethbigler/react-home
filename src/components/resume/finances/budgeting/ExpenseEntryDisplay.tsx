import { Alert, Grid, Stack, Typography } from "@mui/material";
import { useTheme, type Theme } from "@mui/material/styles";
import { useAtom } from "jotai";
import usDollar from "../../../../apis/usDollar";
import {
  budgetCategoryColorsAtom,
  ExpenseEntryColor,
} from "../../../../jotai/finances-atom";
import BudgetSankeyGraph from "./BudgetSankeyGraph";
import CategoryBreakdownPie from "./CategoryBreakdownPie";
import CategoryColorSelect from "./CategoryColorSelect";
import ExpenseEntryCard from "./ExpenseEntryCard";
import {
  colorizeBreakdownPieData,
  colorizeCategoryPieData,
} from "./chartColors";
import {
  buildCategoryPieData,
  buildExpensePieData,
  buildCategoryTotals,
  getLatestBudgetIncome,
  type BudgetFlow,
  type CategoryTotal,
} from "./helpers";

interface ExpenseEntryDisplayProps {
  hasCompData: boolean;
  flow: BudgetFlow | null;
  expenseEntries: Array<{
    name: string;
    category: string;
    value: number;
    valueMode?: "dollar" | "percent";
    percentSource?: "salary" | "bonus" | "stockAdj";
    percentSources?: Array<"salary" | "bonus" | "stockAdj">;
  }>;
  selectedCategoryKey: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
  onClick: (i: number) => () => void;
}

const getPieContent = (
  flow: BudgetFlow,
  categories: CategoryTotal[],
  selectedCategoryKey: string | null,
  expenseEntries: ExpenseEntryDisplayProps["expenseEntries"],
  categoryColors: Partial<Record<string, ExpenseEntryColor>>,
  theme: Theme,
) => {
  if (selectedCategoryKey) {
    const selectedCategory = categories.find(
      ({ categoryKey }) => categoryKey === selectedCategoryKey,
    );
    const data = buildExpensePieData(
      selectedCategoryKey,
      expenseEntries,
      flow.income,
    );

    return {
      title: selectedCategory
        ? `${selectedCategory.heading} Breakdown`
        : "Category Breakdown",
      data: colorizeBreakdownPieData(
        theme,
        selectedCategory?.color ?? categoryColors[selectedCategoryKey],
        data,
      ),
    };
  }

  return {
    title: "By Category",
    data: colorizeCategoryPieData(
      theme,
      categories,
      buildCategoryPieData(categories),
    ),
  };
};

const ExpenseEntryDisplay = ({
  hasCompData,
  flow,
  expenseEntries,
  selectedCategoryKey,
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
  const pieContent =
    flow && categories.length > 0
      ? getPieContent(
          flow,
          categories,
          selectedCategoryKey,
          expenseEntries,
          categoryColors,
          muiTheme,
        )
      : { title: "By Category", data: [] };

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
              selectedCategoryKey={selectedCategoryKey ?? undefined}
              onCategorySelect={onCategorySelect}
            />
          ) : (
            <Alert severity="info">
              Add a comp entry in Comp Calculator to see budget flow.
            </Alert>
          )}
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
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
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {categories.map(({ categoryKey, heading, total, items, color }) => {
          const categoryColor = color ?? categoryColors[categoryKey];
          const isSelected = selectedCategoryKey === categoryKey;

          return (
            <Grid
              key={categoryKey}
              size={{
                xs: 12,
                sm: categories.length > 1 ? 6 : 12,
                md: categories.length > 2 ? 4 : undefined,
                lg: categories.length > 3 ? 3 : undefined,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                color={categoryColor}
                sx={{
                  outline: isSelected ? "2px solid" : undefined,
                  outlineColor: isSelected ? "primary.main" : undefined,
                  borderRadius: 1,
                  px: isSelected ? 0.5 : 0,
                }}
              >
                {`${heading} (${usDollar.format(total)})`}
              </Typography>
              <CategoryColorSelect
                categoryKey={categoryKey}
                value={categoryColor}
                onChange={handleCategoryColorChange}
              />
              <Stack spacing={1}>
                {items.map(({ expenseEntry, index, resolvedAmount }) => (
                  <ExpenseEntryCard
                    expenseEntry={expenseEntry}
                    resolvedAmount={resolvedAmount}
                    color={categoryColor}
                    onClick={onClick(index)}
                    key={`expense-entry-${index}`}
                  />
                ))}
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ExpenseEntryDisplay;
