import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { updateName, updateBot } from '../../../store/modules/players';
import { DBRootState, DBPlayer } from '../../../store/types';

interface PlayerActions {
  updateName: Function;
  updateBot: Function;
}
interface PlayerMenuProps {
  playerActions: PlayerActions;
  players: DBPlayer[];
}
interface PlayerMenuState {
  isBot: boolean[];
}

const namePadStyles: React.CSSProperties = {
  maxWidth: '420px',
  width: '100%',
  display: 'block',
  margin: 'auto',
};

class PlayerMenu extends Component<PlayerMenuProps, PlayerMenuState> {
  constructor(props: PlayerMenuProps) {
    super(props);

    this.state = { isBot: []};
  }

  static getDerivedStateFromProps: React.GetDerivedStateFromProps<PlayerMenuProps, PlayerMenuState> = (props) => ({ isBot: props.players.map((a) => a.isBot) })

  handleToggle = (id: number, isChecked: boolean): void => {
    const { playerActions } = this.props;
    playerActions.updateBot(id, isChecked);
  };

  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, id: number): void => {
    const { playerActions } = this.props;
    if (e.key === 'Enter') {
      playerActions.updateName(id, (e.target as HTMLInputElement).value || '');
    }
  };

  render(): React.ReactNode {
    const { players } = this.props;
    const { isBot } = this.state;

    return (
      <div style={namePadStyles}>
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
        {players.map((p, i) => (p.id !== 0
          ? (
            <Grid key={`${p.name},${i}`} container spacing={1}>
              <Grid item xs={9}>
                <TextField
                  defaultValue={p.name}
                  onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>): void => this.handleKeyPress(e, p.id)}
                  placeholder="Enter Player Name"
                />
              </Grid>
              <Grid item xs={3}>
                <Switch
                  checked={isBot[i]}
                  color="primary"
                  onChange={(_e, isC): void => this.handleToggle(p.id, isC)}
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
const mapStateToProps = (state: DBRootState): { players: DBPlayer[] } => ({
  players: state.players,
});
const mapDispatchToProps = (dispatch: Dispatch): { playerActions: PlayerActions } => ({
  playerActions: bindActionCreators({ updateName, updateBot }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerMenu);
