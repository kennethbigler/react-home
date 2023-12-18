import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { AYTOHist } from "../histogram/useHist";

export interface CalculatedStackProps {
  gents: string[];
  hist: AYTOHist[][];
  ladies: string[];
  cei: number;
  pairs: number[];
  score: number;
}

const CalculatedStack: React.FC<CalculatedStackProps> = ({
  cei,
  pairs,
  score,
  gents,
  ladies,
  hist,
}) => (
  <Stack spacing={1}>
    <h2 style={{ textAlign: "center" }}>Calculated {cei + 1}</h2>
    {pairs.map((gi, li) => (
      <Chip
        key={`calc-l${li}-g${gi}`}
        label={`${ladies[li]}-${gents[gi]} ${hist[li][gi].rounds.length} - ${hist[li][gi].odds}%`}
        color="primary"
      />
    ))}
    <Chip label={`max ${score}`} color="warning" />
  </Stack>
);

export default CalculatedStack;
