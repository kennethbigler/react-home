import { Grid } from "@mui/material";
import { ExpenseEntry } from "../../../../jotai/finances-atom";
import ExpenseEntryCard from "./ExpenseEntryCard";

interface ExpenseEntryDisplayProps {
  expenseEntries: ExpenseEntry[];
  onClick: (i: number) => () => void;
}

const ExpenseEntryDisplay = ({
  expenseEntries,
  onClick,
}: ExpenseEntryDisplayProps) => (
  <Grid container spacing={1}>
    {expenseEntries
      .map((expenseEntry, i) => (
        <ExpenseEntryCard
          expenseEntry={expenseEntry}
          expenseEntryCount={expenseEntries.length}
          onClick={onClick(i)}
          key={`expense-entry-${i}`}
        />
      ))
      .reverse()}
  </Grid>
);

export default ExpenseEntryDisplay;
