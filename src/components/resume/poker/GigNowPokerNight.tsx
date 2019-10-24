import React, { memo } from 'react';
import PokerGraph from './PokerGraph';
import PokerTable from './PokerTable';
import parseData from './helpers';
import { gigNowPokerScores, gigNowPokerColors } from '../../../constants/poker';

const PokerNight: React.FC<{}> = memo(() => {
  const { parsedScores, totals } = parseData(gigNowPokerScores);

  return (
    <>
      <PokerGraph
        parsedScores={parsedScores}
        colors={gigNowPokerColors}
        domain={[-100, 100]}
      />
      <PokerTable totals={totals} />
    </>
  );
});

export default PokerNight;
