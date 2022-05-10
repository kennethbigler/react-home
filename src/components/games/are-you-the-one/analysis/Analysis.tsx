import React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { RoundPairing } from "../../../../store/types";
import useHist from "./useHist";

interface AnalysisProps {
  gents: string[];
  ladies: string[];
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
}

const Analysis = (props: AnalysisProps) => {
  const { gents, ladies, matches, noMatch, roundPairings } = props;

  // state
  const [showAll, setShowAll] = React.useState(false);
  const { hist, tempScore, calculatedEquations } = useHist(
    ladies.length,
    matches,
    noMatch,
    roundPairings
  );

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
          const equation = pairs.map((gi, li) => {
            // if cleared pairing
            if (li < 0 || gi < 0) {
              return null;
            }

            const isRepeat = hist[li][gi].rounds.length > 1;
            // TODO: make color options type
            let color: "primary" | "default" | "error" | "success" = isRepeat
              ? "primary"
              : "default";

            if (!showAll) {
              // hide matches and noMatches
              if (noMatch[li][gi] || matches[li] === gi) {
                return null;
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

            // create equation chips
            return (
              <Chip
                key={`eq-r${ri}-l${li}-g${gi}`}
                label={label}
                color={color}
              />
            );
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
            <Chip label={score} color="warning" />
          </Stack>
        ))}
      </Stack>
    </div>
  );
};

export default Analysis;
