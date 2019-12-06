import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { TopGameScore } from '../types';
import { Dice } from '../../../../store/types';
import TopScores from './TopScores';

interface TopTableProps {
  finalTopSum: number;
  getScoreButton: Function;
  showScoreButtons: boolean;
  style: React.CSSProperties;
  top: TopGameScore[];
  topSum: number;
  values: Dice[];
}

const TopTable: React.FC<TopTableProps> = (props: TopTableProps) => {
  const {
    values, showScoreButtons, getScoreButton, top, style,
  } = props;

  const getButtonInfo = React.useCallback(
    (d: number): [number, number] => values.reduce(
      (count, val) => {
        if (val === d) {
          count[0] += 1;
          count[1] += d;
        }
        return count;
      },
      [0, 0],
    ),
    [values],
  );

  const getTopTableButtons = React.useCallback(
    (score: number, showButton: boolean, sum: number, i: number): React.ReactNode | null => {
      if (score >= 0) {
        return score;
      }
      return showScoreButtons ? getScoreButton(showButton, sum, true, i) : null;
    },
    [getScoreButton, showScoreButtons],
  );

  const generateTopTable = React.useCallback(
    (): React.ReactNode => top.map(({ name, score }, i) => {
      const d = i + 1;
      const [count, sum] = getButtonInfo(i + 1);
      const showButton = count >= 1;

      return (
        <TableRow key={name}>
          <TableCell>{`${name}: ${d},${d},${d} = ${d * 3}`}</TableCell>
          <TableCell>{`Add Only ${name}`}</TableCell>
          <TableCell style={style}>{getTopTableButtons(score, showButton, sum, i)}</TableCell>
        </TableRow>
      );
    }),
    [getButtonInfo, getTopTableButtons, style, top],
  );

  const { topSum, finalTopSum } = props;

  return (
    <>
      {generateTopTable()}
      <TopScores topSum={topSum} finalTopSum={finalTopSum} style={style} />
    </>
  );
};

export default TopTable;
