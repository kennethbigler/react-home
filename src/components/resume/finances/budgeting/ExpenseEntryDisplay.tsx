import { Grid, Stack, Typography } from "@mui/material";
import { useAtom } from "jotai";
import usDollar from "../../../../apis/usDollar";
import {
  budgetCategoryColorsAtom,
  ExpenseEntry,
  ExpenseEntryColor,
  normalizeBudgetCategoryKey,
} from "../../../../jotai/finances-atom";
import CategoryColorSelect from "./CategoryColorSelect";
import ExpenseEntryCard from "./ExpenseEntryCard";

interface ExpenseEntryDisplayProps {
  expenseEntries: ExpenseEntry[];
  onClick: (i: number) => () => void;
}

interface CategoryGroup {
  categoryKey: string;
  heading: string;
  items: { expenseEntry: ExpenseEntry; index: number }[];
}

const groupExpenseEntriesByCategory = (
  expenseEntries: ExpenseEntry[],
): CategoryGroup[] => {
  const groups = new Map<string, CategoryGroup>();

  expenseEntries.forEach((expenseEntry, index) => {
    const categoryKey = normalizeBudgetCategoryKey(expenseEntry.category);
    const existingGroup = groups.get(categoryKey);

    if (existingGroup) {
      existingGroup.items.push({ expenseEntry, index });
      return;
    }

    groups.set(categoryKey, {
      categoryKey,
      heading: expenseEntry.category.trim().toUpperCase() || "UNCATEGORIZED",
      items: [{ expenseEntry, index }],
    });
  });

  return [...groups.values()];
};

// In Code
// TODO: Sankey Graph - comp calc going in, budget going out (how to we track stock as auto-invest?), default out color is red
// TODO: Pie chart by category? On click shows breakdown?
// TODO: Add tax takeout - as a scaling percentage

// In App
// TODO: Add retirement spend - as a percentage?
// TODO: Add auto investing spend

const ExpenseEntryDisplay = ({
  expenseEntries,
  onClick,
}: ExpenseEntryDisplayProps) => {
  const [categoryColors, setCategoryColors] = useAtom(budgetCategoryColorsAtom);
  const categoryGroups = groupExpenseEntriesByCategory(expenseEntries);

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
    <Grid container spacing={2}>
      {categoryGroups.map(({ categoryKey, heading, items }) => {
        const categoryTotal = items.reduce(
          (sum, { expenseEntry }) => sum + expenseEntry.value,
          0,
        );
        const categoryColor = categoryColors[categoryKey];

        return (
          <Grid
            key={categoryKey}
            size={{
              xs: 12,
              sm: categoryGroups.length > 1 ? 6 : 12,
              md: categoryGroups.length > 2 ? 4 : undefined,
              lg: categoryGroups.length > 3 ? 3 : undefined,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              color={categoryColor}
            >
              {`${heading} (${usDollar.format(categoryTotal)})`}
            </Typography>
            <CategoryColorSelect
              categoryKey={categoryKey}
              value={categoryColor}
              onChange={handleCategoryColorChange}
            />
            <Stack spacing={1}>
              {items.map(({ expenseEntry, index }) => (
                <ExpenseEntryCard
                  expenseEntry={expenseEntry}
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
  );
};

export default ExpenseEntryDisplay;
