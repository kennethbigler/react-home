import React, { Component } from 'react';
// Parents: Main

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
export class Casino extends Component {
  // props: {
  //   turnActions: object,
  //   turn: object,
  //   blackjack: object
  // };

  constructor() {
    super();
    this.state = {
      players: []
    };
    // binding is necessary to make `this` work in callback when defined x(){}, not x=()=>{}
    // this.setPlayerCount = this.setPlayerCount.bind(this);
  }

  render() {
    return (
      <div>
        <h2>Casino Homepage Placeholder</h2>
      </div>
    );
  }
}
