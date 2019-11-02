import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import map from 'lodash/map';
import noop from 'lodash/noop';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import characterList, { resetHeroesStatuses, Alphabet } from '../../../constants/dota2';
import Lineup from './Lineup';
import HeroSelection, { AlphaCharacters } from './HeroSelection';
import {
  addLineup, removeLineup, resetLineup, updateLineup,
} from '../../../store/modules/dota2';
import { DBDota2Phase, DBRootState } from '../../../store/types';

interface Dota2PickerActions {
  updateLineup: Function;
  addLineup: React.MouseEventHandler;
  resetLineup: Function;
  removeLineup: Function;
}
interface Dota2PickerProps {
  order: DBDota2Phase[][];
  actions: Dota2PickerActions;
}
interface Dota2PickerState {
  turn: number;
  set: number;
  characters: AlphaCharacters;
  selected?: {
    key: Alphabet;
    i: number;
  };
}

/* Dota2Picker  ->  HeroSelection
 *             |->  Lineup */
class Dota2Picker extends Component<Dota2PickerProps, Dota2PickerState> {
  constructor(props: Dota2PickerProps) {
    super(props);

    const { order } = props;
    let turn = 1;

    for (let i = 0; i < order[order.length - 1].length; i += 1) {
      const { dire, radiant } = order[order.length - 1][i];
      if (dire.selection && radiant.selection) {
        turn += 2;
      } else if (dire.selection || radiant.selection) {
        turn += 1;
        break;
      } else {
        break;
      }
    }

    this.state = {
      turn,
      set: 0,
      characters: characterList as AlphaCharacters,
      selected: undefined,
    };
  }

  getCurrentPhase = (i: number): DBDota2Phase => {
    const { order } = this.props;
    const { set } = this.state;
    return order[set][Math.floor((i - 1) / 2)];
  }

  pickingOrder = (i: number): string => {
    const phase = this.getCurrentPhase(i);
    const team = phase.dire.number === i ? 'Dire' : 'Radiant';
    return `${team} ${phase.name}`;
  }

  selectHeroAndNextTurn = (): void => {
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
      // regular turn update
      turn += 1;
    }

    phase[team].selection = heroName;
    order[set][phaseIndex] = phase;

    actions.updateLineup(order[set], set);
    this.setState({
      selected: undefined, turn, characters, set,
    });
  }

  handleClick = (key: Alphabet, i: number): void => {
    const { characters, selected } = this.state;
    if (characters[key][i].selected) {
      this.selectHeroAndNextTurn();
      return;
    }
    if (selected) {
      characters[selected.key][selected.i].selected = false;
    }
    characters[key][i].selected = true;
    this.setState({ characters, selected: { key, i }});
  }

  handleReset = (i: number): void => {
    const { actions } = this.props;
    actions.resetLineup(i);

    const { set } = this.state;
    if (set === i) {
      resetHeroesStatuses();
      this.setState({ turn: 1, selected: undefined });
    }
  }

  render(): React.ReactNode {
    const { order, actions } = this.props;
    const { turn, characters } = this.state;

    return (
      <>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open
          onClose={noop}
          message={this.pickingOrder(turn)}
        />
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="flex-container">
              <Typography variant="h2">Dota 2 Picker</Typography>
              <Typography variant="h4">{this.pickingOrder(turn)}</Typography>
              <Button color="primary" onClick={this.selectHeroAndNextTurn} variant="contained">Select &amp; Next</Button>
            </div>
          </Grid>
          {map(order, (lineup, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Lineup
                order={lineup}
                resetLineup={this.handleReset}
                removeLineup={order.length > 1 ? actions.removeLineup : noop}
                i={i}
              />
            </Grid>
          ))}
          <Fab color="primary" aria-label="Add" onClick={actions.addLineup}>
            <AddIcon />
          </Fab>
          <Grid item xs={12}>
            <HeroSelection characters={characters} onClick={this.handleClick} />
          </Grid>
        </Grid>
      </>
    );
  }
}

// react-redux export
const mapStateToProps = (state: DBRootState): { order: DBDota2Phase[][] } => ({
  order: state.dota2,
});
const mapDispatchToProps = (dispatch: Dispatch): { actions: Dota2PickerActions } => ({
  actions: bindActionCreators({
    addLineup,
    removeLineup,
    resetLineup,
    updateLineup,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dota2Picker);
