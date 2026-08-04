import { Grid } from "@mui/material";
import type {
  NetWorthCalcEntry,
  NetWorthEntry,
} from "../../../../jotai/finances-atom";
import NetWorthEntryCard from "./NetWorthEntryCard";

interface NetWorthEntryDisplayProps {
  entries: NetWorthEntry[];
  calcEntries: NetWorthCalcEntry[];
  categories: string[];
  onClick: (i: number) => () => void;
}

const NetWorthEntryDisplay = ({
  entries,
  calcEntries,
  categories,
  onClick,
}: NetWorthEntryDisplayProps) => (
  <Grid container spacing={1}>
    {entries
      .map((entry, i) => (
        <NetWorthEntryCard
          entry={entry}
          calcEntry={calcEntries[i]}
          categories={categories}
          onClick={onClick(i)}
          // Entry dates are unique (enforced by the entry dialog).
          key={entry.entryDate}
        />
      ))
      .toReversed()}
  </Grid>
);

export default NetWorthEntryDisplay;
