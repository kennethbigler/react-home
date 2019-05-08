import React, { useState, memo } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PennyPokerNight from './PennyPokerNight';
import GigNowPokerNight from './GigNowPokerNight';
// Parents: Main

const PokerNightTabs = memo(() => {
  const [value, setValue] = useState(0);

  const handleChange = (event, val) => {
    setValue(val);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="GigNow Poker" />
          <Tab label="Penny Poker" />
        </Tabs>
      </AppBar>
      {value === 0 && <GigNowPokerNight />}
      {value === 1 && <PennyPokerNight />}
    </div>
  );
});

export default PokerNightTabs;
