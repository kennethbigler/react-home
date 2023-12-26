import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { AYTOHist } from "../histogram/useHist";

export interface CalculatedStackProps {
  /** gents names */
  gents: string[];
  /** [lady-i: [gent-i: { odds, rounds together }]] */
  hist: AYTOHist[][];
  /** ladies names */
  ladies: string[];
  /** couples paired together, [lady-i: gent-i] */
  pairs: number[];
  // simple variables
  cei: number;
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
