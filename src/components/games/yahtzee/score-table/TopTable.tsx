import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import { Dice, TopGameScore } from '../types';
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
  const getButtonInfo = (d: number): [number, number] => {
    const { values } = props;
    return reduce(values, (count, val) => {
      if (val === d) {
        count[0] += 1;
        count[1] += d;
      }
      return count;
    }, [0, 0]);
  };

  const getTopTableButtons = (score: number, showButton: boolean, sum: number, i: number): React.ReactNode | null => {
    const { showScoreButtons, getScoreButton } = props;
    if (score >= 0) {
      return score;
    }
    return showScoreButtons ? getScoreButton(showButton, sum, true, i) : null;
  };

  const generateTopTable = (): React.ReactNode => {
    const { top, style } = props;
    return map(top, ({ name, score }, i) => {
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
    });
  };

  const { topSum, finalTopSum, style } = props;

  return (
    <>
      {generateTopTable()}
      <TopScores topSum={topSum} finalTopSum={finalTopSum} style={style} />
    </>
  );
};

export default TopTable;
