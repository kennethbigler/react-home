import React from 'react';
import PokerGraph from './PokerGraph';
import PokerTable from './PokerTable';
import parseData from './helpers';
import { gigNowPokerScores, gigNowPokerColors } from '../../../constants/poker';

const { parsedScores, totals } = parseData(gigNowPokerScores);

const PokerNight: React.FC = React.memo(() => (
  <>
    <PokerGraph
      parsedScores={parsedScores}
      colors={gigNowPokerColors}
      domain={[-100, 100]}
    />
    <PokerTable totals={totals} />
  </>
));

export default PokerNight;
