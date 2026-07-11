import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import usDollar from "../../../../apis/usDollar";
import { ExpenseEntry } from "../../../../jotai/finances-atom";

interface ExpenseEntryCardProps {
  expenseEntry: ExpenseEntry;
  expenseEntryCount: number;
  onClick: () => void;
}

const ExpenseEntryCard = ({
  expenseEntry: { name, category, value },
  expenseEntryCount,
  onClick,
}: ExpenseEntryCardProps) => (
  <Grid
    size={{
      xs: 12,
      md: 6,
      lg: 4,
      xl: 3,
      xxl: expenseEntryCount > 4 ? 2 : undefined,
      xxxl: expenseEntryCount > 6 ? 1 : undefined,
    }}
  >
    <Card>
      <CardActionArea onClick={onClick}>
        <CardHeader title="Expense" />
        <CardContent>
          <Typography>Name: {name}</Typography>
          <Typography>Category: {category}</Typography>
          <Typography>Amount: {usDollar.format(value)}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default ExpenseEntryCard;
