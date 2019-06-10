import React, { memo } from 'react';
// custom
import PokerGraph from './PokerGraph';
import parseData from './helpers';
import { gigNowPokerScores, gigNowPokerColors } from '../../../constants/poker';
// Parents: PokerNightTabs

const PokerNight = memo(() => {
  const { parsedScores } = parseData(gigNowPokerScores);

  return (
    <PokerGraph
      parsedScores={parsedScores}
      colors={gigNowPokerColors}
      domain={[-100, 100]}
    />
  );
});

export default PokerNight;
