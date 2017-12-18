import React, { Component } from 'react';
// Parents: Main

/* --------------------------------------------------
* Poker
* -------------------------------------------------- */

export class Poker extends Component {
  // function to be called on card clicks
  cardClickHandler = (playerNo, handNo, cardNo) => {
    const card = this.state.players[playerNo].hands[handNo].cards[cardNo];
    console.log(card);
  };
  // runs 1x on load or mount
  // componentWillMount > render > componentDidMount
  // runs anytime render would be called, use to update state
  // componentWillReceiveProps > shouldComponentUpdate > componentWillUpdate > render > componentDidUpdate
  // render standard board
  render() {
    return <h1>Hello Poker</h1>;
  }
}
