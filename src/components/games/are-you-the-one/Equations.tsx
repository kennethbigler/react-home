import React from "react";
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { DBRootState } from "../../../store/types";

interface EquationsProps {
  ladies: string[];
  gents: string[];
}

const Equations = (props: EquationsProps) => {
  const { ladies, gents } = props;
  // Redux
  const { roundPairings, noMatch, matches } = useSelector(
    (state: DBRootState) => ({ ...state.ayto })
  );
  const hist: number[][] = [];

  // create histogram
  roundPairings.forEach((RP) => {
    RP.pairs.forEach((gi, li) => {
      !hist[li] && (hist[li] = []);
      hist[li][gi] = !hist[li][gi] ? 1 : hist[li][gi] + 1;
    });
  });

  return (
    <div>
      <h1>Equations</h1>
      <Stack spacing={2}>
        {roundPairings.map(({ pairs, score }, ri) => {
          let tempScore = score;
          const equation = pairs.map((gi, li) => {
            // if noMatch, skip
            if (noMatch[li][gi]) {
              return null;
            }
            if (matches[li] === gi) {
              tempScore -= 1;
              return null;
            }
            const isRepeat = hist[li][gi] > 1;
            return (
              <Chip
                key={`eq-r${ri}-l${li}-g${gi}`}
                label={`${ladies[li]}-${gents[gi]} ${
                  isRepeat ? hist[li][gi] : ""
                }`}
                color={isRepeat ? "primary" : "default"}
              />
            );
          });
          return (
            <Stack key={`equation-${ri}`} direction="row" spacing={1}>
              {equation}
              <Chip label={tempScore} color="success" />
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
};

export default Equations;
