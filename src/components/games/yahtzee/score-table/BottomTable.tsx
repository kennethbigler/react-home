import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TopGameScore, BottomGameScore, ADD_DICE } from "../types";
import { Dice } from "../../../../recoil/yahtzee-atom";
import {
  hasXDice,
  isFullHouse,
  isStraight,
  canYahtzeeBonus,
} from "./scoreTableHelper";
import BottomScores from "./BottomScores";

interface BottomTableProps {
  bottom: BottomGameScore[];
  bottomSum: number;
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
  values: Dice[];
}

const getDiceValue = (values: Dice[]): number =>
  values.reduce((sum: number, d) => sum + d, 0);

const showButton = (i: number, values: Dice[]): boolean => {
  switch (i) {
    case 0: // 3 of a kind
      return hasXDice(values, 3);
    case 1: // 4 of a kind
      return hasXDice(values, 4);
    case 2: // Full House
      return isFullHouse(values);
    case 3: // Sm. Straight
      return isStraight(values, 4);
    case 4: // Lg. Straight
      return isStraight(values, 5);
    case 5: // Yahtzee
      return hasXDice(values, 5);
    case 6: // Chance
      return true;
    default:
      // eslint-disable-next-line no-console
      console.error("Unexpected Value");
      return false;
  }
};

const BottomTable: React.FC<BottomTableProps> = (props: BottomTableProps) => {
  const { values, showScoreButtons, getScoreButton, top } = props;
  const getBottomTableButtons = React.useCallback(
    (
      score: number,
      points: number,
      hasYahtzee: boolean,
      i: number
    ): React.ReactNode | null => {
      if (score >= 0) {
        return score;
      }
      if (showScoreButtons) {
        // Yahtzee Bonus
        if (hasYahtzee) {
          if (canYahtzeeBonus(values, top)) {
            return getScoreButton(true, points + 100, false, i);
          }
        }
        return getScoreButton(showButton(i, values), points, false, i);
      }
      return null;
    },
    [getScoreButton, showScoreButtons, top, values]
  );

  const { bottom, style } = props;
  const generateBottomTable = React.useCallback((): React.ReactNode => {
    const hasYahtzee = bottom[5].score > 0;
    return bottom.map((gameScore, i) => {
      const { name, hint, points, score } = gameScore;

      const parsedPoints = points === ADD_DICE ? getDiceValue(values) : points;

      return (
        <TableRow key={name}>
          <TableCell>{name}</TableCell>
          <TableCell>{hint}</TableCell>
          <TableCell style={style}>
            {getBottomTableButtons(score, parsedPoints, hasYahtzee, i)}
          </TableCell>
        </TableRow>
      );
    });
  }, [bottom, getBottomTableButtons, style, values]);

  const { finalTopSum, bottomSum } = props;

  return (
    <>
      {generateBottomTable()}
      <BottomScores
        bottomSum={bottomSum}
        finalTopSum={finalTopSum}
        style={style}
      />
    </>
  );
};

export default BottomTable;
