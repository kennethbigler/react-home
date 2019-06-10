import React, { memo } from 'react';
// custom
import PokerGraph from './PokerGraph';
import parseData from './helpers';
import { pennyPokerScores, pennyPokerColors } from '../../../constants/poker';
// Parents: PokerNightTabs

const PennyPokerNight = memo(() => {
  const { parsedScores } = parseData(pennyPokerScores);

  return (
    <PokerGraph
      parsedScores={parsedScores}
      colors={pennyPokerColors}
      domain={[-400, 600]}
      ticks={[-400, -200, 0, 200, 400, 600]}
    />
  );
});

export default PennyPokerNight;
