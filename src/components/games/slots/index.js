// react
import React, {Component} from 'react';
import types from 'prop-types';
// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {payout, updateBet} from '../../../store/modules/players';
// components
import {SlotMachine} from './SlotMachine';
import {DarkTableCell} from '../../common/DarkTableCell';
// material ui
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// functions
import map from 'lodash/map';
// Parents: Main

/* --------------------------------------------------
* Slot Machine
* -------------------------------------------------- */
class SM extends Component {
  // Prop Validation
  static propTypes = {
    // types = [array, bool, func, number, object, string, symbol].isRequired
    playerActions: types.shape({
      payout: types.func.isRequired,
      updateBet: types.func.isRequired,
    }).isRequired,
    players: types.arrayOf(
      types.shape({
        id: types.number.isRequired,
        money: types.number.isRequired,
        bet: types.number.isRequired,
      })
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      reel: SlotMachine.pullHandle(),
    };
  }

  updateSlotMachine = () => {
    const {payout} = this.props.playerActions;
    const {id, bet} = this.props.players[0];
    const dealer = this.props.players[this.props.players.length - 1];
    let reel = SlotMachine.pullHandle();
    let exchange = SlotMachine.getPayout(reel, bet) - bet;
    payout(id, 'win', exchange);
    payout(dealer.id, 'win', -exchange);
    this.setState({reel});
  };

  // https://vegasclick.com/games/slots/how-they-work
  render() {
    const {reel} = this.state;
    const {players} = this.props;
    const player = players[0];
    const dealer = players[players.length - 1];

    // generate code for slot machine
    let slots = [];
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      let row = [];
      for (let j = 0; j < 3; j += 1) {
        row.push(<TableCell key={`${j},${i}`}>{reel[j][i]}</TableCell>);
      }
      // separate into rows
      slots.push(<TableRow key={`row${i}`}>{row}</TableRow>);
    }

    return (
      <div>
        <h1>Welcome to Ken&apos;s Casino Slot Machine</h1>
        <Grid container spacing={16} style={{marginTop: '2em'}}>
          <Grid item sm={6} xs={12}>
            <Grid container spacing={16} style={{marginBottom: '1em'}}>
              <Grid item sm={3} xs={12}>
                <Button
                  color="primary"
                  onClick={this.updateSlotMachine}
                  style={{marginBottom: 15}}
                  variant="raised"
                >
                  Spin
                </Button>
              </Grid>
              <Grid item sm={9} xs={12}>
                <Table>
                  <TableBody>{slots}</TableBody>
                </Table>
              </Grid>
            </Grid>
            <Table>
              <TableHead>
                <TableRow>
                  <DarkTableCell>Player</DarkTableCell>
                  <DarkTableCell>Money</DarkTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>${player.money}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>House</TableCell>
                  <TableCell>${dealer.money}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <DarkTableCell>Slot Roll</DarkTableCell>
                  <DarkTableCell>Payout</DarkTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map(SlotMachine.payoutTable, (row, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {row.win} {row.symbol}
                    </TableCell>
                    <TableCell>{row.payout} : 1</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>
    );
  }
}

// react-redux export
const mapStateToProps = (state /* , ownProps*/) => ({players: state.players});
const mapDispatchToProps = (dispatch) => ({
  playerActions: bindActionCreators({payout, updateBet}, dispatch),
});
export const Slots = connect(mapStateToProps, mapDispatchToProps)(SM);
