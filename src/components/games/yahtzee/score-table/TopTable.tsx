import { ReactElement, ReactNode, CSSProperties } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { BottomGameScore, TopGameScore } from "../types";
import { Dice } from "../../../../jotai/yahtzee-state";
import TopScores from "./TopScores";
import { hasXDice } from "./scoreTableHelper";

interface TopTableProps {
  finalTopSum: number;
  getScoreButton: (
    showButton: boolean,
    points: number,
    wasTop: boolean,
    i: number,
  ) => ReactElement;
  showScoreButtons: boolean;
  sx: CSSProperties;
  top: TopGameScore[];
  bottom: BottomGameScore[];
  topSum: number;
  values: Dice[];
}

const TopTable = ({
  bottom,
  values,
  showScoreButtons,
  getScoreButton,
  top,
  sx,
  topSum,
  finalTopSum,
}: TopTableProps) => {
  const getButtonInfo = (d: number): [number, number] =>
    values.reduce(
      (count, val) => {
        if (val === d) {
          count[0] += 1;
          count[1] += d;
        }
        return count;
      },
      [0, 0],
    );

  const hasYahtzee = bottom[5].score > 0;
  const yahtzeeBonus = hasYahtzee && hasXDice(values, 5);

  const getTopTableButtons = (
    score: number,
    showButton: boolean,
    sum: number,
    i: number,
  ): ReactNode | null => {
    if (score >= 0) {
      return score;
    }
    return showScoreButtons
      ? getScoreButton(showButton, yahtzeeBonus ? sum + 100 : sum, true, i)
      : null;
  };

  return (
    <>
      {top.map(({ name, score }, i) => {
        const d = i + 1;
        const [count, sum] = getButtonInfo(d);
        const showButton = count >= 1;

        return (
          <TableRow key={name}>
            <TableCell
              component="th"
              scope="row"
            >{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
            <TableCell>{`Add Only ${name}`}</TableCell>
            <TableCell sx={sx}>
              {getTopTableButtons(score, showButton, sum, i)}
            </TableCell>
          </TableRow>
        );
      })}
      <TopScores topSum={topSum} finalTopSum={finalTopSum} sx={sx} />
    </>
  );
};

export default TopTable;
