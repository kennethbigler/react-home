import { useState, ChangeEvent } from "react";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { RoundPairing } from "../../../../jotai/are-you-the-one-state";
import { AYTOHist } from "../histogram/useHist";
import MatchedStack from "./MatchedStack";
import CalculatedStack from "./CalculatedStack";
import { Typography } from "@mui/material";

export interface AnalysisProps {
  /** [i: { pairs, score }] */
  calculatedEquations: RoundPairing[];
  /** gents names */
  gents: string[];
  /** [lady-i: [gent-i: { odds, rounds together }]] */
  hist: AYTOHist[][];
  /** ladies names */
  ladies: string[];
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  /** [round-i: number of confirmed matches] */
  tempScore: number[];
}

const Analysis = ({
  gents,
  ladies,
  matches,
  noMatch,
  roundPairings,
  hist,
  tempScore,
  calculatedEquations,
}: AnalysisProps) => {
  // state
  const [showAll, setShowAll] = useState(false);

  // handlers
  const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setShowAll(event.target.checked);
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h2" component="h1">
          Analysis
        </Typography>
        <FormControlLabel
          control={<Switch checked={showAll} onChange={handleSwitch} />}
          label="Show All Couples"
        />
      </Stack>
      <Stack
        spacing={1}
        direction="row-reverse"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
      >
        {roundPairings.map(({ pairs, score }, ri) => (
          <MatchedStack
            key={`matched-stack-${ri}`}
            gents={gents}
            ladies={ladies}
            matches={matches}
            noMatch={noMatch}
            pairs={pairs}
            score={score}
            ri={ri}
            hist={hist}
            tempScore={tempScore}
            showAll={showAll}
          />
        ))}
      </Stack>
      {calculatedEquations.length > 0 && <hr aria-hidden />}
      <Stack spacing={1} direction="row" flexWrap="wrap">
        {calculatedEquations.map(({ pairs, score }, cei) => (
          <CalculatedStack
            key={`calculated-stack-${cei}`}
            cei={cei}
            pairs={pairs}
            score={score}
            gents={gents}
            ladies={ladies}
            hist={hist}
          />
        ))}
      </Stack>
    </div>
  );
};

export default Analysis;
