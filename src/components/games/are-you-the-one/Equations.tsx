import React from "react";
import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
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

  // state
  const [showAll, setShowAll] = React.useState(false);
  const hist: AYTOHist[][] = [];
  const tempScore: number[] = [];
  const totals: number[] = [];

  // create histogram
  roundPairings.forEach(({ pairs }, ri) => {
    tempScore[ri] = 0;
    totals[ri] = ladies.length;
    pairs.forEach((gi, li) => {
      if (li < 0 || gi < 0 || noMatch[li][gi]) {
        totals[ri] -= 1;
      }
      if (matches[li] === gi) {
        tempScore[ri] += 1;
        totals[ri] -= 1;
      }
      !hist[li] && (hist[li] = []);
      !hist[li][gi] && (hist[li][gi] = { value: 0, maxOdds: 0 });
      hist[li][gi].value += 1;
    });
  });

  roundPairings.forEach(({ pairs, score }, ri) => {
    pairs.forEach((gi, li) => {
      const odds = Math.floor(((score - tempScore[ri]) * 100) / totals[ri]);
      hist[li][gi].maxOdds = Math.max(hist[li][gi].maxOdds, odds);
    });
  });

  // handlers
  const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAll(event.target.checked);
  };

  return (
    <div>
      <Stack direction="row" justifyContent="space-between">
        <h1>Equations</h1>
        <FormControlLabel
          control={
            <Switch checked={showAll} onChange={handleSwitch} name="show-all" />
          }
          label="Show All Couples"
        />
      </Stack>
      <Stack spacing={2} direction="row">
        {roundPairings.map(({ pairs, score }, ri) => {
          const equation = pairs.map((gi, li) => {
            // if noMatch or match, skip
            if (li < 0 || gi < 0) {
              return null;
            }

            const isRepeat = hist[li][gi].value > 1;
            let color: "primary" | "default" | "error" | "success" = isRepeat
              ? "primary"
              : "default";

            if (!showAll) {
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
              isRepeat ? ` ${hist[li][gi].value}` : ""
            } - ${hist[li][gi].maxOdds}%`;

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
              <Chip label={`${score} - ${tempScore[ri]}`} color="warning" />
            </Stack>
          ) : null;
        })}
      </Stack>
    </div>
  );
};

export default Equations;
