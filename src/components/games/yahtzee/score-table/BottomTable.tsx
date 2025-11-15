import { useCallback, ReactElement, ReactNode, CSSProperties } from "react";
import { TopGameScore, BottomGameScore, ADD_DICE } from "../types";
import { Dice } from "../../../../jotai/yahtzee-state";
import {
  hasXDice,
  isFullHouse,
  isStraight,
  canYahtzeeBonus,
} from "./scoreTableHelper";
import BottomScores from "./BottomScores";
import { TableCell, TableRow } from "@mui/material";

interface BottomTableProps {
  bottom: BottomGameScore[];
  bottomSum: number;
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

const BottomTable = ({
  values,
  showScoreButtons,
  getScoreButton,
  top,
  bottom,
  sx,
  finalTopSum,
  bottomSum,
}: BottomTableProps) => {
  const getBottomTableButtons = useCallback(
    (
      score: number,
      points: number,
      hasYahtzee: boolean,
      i: number,
    ): ReactNode | null => {
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
    [getScoreButton, showScoreButtons, top, values],
  );

  const generateBottomTable = useCallback((): ReactNode => {
    const hasYahtzee = bottom[5].score > 0;
    return bottom.map((gameScore, i) => {
      const { name, hint, points, score } = gameScore;

      const parsedPoints = points === ADD_DICE ? getDiceValue(values) : points;

      return (
        <TableRow key={name}>
          <TableCell component="th" scope="row">
            {name}
          </TableCell>
          <TableCell>{hint}</TableCell>
          <TableCell sx={sx}>
            {getBottomTableButtons(score, parsedPoints, hasYahtzee, i)}
          </TableCell>
        </TableRow>
      );
    });
  }, [bottom, getBottomTableButtons, sx, values]);

  return (
    <>
      {generateBottomTable()}
      <BottomScores bottomSum={bottomSum} finalTopSum={finalTopSum} sx={sx} />
    </>
  );
};

export default BottomTable;
