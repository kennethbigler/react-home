import { ReactElement } from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { ChipColorOptions } from "../types";
import { AYTOHist } from "../histogram/useHist";

export interface MatchedStackProps {
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
  /** couples paired together, [lady-i: gent-i] */
  pairs: number[];
  /** [ri: number of confirmed matches] */
  tempScore: number[];
  // simple variables
  ri: number;
  score: number;
  showAll: boolean;
}

const MatchedStack = ({
  gents,
  ladies,
  matches,
  noMatch,
  pairs,
  score,
  ri,
  hist,
  tempScore,
  showAll,
}: MatchedStackProps) => {
  const equation: ReactElement[] = [];
  let numNoMatches = 0;
  let numMatchAndRepeat = 0;
  pairs.forEach((gi, li) => {
    // if cleared pairing
    if (li < 0 || gi < 0 || li === undefined || gi === undefined) {
      return;
    }
    // if not show all, hide matches and noMatches
    if (!showAll && (noMatch[li][gi] || matches[li] === gi)) {
      return;
    }

    const isRepeat = hist[li][gi].rounds.length > 1;
    // get color
    let color: ChipColorOptions = isRepeat ? "primary" : "default";
    if (noMatch[li][gi]) {
      color = "error"; // no match chip
    } else if (matches[li] === gi) {
      color = "success"; // match chip
    }
    // get labels
    const label = `${ladies[li]}-${gents[gi]}${
      isRepeat ? ` ${hist[li][gi].rounds.length}` : ""
    } - ${hist[li][gi].odds}%`;
    // get chip
    const chip = (
      <Chip key={`match-r${ri}-l${li}-g${gi}`} label={label} color={color} />
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
    <Stack spacing={1}>
      <h2 style={{ textAlign: "center" }}>Matchup {ri + 1}</h2>
      {equation}
      <Chip label={showAll ? score : score - tempScore[ri]} color="warning" />
    </Stack>
  ) : null;
};

export default MatchedStack;
