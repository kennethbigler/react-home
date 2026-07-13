import { Grid, Stack, Typography } from "@mui/material";
import usDollar from "../../../../apis/usDollar";
import type { ExpenseEntryColor } from "../../../../jotai/finances-atom";
import CategoryColorSelect from "./CategoryColorSelect";
import ExpenseEntryCard from "./ExpenseEntryCard";
import type { CategoryTotal } from "./helpers";

interface BudgetCategorySectionProps {
  category: CategoryTotal;
  categoryCount: number;
  categoryColor?: ExpenseEntryColor;
  isSelected: boolean;
  onCategorySelect: (categoryKey: string | null) => void;
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
  isSelected,
  onCategorySelect,
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
        component="button"
        type="button"
        gutterBottom
        {...(categoryColor ? { color: categoryColor } : {})}
        onClick={() => onCategorySelect(isSelected ? null : categoryKey)}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "left",
          border: "none",
          background: "none",
          cursor: "pointer",
          font: "inherit",
          textTransform: "uppercase",
          ...(categoryColor ? {} : { color: "text.primary" }),
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
