import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PennyPokerNight from './PennyPokerNight';
import GigNowPokerNight from './GigNowPokerNight';

/* PokerNightTabs  ->  PennyPokerNight   |->  PokerGraph
 *                |->  GigNowPokerNight  |->  PokerTable */
const PokerNightTabs: React.FC<{}> = React.memo(() => {
  const [tab, setTab] = React.useState(0);

  const handleChange = React.useCallback((event: React.ChangeEvent<{}>, val: number): void => {
    setTab(val);
  }, [setTab]);

  return (
    <>
      <AppBar position="static" style={{ marginBottom: 20, marginTop: 10 }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Penny Poker" />
          <Tab label="GigNow Poker" />
        </Tabs>
      </AppBar>
      {tab === 0 && <PennyPokerNight />}
      {tab === 1 && <GigNowPokerNight />}
    </>
  );
});

export default PokerNightTabs;
