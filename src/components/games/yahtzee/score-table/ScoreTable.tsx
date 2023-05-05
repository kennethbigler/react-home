import * as React from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { TopGameScore, BottomGameScore } from "../types";
import { Dice } from "../../../../recoil/yahtzee-state";
import Header from "./Header";
import TopTable from "./TopTable";
import BottomTable from "./BottomTable";

interface ScoreTableProps {
  bottom: BottomGameScore[];
  bottomSum: number;
  finalTopSum: number;
  onTopScore: (points: number, i: number) => void;
  onBottomScore: (points: number, i: number) => void;
  showScoreButtons: boolean;
  top: TopGameScore[];
  topSum: number;
  values: Dice[];
}

const centerStyle: React.CSSProperties = { textAlign: "center" };

const ScoreTable: React.FC<ScoreTableProps> = (props: ScoreTableProps) => {
  const {
    bottom,
    bottomSum,
    finalTopSum,
    showScoreButtons,
    top,
    topSum,
    values,
    onTopScore,
    onBottomScore,
  } = props;

  const getScoreButton = React.useCallback(
    (
      showButton: boolean,
      points: number,
      wasTop: boolean,
      i: number
    ): React.ReactNode =>
      showButton ? (
        <Button
          color="secondary"
          variant="outlined"
          onClick={
            wasTop
              ? (): void => onTopScore(points, i)
              : (): void => onBottomScore(points, i)
          }
        >
          {`Add ${points} Points`}
        </Button>
      ) : (
        <Button
          color="secondary"
          variant="outlined"
          onClick={
            wasTop
              ? (): void => onTopScore(0, i)
              : (): void => onBottomScore(0, i)
          }
        >
          0
        </Button>
      ),
    [onBottomScore, onTopScore]
  );

  return (
    <Table size="small">
      <Header sx={centerStyle} />
      <TableBody>
        <TopTable
          finalTopSum={finalTopSum}
          getScoreButton={getScoreButton}
          showScoreButtons={showScoreButtons}
          sx={centerStyle}
          top={top}
          values={values}
          bottom={bottom}
          topSum={topSum}
        />
        <BottomTable
          finalTopSum={finalTopSum}
          getScoreButton={getScoreButton}
          showScoreButtons={showScoreButtons}
          sx={centerStyle}
          top={top}
          values={values}
          bottom={bottom}
          bottomSum={bottomSum}
        />
      </TableBody>
    </Table>
  );
};

export default ScoreTable;
