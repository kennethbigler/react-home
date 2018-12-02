// react
import React, { Component } from 'react';
import types from 'prop-types';
// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// helpers
import map from 'lodash/map';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// components
import characterList, { resetHeroesStatuses } from '../../../constants/dota2';
import Lineup from './Lineup';
import HeroSelection from './HeroSelection';
// redux functions
import { updateLineup, resetLineup, addLineup } from '../../../store/modules/dota2';
// Parents: Main

/* --------------------------------------------------
* Dota 2 Picker
* -------------------------------------------------- */
class Dota2Picker extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    order: types.arrayOf(
      types.arrayOf(
        types.shape({
          name: types.string.isRequired,
          radiant: types.shape({
            number: types.number.isRequired,
            selection: types.string,
          }).isRequired,
          dire: types.shape({
            number: types.number.isRequired,
            selection: types.string,
          }).isRequired,
        }).isRequired,
      ),
    ).isRequired,
    actions: types.shape({
      updateLineup: types.func.isRequired,
      addLineup: types.func.isRequired,
    }).isRequired,
  };

  state = {
    turn: 1,
    set: 0,
    characters: characterList,
    selected: null,
  }

  getCurrentPhase = (i) => {
    const { order } = this.props;
    const { set } = this.state;
    return order[set][Math.floor((i - 1) / 2)];
  }

  pickingOrder = (i) => {
    const phase = this.getCurrentPhase(i);
    const team = phase.dire.number === i ? 'Dire' : 'Radiant';
    return `${team} ${phase.name}`;
  }

  selectHeroAndNextTurn = () => {
    const { order, actions } = this.props;
    let { turn, set } = this.state;
    const { characters, selected } = this.state;

    // verify character was selected
    if (!selected) {
      return;
    }

    // constants
    const phaseIndex = Math.floor((turn - 1) / 2);
    const phase = order[set][phaseIndex];
    const heroName = characters[selected.key][selected.i].name;
    const team = phase.dire.number === turn ? 'dire' : 'radiant';

    // update hero button color
    characters[selected.key][selected.i].selected = phase.name[0];

    // if last turn
    if (turn === 22) {
      // if already selected
      if (phase.dire.selection) {
        return;
      }

      // if there is a next lineup
      if (set < order.length - 1) {
        set += 1;
        turn = 1;
        resetHeroesStatuses();
      }
    } else {
      // regular turn udpate
      turn += 1;
    }

    phase[team].selection = heroName;
    order[set][phaseIndex] = phase;

    actions.updateLineup(order[set], set);
    this.setState({
      selected: null, turn, characters, set,
    });
  }

  handleClick = (key, i) => {
    const { characters, selected } = this.state;
    if (characters[key][i].selected) {
      this.selectHeroAndNextTurn();
      return;
    }
    if (selected) {
      characters[selected.key][selected.i].selected = false;
    }
    characters[key][i].selected = true;
    this.setState({ characters, selected: { key, i } });
  }

  render() {
    const { order, actions } = this.props;
    const { turn, characters } = this.state;
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
          <Grid item xs={12} sm={4}>
            <Button color="primary" fullWidth onClick={() => actions.resetLineup(0)} variant="contained">Reset</Button>
            {map(order, (lineup, i) => <Lineup order={lineup} i={i} key={i} />)}
          </Grid>
          <Grid item xs={12} sm={8}>
            <HeroSelection characters={characters} onClick={this.handleClick} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = state => ({ order: state.dota2 });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ updateLineup, resetLineup, addLineup }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dota2Picker);
