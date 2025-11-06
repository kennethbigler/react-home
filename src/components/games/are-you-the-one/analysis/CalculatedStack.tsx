import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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

const CalculatedStack = ({
  cei,
  pairs,
  score,
  gents,
  ladies,
  hist,
}: CalculatedStackProps) => (
  <Stack spacing={1}>
    <Typography variant="h4" component="h3" style={{ textAlign: "center" }}>
      Calculated {cei + 1}
    </Typography>
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
