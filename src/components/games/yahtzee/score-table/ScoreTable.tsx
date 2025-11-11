import { useCallback, ReactElement, CSSProperties } from "react";
import { TopGameScore, BottomGameScore } from "../types";
import { Dice } from "../../../../jotai/yahtzee-state";
import Header from "./Header";
import TopTable from "./TopTable";
import BottomTable from "./BottomTable";
import { Button, Table, TableBody } from "@mui/material";

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

const centerStyle: CSSProperties = { textAlign: "center" };

const ScoreTable = ({
  bottom,
  bottomSum,
  finalTopSum,
  showScoreButtons,
  top,
  topSum,
  values,
  onTopScore,
  onBottomScore,
}: ScoreTableProps) => {
  const getScoreButton = useCallback(
    (
      showButton: boolean,
      points: number,
      wasTop: boolean,
      i: number,
    ): ReactElement =>
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
    [onBottomScore, onTopScore],
  );

  return (
    <Table size="small" aria-label="yahtzee game table">
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
