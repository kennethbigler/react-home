import React, { memo } from 'react';
// custom
import PokerGraph from './PokerGraph';
import PokerTable from './PokerTable';
import parseData from './helpers';
import { gigNowPokerScores, gigNowPokerColors } from '../../../constants/poker';
// Parents: PokerNightTabs

const PokerNight = memo(() => {
  const { parsedScores, totals } = parseData(gigNowPokerScores);

  return (
    <div>
      <PokerGraph
        parsedScores={parsedScores}
        colors={gigNowPokerColors}
        domain={[-100, 100]}
      />
      <PokerTable totals={totals} />
    </div>
  );
});

export default PokerNight;
