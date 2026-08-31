import { Grid, Stack, Typography } from "@mui/material";
import type { CategoryTotal, ExpenseEntryColor } from "@/apis/budget";
import usDollar from "@/apis/usDollar";
import CategoryColorSelect from "./CategoryColorSelect";
import ExpenseEntryCard from "./ExpenseEntryCard";

interface BudgetCategorySectionProps {
  category: CategoryTotal;
  categoryCount: number;
  categoryColor?: ExpenseEntryColor;
  onExpenseClick: (index: number) => () => void;
  onCategoryColorChange: (
    categoryKey: string,
    color?: ExpenseEntryColor,
  ) => void;
}

const BudgetCategorySection = ({
  category,
  categoryCount,
  categoryColor,
  onExpenseClick,
  onCategoryColorChange,
}: BudgetCategorySectionProps) => {
  const { categoryKey, heading, total, items } = category;

  return (
    <Grid
      size={{
        xs: 12,
        sm: categoryCount > 1 ? 6 : 12,
        md: categoryCount > 2 ? 4 : undefined,
        lg: categoryCount > 3 ? 3 : undefined,
        xl: categoryCount > 5 ? 2 : undefined,
        xxl: categoryCount > 11 ? 1 : undefined,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        {...(categoryColor ? { color: categoryColor } : {})}
        sx={{ textTransform: "uppercase" }}
      >
        {`${heading} (${usDollar.format(total)})`}
      </Typography>
      <CategoryColorSelect
        categoryKey={categoryKey}
        value={categoryColor}
        onChange={onCategoryColorChange}
      />
      <Stack spacing={1}>
        {items.map(({ expenseEntry, index, resolvedAmount }) => (
          <ExpenseEntryCard
            expenseEntry={expenseEntry}
            resolvedAmount={resolvedAmount}
            color={categoryColor}
            onClick={onExpenseClick(index)}
            key={`expense-entry-${index}`}
          />
        ))}
      </Stack>
    </Grid>
  );
};

export default BudgetCategorySection;
