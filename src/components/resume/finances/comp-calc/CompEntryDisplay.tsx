import { Grid, Typography } from "@mui/material";
import type { CompCalcEntry, CompEntry } from "@/jotai/comp-calc-atom";
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
      <Typography id="adjusted-stock-note">
        * values use the latest stock price shown above.
      </Typography>
    </Grid>
    {compEntries
      .map((compEntry, i) => (
        <CompEntryCard
          compEntry={compEntry}
          compCalcEntry={compCalcEntries[i]}
          compEntryCount={compEntries.length}
          adjustedValueDescriptionId="adjusted-stock-note"
          onClick={onClick(i)}
          key={`comp-calc-entry-${i}`}
        />
      ))
      .toReversed()}
  </Grid>
);

export default CompEntryDisplay;
