import { Chip } from "@mui/material";
import { formatPercentSources, getPercentSources } from "@/apis/budget";
import usDollar from "@/apis/usDollar";
import type { ExpenseEntry, ExpenseEntryColor } from "@/apis/budget";

interface ExpenseEntryCardProps {
  expenseEntry: ExpenseEntry;
  resolvedAmount: number;
  color?: ExpenseEntryColor;
  onClick: () => void;
}

const ExpenseEntryCard = ({
  expenseEntry,
  resolvedAmount,
  color,
  onClick,
}: ExpenseEntryCardProps) => {
  const { name, value, valueMode } = expenseEntry;
  const sources =
    valueMode === "percent" ? getPercentSources(expenseEntry) : [];
  const allocationLabel =
    valueMode === "percent" && sources.length > 0
      ? `${value}% of ${formatPercentSources(sources)}`
      : null;
  const label = `${name}: ${usDollar.format(resolvedAmount)}${allocationLabel ? ` (${allocationLabel})` : ""}`;

  return (
    <Chip
      label={label}
      aria-label={`Edit ${label}`}
      color={color}
      onClick={onClick}
    />
  );
};

export default ExpenseEntryCard;
