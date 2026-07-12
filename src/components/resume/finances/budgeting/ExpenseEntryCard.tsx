import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
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
  const { name, category, value, valueMode } = expenseEntry;
  const sources =
    valueMode === "percent" ? getPercentSources(expenseEntry) : [];
  const allocationLabel =
    valueMode === "percent" && sources.length > 0
      ? `${value}% of ${formatPercentSources(sources)}`
      : null;

  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardHeader title="Expense" />
        <CardContent>
          <Typography>Name: {name}</Typography>
          <Typography>Category: {category}</Typography>
          {allocationLabel && (
            <Typography variant="body2" color="text.secondary">
              Allocation: {allocationLabel}
            </Typography>
          )}
          <Typography sx={{ display: "inline" }}>Amount: </Typography>
          <Typography
            sx={{ display: "inline", fontWeight: "bold" }}
            color={color}
          >
            {usDollar.format(resolvedAmount)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExpenseEntryCard;
