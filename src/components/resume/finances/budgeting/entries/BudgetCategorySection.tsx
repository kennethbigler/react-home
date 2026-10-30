import EditIcon from "@mui/icons-material/Edit";
import {
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  isRecommendedCategory,
  type CategoryTotal,
  type ExpenseEntryColor,
} from "@/apis/budget";
import usDollar from "@/apis/usDollar";
import ExpenseEntryCard from "./ExpenseEntryCard";

interface BudgetCategorySectionProps {
  category: CategoryTotal;
  categoryCount: number;
  categoryColor?: ExpenseEntryColor;
  onExpenseClick: (index: number) => () => void;
  onEditCategory?: () => void;
}

const RecommendedProgress = ({
  heading,
  total,
  target,
  remaining,
  overIsGood,
}: {
  heading: string;
  total: number;
  target: number;
  remaining: number;
  overIsGood: boolean;
}) => {
  const isOver = remaining < 0;
  // Over target is an error, except buckets like saving where over is a win.
  const statusColor = isOver ? (overIsGood ? "success" : "error") : undefined;
  const value = target > 0 ? Math.min(100, (total / target) * 100) : 100;

  return (
    <Stack spacing={0.5} sx={{ mb: 1 }}>
      <LinearProgress
        variant="determinate"
        value={value}
        color={statusColor ?? "primary"}
        aria-label={`${heading} spent of target`}
      />
      <Typography variant="body2" color={statusColor ?? "text.secondary"}>
        {`${usDollar.format(total)} of ${usDollar.format(target)} · ${usDollar.format(Math.abs(remaining))} ${isOver ? "over" : "left"}`}
      </Typography>
    </Stack>
  );
};

const BudgetCategorySection = ({
  category,
  categoryCount,
  categoryColor,
  onExpenseClick,
  onEditCategory,
}: BudgetCategorySectionProps) => {
  const { heading, total, items } = category;
  const recommended = isRecommendedCategory(category) ? category : undefined;
  const title = recommended
    ? `${heading} (${recommended.percent}%)`
    : `${heading} (${usDollar.format(total)})`;

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
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography
          variant="h6"
          gutterBottom
          {...(categoryColor ? { color: categoryColor } : {})}
          sx={{ textTransform: "uppercase" }}
        >
          {title}
        </Typography>
        {onEditCategory ? (
          <IconButton
            size="small"
            onClick={onEditCategory}
            aria-label={`Edit ${heading} category`}
            sx={{ ml: "auto", mb: 0.5 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Stack>
      {recommended ? (
        <RecommendedProgress
          heading={heading}
          total={total}
          target={recommended.target}
          remaining={recommended.remaining}
          overIsGood={recommended.overIsGood}
        />
      ) : null}
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
