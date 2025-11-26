import { memo } from "react";
import { Typography } from "@mui/material";

interface ScoreSummaryProps {
  winner: "we" | "they";
  madeBid: boolean;
  aboveTheLine: number;
  belowTheLine: number;
}

const ScoreSummary = memo(
  ({ winner, madeBid, aboveTheLine, belowTheLine }: ScoreSummaryProps) => (
    <div style={{ marginTop: 10 }}>
      <Typography variant="h6">Score</Typography>
      {madeBid ? (
        <Typography>Declarer ({winner}) won the hand!</Typography>
      ) : (
        <Typography>Defender ({winner}) successfully defended!</Typography>
      )}
      {madeBid && <Typography>Above the line: {aboveTheLine}</Typography>}
      <Typography>Below the line: {belowTheLine}</Typography>
    </div>
  ),
);

ScoreSummary.displayName = "ScoreSummary";

export default ScoreSummary;
