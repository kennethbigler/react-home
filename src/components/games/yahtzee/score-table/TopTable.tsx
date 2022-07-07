import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { BottomGameScore, TopGameScore } from "../types";
import { Dice } from "../../../../recoil/yahtzee-state";
import TopScores from "./TopScores";
import { hasXDice } from "./scoreTableHelper";

interface TopTableProps {
  finalTopSum: number;
  getScoreButton: (
    showButton: boolean,
    points: number,
    wasTop: boolean,
    i: number
  ) => React.ReactNode;
  showScoreButtons: boolean;
  style: React.CSSProperties;
  top: TopGameScore[];
  bottom: BottomGameScore[];
  topSum: number;
  values: Dice[];
}

const TopTable: React.FC<TopTableProps> = (props: TopTableProps) => {
  const {
    bottom,
    values,
    showScoreButtons,
    getScoreButton,
    top,
    style,
    topSum,
    finalTopSum,
  } = props;

  const getButtonInfo = (d: number): [number, number] =>
    values.reduce(
      (count, val) => {
        if (val === d) {
          count[0] += 1;
          count[1] += d;
        }
        return count;
      },
      [0, 0]
    );

  const hasYahtzee = bottom[5].score > 0;
  const yahtzeeBonus = hasYahtzee && hasXDice(values, 5);

  const getTopTableButtons = (
    score: number,
    showButton: boolean,
    sum: number,
    i: number
  ): React.ReactNode | null => {
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
            <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
            <TableCell>{`Add Only ${name}`}</TableCell>
            <TableCell style={style}>
              {getTopTableButtons(score, showButton, sum, i)}
            </TableCell>
          </TableRow>
        );
      })}
      <TopScores topSum={topSum} finalTopSum={finalTopSum} style={style} />
    </>
  );
};

export default TopTable;
