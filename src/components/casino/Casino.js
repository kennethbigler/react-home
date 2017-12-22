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
        <h2>Welcome to my ReactJS Casino Project</h2>
        <h3>
          This site was created to learn, check out the{' '}
          <a href="https://github.com/kennethbigler/react-home">
            {'<'}source code{' />'}
          </a>
        </h3>
      </div>
    );
  }
}
