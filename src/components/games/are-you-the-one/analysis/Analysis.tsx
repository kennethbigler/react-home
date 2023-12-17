import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { RoundPairing } from "../../../../recoil/are-you-the-one-atom";
import { AYTOHist } from "./useHist";
import MatchedStack from "./MatchedStack";
import CalculatedStack from "./CalculatedStack";

export interface AnalysisProps {
  calculatedEquations: RoundPairing[];
  gents: string[];
  hist: AYTOHist[][];
  ladies: string[];
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  tempScore: number[];
}

const Analysis: React.FC<AnalysisProps> = ({
  gents,
  ladies,
  matches,
  noMatch,
  roundPairings,
  hist,
  tempScore,
  calculatedEquations,
}) => {
  // state
  const [showAll, setShowAll] = React.useState(false);

  // handlers
  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAll(event.target.checked);
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between">
        <h1>Analysis</h1>
        <FormControlLabel
          control={<Switch checked={showAll} onChange={handleSwitch} />}
          label="Show All Couples"
        />
      </Stack>
      <Stack spacing={1} direction="row" flexWrap="wrap">
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
      {calculatedEquations.length > 0 && <hr />}
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
