import { Chip } from "@mui/material";
import usDollar from "../../../../apis/usDollar";
import {
  ExpenseEntry,
  ExpenseEntryColor,
} from "../../../../jotai/finances-atom";
import { formatPercentSources, getPercentSources } from "./helpers";

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

  return (
    <Chip
      label={`${name}: ${usDollar.format(resolvedAmount)}${allocationLabel ? ` (${allocationLabel})` : ""}`}
      color={color}
      onClick={onClick}
    />
  );
};

export default ExpenseEntryCard;
