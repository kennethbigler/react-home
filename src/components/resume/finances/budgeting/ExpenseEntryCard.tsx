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

interface ExpenseEntryCardProps {
  expenseEntry: ExpenseEntry;
  color?: ExpenseEntryColor;
  onClick: () => void;
}

const ExpenseEntryCard = ({
  expenseEntry: { name, category, value },
  color,
  onClick,
}: ExpenseEntryCardProps) => (
  <Card>
    <CardActionArea onClick={onClick}>
      <CardHeader title="Expense" />
      <CardContent>
        <Typography>Name: {name}</Typography>
        <Typography>Category: {category}</Typography>
        <Typography sx={{ display: "inline" }}>Amount: </Typography>
        <Typography
          sx={{ display: "inline", fontWeight: "bold" }}
          color={color}
        >
          {usDollar.format(value)}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default ExpenseEntryCard;
