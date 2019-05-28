import React, { Component } from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import { updateName, updateBot } from '../../../store/modules/players';
// Parents: Main

/* --------------------------------------------------
* Home
* -------------------------------------------------- */
class Home extends Component {
  styles = {
    namepad: {
      maxWidth: '420px',
      width: '100%',
      display: 'block',
      margin: 'auto',
    },
  };

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
      }),
    ).isRequired,
  };

  state = {
    isBot: {},
    players: {},
  };

  // https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
  // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  static getDerivedStateFromProps(nextProps, prevState) {
    // get old player and current player
    const { players: old } = prevState;
    const { players } = nextProps;

    return old !== players
      ? { players, isBot: map(players, ['isBot', true]) }
      : null;
  }

  handleToggle = (id, isChecked) => {
    const { playerActions } = this.props;
    playerActions.updateBot(id, isChecked);
  };

  handleKeyPress = (e, id) => {
    const { playerActions } = this.props;
    if (e.key === 'Enter') {
      playerActions.updateName(id, e.target.value);
    }
  };

  render() {
    const { players } = this.props;
    const { isBot } = this.state;
    const { namepad } = this.styles;
    return (
      <div style={namepad}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <Typography variant="h5">
              Edit Player Names
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5">
              Is Bot?
            </Typography>
          </Grid>
        </Grid>
        {map(players, (p, i) => (p.id !== 0
          ? (
            <Grid key={`${p.name},${i}`} container spacing={1}>
              <Grid item xs={9}>
                <TextField
                  defaultValue={p.name}
                  onKeyPress={e => this.handleKeyPress(e, p.id)}
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
            <Grid key={`${p.name},${i}`} container spacing={1}>
              <Grid item xs={9}>
                <Typography variant="h5">
                  {p.name}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Switch checked disabled />
              </Grid>
            </Grid>
          )
        ))}
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = state => ({ players: state.players });
const mapDispatchToProps = dispatch => ({
  playerActions: bindActionCreators({ updateName, updateBot }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
