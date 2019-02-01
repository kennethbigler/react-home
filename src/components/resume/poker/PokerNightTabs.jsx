import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PennyPokerNight from './PennyPokerNight';
import GigNowPokerNight from './GigNowPokerNight';
// Parents: Main

class PokerNightTabs extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <div>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="GigNow Poker" />
            <Tab label="Penny Poker" />
          </Tabs>
        </AppBar>
        {value === 0 && <GigNowPokerNight />}
        {value === 1 && <PennyPokerNight />}
      </div>
    );
  }
}

export default PokerNightTabs;
