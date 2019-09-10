import React, { useState, memo, Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PennyPokerNight from './PennyPokerNight';
import GigNowPokerNight from './GigNowPokerNight';
// Parents: Main

const PokerNightTabs = memo(() => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, val) => {
    setTab(val);
  };

  return (
    <Fragment>
      <AppBar position="static" style={{ marginBottom: 20, marginTop: 10 }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Penny Poker" />
          <Tab label="GigNow Poker" />
        </Tabs>
      </AppBar>
      {tab === 0 && <PennyPokerNight />}
      {tab === 1 && <GigNowPokerNight />}
    </Fragment>
  );
});

export default PokerNightTabs;
