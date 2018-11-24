// react
import React, { Component } from 'react';
// import types from 'prop-types';
// helpers
import sortBy from 'lodash/sortBy';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// components
import characterList from '../../../constants/dota2';
import Lineup from './Lineup';
import HeroSelection from './HeroSelection';
// Parents: Main

/* --------------------------------------------------
* Dota 2 Picker
* -------------------------------------------------- */
class Dota2Picker extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
  };

  state = {
    turn: 1,
    characters: sortBy(characterList, 'name'),
    selected: -1,
    order: [
      { name: 'Ban 1', radiant: { number: 1, selection: null }, dire: { number: 2, selection: null } },
      { name: 'Ban 2', radiant: { number: 3, selection: null }, dire: { number: 4, selection: null } },
      { name: 'Ban 3', radiant: { number: 5, selection: null }, dire: { number: 6, selection: null } },
      { name: 'Pick 1', radiant: { number: 7, selection: null }, dire: { number: 8, selection: null } },
      { name: 'Pick 2', radiant: { number: 10, selection: null }, dire: { number: 9, selection: null } },
      { name: 'Ban 4', radiant: { number: 11, selection: null }, dire: { number: 12, selection: null } },
      { name: 'Ban 5', radiant: { number: 13, selection: null }, dire: { number: 14, selection: null } },
      { name: 'Pick 3', radiant: { number: 16, selection: null }, dire: { number: 15, selection: null } },
      { name: 'Pick 4', radiant: { number: 18, selection: null }, dire: { number: 17, selection: null } },
      { name: 'Ban 6', radiant: { number: 20, selection: null }, dire: { number: 19, selection: null } },
      { name: 'Pick 5', radiant: { number: 21, selection: null }, dire: { number: 22, selection: null } },
    ],
  }

  getCurrentPhase = (i) => {
    const { order } = this.state;
    return order[Math.floor((i - 1) / 2)];
  }

  pickingOrder = (i) => {
    const phase = this.getCurrentPhase(i);
    const team = phase.dire.number === i ? 'Dire' : 'Radiant';
    return `${team} ${phase.name}`;
  }

  selectHeroAndNextTurn = () => {
    let { turn } = this.state;
    const { characters, selected, order } = this.state;

    if (selected < 0) {
      return;
    }

    const phaseIndex = Math.floor((turn - 1) / 2);
    const phase = order[phaseIndex];
    const heroName = characters[selected].name;
    if (turn === 22) {
      if (phase.dire.selection) {
        return;
      }
      phase.dire.selection = heroName;
      this.setState({ selected: -1, order });
      return;
    }
    const team = phase.dire.number === turn ? 'dire' : 'radiant';
    phase[team].selection = heroName;
    turn += 1;
    order[phaseIndex] = phase;
    this.setState({ turn, selected: -1, order });
  }

  handleClick = (i) => {
    const { characters, selected } = this.state;
    if (characters[i].selected) {
      return;
    }
    if (selected >= 0) {
      characters[selected].selected = false;
    }
    characters[i].selected = true;
    this.setState({ characters, selected: i });
  }

  render() {
    const { turn, characters, order } = this.state;
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <div className="flex-container">
              <h1>Dota 2 Picker</h1>
              <h2>{this.pickingOrder(turn)}</h2>
              <Button color="primary" onClick={this.selectHeroAndNextTurn} variant="contained">Select &amp; Next</Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Lineup order={order} i={1} />
            <Lineup order={order} i={2} />
            <Lineup order={order} i={3} />
          </Grid>
          <Grid item xs={12} sm={9}>
            <HeroSelection characters={characters} onClick={this.handleClick} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Dota2Picker;
