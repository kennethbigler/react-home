import { Grid } from "@mui/material";
import {
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
          key={`net-worth-entry-${i}`}
        />
      ))
      .reverse()}
  </Grid>
);

export default NetWorthEntryDisplay;
