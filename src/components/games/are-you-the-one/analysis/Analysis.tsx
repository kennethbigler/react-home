import * as React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { RoundPairing } from "../../../../recoil/are-you-the-one-atom";
import { ChipColorOptions } from "../types";
import { AYTOHist } from "./useHist";

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

const Analysis = (props: AnalysisProps) => {
  const {
    gents,
    ladies,
    matches,
    noMatch,
    roundPairings,
    hist,
    tempScore,
    calculatedEquations,
  } = props;

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
          control={
            <Switch checked={showAll} onChange={handleSwitch} name="show-all" />
          }
          label="Show All Couples"
        />
      </Stack>
      <Stack spacing={1} direction="row" flexWrap="wrap">
        {roundPairings.map(({ pairs, score }, ri) => {
          const equation: React.ReactNode[] = [];
          let numNoMatches = 0;
          let numMatchAndRepeat = 0;
          pairs.forEach((gi, li) => {
            // if cleared pairing
            if (li < 0 || gi < 0 || li === undefined || gi === undefined) {
              return;
            }

            const isRepeat = hist[li][gi].rounds.length > 1;
            let color: ChipColorOptions = isRepeat ? "primary" : "default";

            if (!showAll) {
              // hide matches and noMatches
              if (noMatch[li][gi] || matches[li] === gi) {
                return;
              }
            } else {
              // no match chip
              if (noMatch[li][gi]) {
                color = "error";
              }
              // match chip
              if (matches[li] === gi) {
                color = "success";
              }
            }

            const label = `${ladies[li]}-${gents[gi]}${
              isRepeat ? ` ${hist[li][gi].rounds.length}` : ""
            } - ${hist[li][gi].odds}%`;

            const chip = (
              <Chip
                key={`eq-r${ri}-l${li}-g${gi}`}
                label={label}
                color={color}
              />
            );

            // create equation chips: matches > repeats > first time > no match
            switch (color) {
              case "success":
                numMatchAndRepeat += 1;
                equation.unshift(chip);
                return;
              case "error":
                numNoMatches += 1;
                equation.push(chip);
                return;
              case "primary":
                equation.splice(numMatchAndRepeat, 0, chip);
                numMatchAndRepeat += 1;
                return;
              default:
                equation.splice(equation.length - numNoMatches, 0, chip);
            }
          });

          // return each equation stack
          return !equation.every((e) => e === null) ? (
            <Stack key={`equation-${ri}`} spacing={1}>
              <h2 style={{ textAlign: "center" }}>Matchup {ri + 1}</h2>
              {equation}
              <Chip
                label={showAll ? score : score - tempScore[ri]}
                color="warning"
              />
            </Stack>
          ) : null;
        })}
      </Stack>
      {calculatedEquations.length > 0 && <hr />}
      <Stack spacing={1} direction="row" flexWrap="wrap">
        {calculatedEquations.map(({ pairs, score }, cei) => (
          <Stack key={`equation-${cei}`} spacing={1}>
            <h2 style={{ textAlign: "center" }}>Calculated {cei + 1}</h2>
            {pairs.map((gi, li) => (
              <Chip
                key={`eq-calc-l${li}-g${gi}`}
                label={`${ladies[li]}-${gents[gi]} ${hist[li][gi].rounds.length} - ${hist[li][gi].odds}%`}
                color="primary"
              />
            ))}
            <Chip label={`max ${score}`} color="warning" />
          </Stack>
        ))}
      </Stack>
    </div>
  );
};

export default Analysis;
