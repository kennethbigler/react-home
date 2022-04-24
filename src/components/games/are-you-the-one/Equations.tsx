import React from "react";
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { DBRootState } from "../../../store/types";

interface EquationsProps {
  ladies: string[];
  gents: string[];
}

interface AYTOHist {
  value: number;
  maxOdds: number;
}

const Equations = (props: EquationsProps) => {
  const { ladies, gents } = props;
  // Redux
  const { roundPairings, noMatch, matches } = useSelector(
    (state: DBRootState) => ({ ...state.ayto })
  );
  const hist: AYTOHist[][] = [];
  const tempScore: number[] = [];
  const totals: number[] = [];

  // create histogram
  roundPairings.forEach(({ score, pairs }, ri) => {
    tempScore[ri] = score;
    totals[ri] = ladies.length;
    pairs.forEach((gi, li) => {
      if (li < 0 || gi < 0 || noMatch[li][gi]) {
        totals[ri] -= 1;
      }
      if (matches[li] === gi) {
        tempScore[ri] -= 1;
        totals[ri] -= 1;
      }
      !hist[li] && (hist[li] = []);
      !hist[li][gi] && (hist[li][gi] = { value: 0, maxOdds: 0 });
      hist[li][gi].value += 1;
    });
  });

  roundPairings.forEach(({ pairs }, ri) => {
    pairs.forEach((gi, li) => {
      const odds = Math.floor((tempScore[ri] * 100) / totals[ri]);
      hist[li][gi].maxOdds = Math.max(hist[li][gi].maxOdds, odds);
    });
  });

  return (
    <div>
      <h1>Equations</h1>
      <Stack spacing={2} direction="row">
        {roundPairings.map(({ pairs }, ri) => {
          const equation = pairs.map((gi, li) => {
            // if noMatch or match, skip
            if (li < 0 || gi < 0 || noMatch[li][gi] || matches[li] === gi) {
              return null;
            }
            const isRepeat = hist[li][gi].value > 1;
            return (
              <Chip
                key={`eq-r${ri}-l${li}-g${gi}`}
                label={`${ladies[li]}-${gents[gi]}${
                  isRepeat ? ` ${hist[li][gi].value}` : ""
                } - ${hist[li][gi].maxOdds}%`}
                color={isRepeat ? "primary" : "default"}
              />
            );
          });
          return !equation.every((e) => e === null) ? (
            <Stack key={`equation-${ri}`} spacing={1}>
              {equation}
              <Chip label={tempScore[ri]} color="success" />
            </Stack>
          ) : null;
        })}
      </Stack>
    </div>
  );
};

export default Equations;
