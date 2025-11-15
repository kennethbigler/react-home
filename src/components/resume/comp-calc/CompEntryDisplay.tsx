import { Grid, Typography } from "@mui/material";
import { CompCalcEntry, CompEntry } from "../../../jotai/comp-calculator-atom";
import CompEntryCard from "./CompEntryCard";

interface CompEntryDisplayProps {
  compEntries: CompEntry[];
  compCalcEntries: CompCalcEntry[];
  onClick: (i: number) => () => void;
}

const CompEntryDisplay = ({
  compEntries,
  compCalcEntries,
  onClick,
}: CompEntryDisplayProps) => (
  <Grid container spacing={1}>
    <Grid size={12}>
      <Typography>*value computed from latest stock price above</Typography>
    </Grid>
    {compEntries
      .map((compEntry, i) => (
        <CompEntryCard
          compEntry={compEntry}
          compCalcEntry={compCalcEntries[i]}
          compEntryCount={compEntries.length}
          onClick={onClick(i)}
          key={`comp-calc-entry-${i}`}
        />
      ))
      .reverse()}
  </Grid>
);

export default CompEntryDisplay;
