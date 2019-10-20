import React from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { Dice, TopGameScore, BottomGameScore } from '../types';
import Header from './Header';
import TopTable from './TopTable';
import BottomTable from './BottomTable';

interface ScoreTableProps {
  bottom: BottomGameScore[];
  bottomSum: number;
  finalTopSum: number;
  onTopScore: Function;
  onBottomScore: Function;
  showScoreButtons: boolean;
  top: TopGameScore[];
  topSum: number;
  values: Dice[];
}

const centerStyle: React.CSSProperties = { textAlign: 'center' };

const ScoreTable: React.FC<ScoreTableProps> = (props: ScoreTableProps) => {
  const getScoreButton = (showButton: boolean, points: number, top: boolean, i: number): React.ReactNode => {
    // eslint-disable-next-line react/prop-types
    const { onTopScore, onBottomScore } = props;
    return showButton
      ? (
        <Button
          color="primary"
          variant="outlined"
          onClick={top
            ? (): void => onTopScore(points, i)
            : (): void => onBottomScore(points, i)}
        >
          {`Add ${points} Points`}
        </Button>
      ) : (
        <Button
          color="primary"
          variant="outlined"
          onClick={top
            ? (): void => onTopScore(0, i)
            : (): void => onBottomScore(0, i)}
        >
          0
        </Button>
      );
  };

  const {
    bottom, bottomSum, finalTopSum, showScoreButtons,
    top, topSum, values,
  } = props;

  return (
    <Table size="small">
      <Header style={centerStyle} />
      <TableBody>
        <TopTable
          finalTopSum={finalTopSum}
          getScoreButton={getScoreButton}
          showScoreButtons={showScoreButtons}
          style={centerStyle}
          top={top}
          values={values}
          topSum={topSum}
        />
        <BottomTable
          finalTopSum={finalTopSum}
          getScoreButton={getScoreButton}
          showScoreButtons={showScoreButtons}
          style={centerStyle}
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
