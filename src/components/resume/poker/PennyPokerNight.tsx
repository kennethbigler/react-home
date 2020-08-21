import React from 'react';
import PokerGraph from './PokerGraph';
import PokerTable from './PokerTable';
import parseData from './helpers';
import { pennyPokerScores, pennyPokerColors } from '../../../constants/poker';

const { parsedScores, totals } = parseData(pennyPokerScores);

const PennyPokerNight: React.FC = React.memo(() => (
  <>
    <PokerGraph
      parsedScores={parsedScores}
      colors={pennyPokerColors}
      domain={[-400, 600]}
      ticks={[-400, -200, 0, 200, 400, 600]}
    />
    <PokerTable totals={totals} />
  </>
));

export default PennyPokerNight;
