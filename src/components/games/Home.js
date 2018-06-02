// react
import React, {Component} from 'react';
import types from 'prop-types';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateName, updateBot} from '../../store/modules/players';
// material ui
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// functions
import map from 'lodash/map';
// Parents: Main

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
class Home extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    playerActions: types.shape({
      updateName: types.func.isRequired,
      updateBot: types.func.isRequired,
    }).isRequired,
    players: types.arrayOf(
      types.shape({
        id: types.number.isRequired,
        name: types.string.isRequired,
        isBot: types.bool.isRequired,
      })
    ).isRequired,
  };

  // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
  // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  static getDerivedStateFromProps(nextProps, prevState) {
    // get old player and current player
    const {players: old} = prevState;
    const {players} = nextProps;

    return old !== players
      ? {players, isBot: map(players, ['isBot', true])}
      : null;
  }

  state = {
    isBot: {},
    players: {},
  };

  styles = {
    namepad: {
      maxWidth: '420px',
      width: '100%',
      display: 'block',
      margin: 'auto',
    },
  };

  handleToggle = (id, isChecked) => {
    this.props.playerActions.updateBot(id, isChecked);
  };

  handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      this.props.playerActions.updateName(id, e.target.value);
    }
  };

  render() {
    const {players} = this.props;
    const {isBot} = this.state;
    const {namepad} = this.styles;
    return (
      <div>
        <h1>Welcome to my ReactJS Game Projects</h1>
        <h2>
          This site was created to learn, check out the{' '}
          <a href="https://github.com/kennethbigler/react-home">
            {'<'}source code{' />'}
          </a>
        </h2>
        <hr />
        <div style={namepad}>
          <Grid container spacing={16}>
            <Grid item xs={9}>
              <h4>Edit Player Names</h4>
            </Grid>
            <Grid item xs={3}>
              <h4>Is Bot?</h4>
            </Grid>
          </Grid>
          {map(
            players,
            (p, i) =>
              p.id !== 0 ? (
                <Grid container key={`${p.name},${i}`} spacing={16}>
                  <Grid item xs={9}>
                    <TextField
                      defaultValue={p.name}
                      onKeyPress={(e) => this.handleKeyPress(e, p.id)}
                      placeholder="Enter Player Name"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Switch
                      checked={isBot[i]}
                      color="primary"
                      onChange={(e, isC) => this.handleToggle(p.id, isC)}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container key={`${p.name},${i}`} spacing={16}>
                  <Grid item xs={9}>
                    <h4>{p.name}</h4>
                  </Grid>
                  <Grid item xs={3}>
                    <Switch checked disabled />
                  </Grid>
                </Grid>
              )
          )}
        </div>
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = (state) => ({players: state.players});
const mapDispatchToProps = (dispatch) => ({
  playerActions: bindActionCreators({updateName, updateBot}, dispatch),
});
export const GameHome = connect(mapStateToProps, mapDispatchToProps)(Home);
